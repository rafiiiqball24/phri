import { computed, watch } from 'vue'
import ApiService from '@/core/services/ApiService'
import { ensureSession, getSession } from '@/composables/useSession'

export type CartItem = {
  key: string
  id: string
  name: string
  image: string
  price: number
  qty: number
  stock?: number
  color?: string
  size?: string
  optionIds?: string[]
  combinationId?: string | null
  cartId?: string
}

type ServerCartItem = {
  id: string
  product_id: string | number
  quantity: number
  variant_options?: Array<{ variant: string; option: string }>
  price?: number
}

function makeKey(id: string, size?: string, color?: string) {
  return [id, size || '-', color || '-'].join('|')
}

export function useCart() {
  const items = useState<CartItem[]>('cart_items', () => [])

  const config = useRuntimeConfig()
  const apiKey = (config.public.xApiKey || config.public.apiKey || '') as string
  const headers = apiKey ? { 'x-api-key': apiKey, Accept: 'application/json' } : { Accept: 'application/json' }
  const jsonHeaders = { ...headers, 'Content-Type': 'application/json' }

  if (process.client) {
    const saved = localStorage.getItem('phri_cart_v1')
    if (saved && items.value.length === 0) {
      try { items.value = JSON.parse(saved) } catch {}
    }
    ensureSession()
  }

  watch(items, (val) => {
    if (process.client) localStorage.setItem('phri_cart_v1', JSON.stringify(val))
  }, { deep: true })

  const count = computed(() => items.value.reduce((a, it) => a + it.qty, 0))
  const total = computed(() => items.value.reduce((a, it) => a + it.qty * it.price, 0))

  async function fetchServerCart() {
    // Local-only cart: no server sync
    return
  }

  async function addItem(p: {
    id: string; name: string; image: string; price: number;
    qty?: number; size?: string; color?: string; stock?: number; optionIds?: string[]; combinationId?: string | null
  }) {
    const key = makeKey(p.id, p.size, p.color)
    const exist = items.value.find(it => it.key === key)
    const addQty = Math.max(1, p.qty ?? 1)

    if (exist) {
      if (typeof p.stock === 'number') exist.stock = p.stock
      const maxStock = typeof exist.stock === 'number' ? exist.stock : Infinity
      exist.qty = Math.min(maxStock, exist.qty + addQty)
      await updateQty(key, exist.qty)
      return
    }

    items.value.push({
      key,
      id: p.id,
      name: p.name,
      image: p.image,
      price: Number(p.price || 0),
      qty: Math.min(typeof p.stock === 'number' ? p.stock : Infinity, addQty),
      stock: typeof p.stock === 'number' ? p.stock : undefined,
      size: p.size,
      color: p.color,
      optionIds: Array.isArray(p.optionIds) ? p.optionIds.filter(Boolean) : undefined,
      combinationId: p.combinationId ?? null
    })

    // Local-only cart: do not POST to /cart
    return
  }

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

    // Local-only cart: do not sync quantity to server
    return
  }

  async function remove(key: string) {
    const idx = items.value.findIndex(i => i.key === key)
    if (idx < 0) return
    const snapshot = items.value[idx]
    items.value.splice(idx, 1)

    // Local-only cart: do not delete from server
    return
  }

  function clear() { items.value = [] }

  async function clearAll() {
    items.value = []
    if (process.client) {
      try { localStorage.removeItem('phri_cart_v1') } catch {}
    }
    // Local-only cart: no server-side clear
    return
  }

  // No initial server sync; cart is local-only

  return { items, count, total, addItem, updateQty, remove, clear, clearAll, fetchServerCart }
}
