// composables/useCart.ts
import { computed, watch } from 'vue'
import ApiService from '@/core/services/ApiService'

export type CartItem = {
  key: string              // id|size|color (unik per varian)
  id: string               // product_id
  name: string
  image: string
  price: number
  qty: number
  stock?: number
  color?: string
  size?: string
  cartId?: string          // <-- id cart dari server (untuk DELETE/PATCH)
}

type ServerCartItem = {
  id: string               // cart_id (UNTUK DELETE)
  product_id: string | number
  qty: number
  size?: string | null
  color?: string | null
  // field lain diabaikan
}

/* ===== Helpers umum ===== */
function makeKey(id: string, size?: string, color?: string) {
  return [id, size || '-', color || '-'].join('|')
}
function getSession(): string | null {
  if (!process.client) return null
  try { return localStorage.getItem('phri_session_id') } catch { return null }
}
function ensureSession() {
  if (!process.client) return
  try {
    let sid = localStorage.getItem('phri_session_id')
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('phri_session_id', sid) }
  } catch {}
}

export function useCart() {
  const items = useState<CartItem[]>('cart_items', () => [])

  // ==== API config
  const config = useRuntimeConfig()
  const apiKey = (config.public.xApiKey || config.public.apiKey || '') as string
  const headers = apiKey ? { 'x-api-key': apiKey, Accept: 'application/json' } : { Accept: 'application/json' }

  // ==== restore local (awal), lalu sinkron server
  if (process.client) {
    const saved = localStorage.getItem('phri_cart_v1')
    if (saved && items.value.length === 0) {
      try { items.value = JSON.parse(saved) } catch {}
    }
    ensureSession()
  }

  // persist setiap perubahan (fallback offline)
  watch(items, (val) => {
    if (process.client) localStorage.setItem('phri_cart_v1', JSON.stringify(val))
  }, { deep: true })

  const count = computed(() => items.value.reduce((a, it) => a + it.qty, 0))
  const total = computed(() => items.value.reduce((a, it) => a + it.qty * it.price, 0))

  /* ====== Fetch dari server → merge ke lokal ====== */
  async function fetchServerCart() {
    const sid = getSession()
    if (!sid) return
    try {
      const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
      const carts: ServerCartItem[] = ((data.value as any)?.data?.carts) || []

      // map server -> lokal (hanya qty & cartId, nama/price/image tetap dari lokal)
      const byKey: Record<string, ServerCartItem> = {}
      for (const c of carts) {
        const key = makeKey(String(c.product_id), c.size ?? undefined, c.color ?? undefined)
        byKey[key] = c
      }

      // update cartId & qty item yang sudah ada
      items.value.forEach(it => {
        const sc = byKey[it.key]
        if (sc) {
          it.cartId = sc.id
          it.qty = sc.qty
        }
      })

      // opsional: tambahkan item yang ada di server tapi belum ada di lokal
      // (kalau dibutuhkan, isi name/image/price dari placeholder)
      // for (const key in byKey) {
      //   if (!items.value.find(it => it.key === key)) {
      //     const sc = byKey[key]
      //     items.value.push({
      //       key,
      //       id: String(sc.product_id),
      //       name: 'Produk',
      //       image: '/placeholder.png',
      //       price: 0,
      //       qty: sc.qty,
      //       size: sc.size ?? undefined,
      //       color: sc.color ?? undefined,
      //       cartId: sc.id,
      //     })
      //   }
      // }
    } catch (e) {
      // diamkan → tetap bisa jalan offline
      console.error('GET /cart gagal:', e)
    }
  }

  /* ====== Tambah item ======
     - POST /cart { session_id, product_id, qty, size, color }
     - Simpan cartId dari response GET berikutnya (atau jika POST mengembalikan id, ambil langsung)
  */
  async function addItem(p: {
    id: string; name: string; image: string; price: number;
    qty?: number; size?: string; color?: string; stock?: number
  }) {
    const key = makeKey(p.id, p.size, p.color)
    const exist = items.value.find(it => it.key === key)

    const addQty = Math.max(1, p.qty ?? 1)
    if (exist) {
      if (typeof p.stock === 'number') exist.stock = p.stock
      const maxStock = typeof exist.stock === 'number' ? exist.stock : Infinity
      exist.qty = Math.min(maxStock, exist.qty + addQty)
      await updateQty(key, exist.qty) // sekalian sync
      return
    }

    // push dulu agar UI responsif
    items.value.push({
      key,
      id: p.id,
      name: p.name,
      image: p.image,
      price: Number(p.price || 0),
      qty: Math.min(typeof p.stock === 'number' ? p.stock : Infinity, addQty),
      stock: typeof p.stock === 'number' ? p.stock : undefined,
      size: p.size,
      color: p.color
    })

    // sync ke server (best-effort)
    const sid = getSession()
    if (!sid) return
    try {
      await ApiService.post('/cart', {
        session_id: sid,
        product_id: p.id,
        qty: addQty,
        size: p.size || null,
        color: p.color || null
      }, { headers })

      // ambil cartId terbaru
      await fetchServerCart()
    } catch (e) {
      console.error('POST /cart gagal:', e)
    }
  }

  /* ====== Update qty ======
     - Kalau punya cartId → PATCH /cart/{cartId} { qty }
     - Kalau belum, coba cari cartId dulu dari GET /cart
  */
  async function updateQty(key: string, qty: number) {
    const it = items.value.find(i => i.key === key)
    if (!it) return
    if (typeof (it as any).stock !== 'number') {
      try {
        const { data } = await ApiService.query(`/product/${it.id}`, { headers })
        const root = (data.value as any)?.data?.product || (data.value as any)?.data || (data.value as any)
        const s = Number(root?.quantity ?? 0)
        if (Number.isFinite(s)) (it as any).stock = s
      } catch {}
    }
    let newQty = Math.max(0, Number(qty) || 0)
    if (typeof it.stock === 'number') newQty = Math.min(it.stock, newQty)
    it.qty = newQty

    const sid = getSession()
    if (!sid) return

    if (!it.cartId) await fetchServerCart()

    try {
      if (it.cartId) {
        // backend umumnya terima PATCH atau PUT; pilih PATCH dulu
        await ApiService.patch(`/cart/${it.cartId}`, { qty: it.qty }, { headers })
      } else {
        // fallback: kalau belum ada cartId, pakai POST untuk set qty terbaru
        await ApiService.post('/cart', {
          session_id: sid,
          product_id: it.id,
          qty: it.qty,
          size: it.size || null,
          color: it.color || null
        }, { headers })
        await fetchServerCart()
      }
    } catch (e) {
      console.error('PATCH/POST qty gagal:', e)
    }
  }

  /* ====== Remove ======
     - Hapus lokal agar UI responsif
     - Jika ada cartId → DELETE /cart/{cartId}
     - Kalau tidak ada cartId → GET lalu cari, baru DELETE
  */
  async function remove(key: string) {
    const idx = items.value.findIndex(i => i.key === key)
    if (idx < 0) return
    const snapshot = items.value[idx] // simpan untuk server call
    items.value.splice(idx, 1)        // hapus lokal

    const sid = getSession()
    if (!sid) return

    try {
      let cid = snapshot.cartId
      if (!cid) {
        const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
        const carts: ServerCartItem[] = ((data.value as any)?.data?.carts) || []
        const target = carts.find(c =>
          String(c.product_id) === String(snapshot.id) &&
          String(c.size ?? '-') === String(snapshot.size ?? '-') &&
          String(c.color ?? '-') === String(snapshot.color ?? '-')
        )
        cid = target?.id
      }
      if (cid) {
        await ApiService.delete(`/cart/${cid}`, undefined, { headers })
      }
    } catch (e) {
      console.error('DELETE /cart gagal:', e)
    }
  }

  function clear() { items.value = [] }

  async function clearAll() {
    // kosongkan lokal lebih dulu agar UI langsung update
    items.value = []
    if (process.client) {
      try { localStorage.removeItem('phri_cart_v1') } catch {}
    }

    const sid = getSession()
    if (!sid) return
    try {
      const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
      const carts: ServerCartItem[] = ((data.value as any)?.data?.carts) || []
      await Promise.allSettled(
        carts.map(c => ApiService.delete(`/cart/${c.id}`, undefined, { headers }))
      )
    } catch (e) {
      console.error('Clear all cart (server) gagal:', e)
    }
  }

  // sinkron awal (client)
  if (process.client) fetchServerCart()

  return { items, count, total, addItem, updateQty, remove, clear, clearAll, fetchServerCart }
}
