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
    const sid = getSession()
    if (!sid) return
    try {
      const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
      const carts: ServerCartItem[] = ((data.value as any)?.data?.carts) || []
      const byKey: Record<string, ServerCartItem> = {}
      for (const c of carts) {
        const vo = Array.isArray(c.variant_options) ? c.variant_options : []
        const sizeOpt = vo.find(v => String(v.variant).toLowerCase() === 'ukuran')?.option
        const colorOpt = vo.find(v => String(v.variant).toLowerCase() === 'warna')?.option
        const key = makeKey(String(c.product_id), sizeOpt || undefined, colorOpt || undefined)
        byKey[key] = c
      }
      items.value.forEach(it => {
        const sc = byKey[it.key]
        if (sc) {
          it.cartId = sc.id
          it.qty = Number(sc.quantity || 0)
          if (typeof sc.price === 'number') it.price = sc.price
        }
      })
    } catch (e) {
      console.error('GET /cart gagal:', e)
    }
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

    async function resolveVariantOptionIds(productId: string, sizeName?: string, colorName?: string) {
      try {
        const { data } = await ApiService.query(`/product/${productId}`, { headers })
        const root = (data.value as any)?.data?.product || (data.value as any)?.data || (data.value as any)
        const variants: any[] = root?.variants || []
        const combinations: any[] = root?.combinations || []
        const pickId = (labelLower: 'ukuran' | 'warna', name?: string) => {
          if (!name) return null
          const v = variants.find(v => String(v.name ?? '').trim().toLowerCase() === labelLower)
          if (!v?.options?.length) return null
          const opt = v.options.find((o: any) => String((o.name ?? o?.option?.name) ?? '').trim().toLowerCase() === String(name).trim().toLowerCase())
          return opt?.id || opt?.option?.id || null
        }
        const sizeId = pickId('ukuran', sizeName)
        const colorId = pickId('warna', colorName)
        const ids = [sizeId, colorId].filter(Boolean) as string[]
        if (ids.length) return ids
        if (Array.isArray(combinations) && combinations.length === 1) {
          const comboIds = (combinations[0] as any)?.product_variant_option_ids || []
          return (Array.isArray(comboIds) ? comboIds.filter(Boolean) : []) as string[]
        }
        const singleVariantIds = variants
          .map(v => (Array.isArray(v.options) && v.options.length === 1 ? (v.options[0]?.id || v.options[0]?.option?.id || null) : null))
          .filter(Boolean)
        if (singleVariantIds.length && singleVariantIds.length === variants.length) {
          return singleVariantIds as string[]
        }
        return []
      } catch { return [] }
    }

    const sid = getSession()
    if (!sid) return
    try {
      const optionIds = (Array.isArray(p.optionIds) && p.optionIds.length)
        ? p.optionIds.filter(Boolean) as string[]
        : await resolveVariantOptionIds(p.id, p.size, p.color)
      await ApiService.post('/cart', {
        session_id: sid,
        products: [
          { id: p.id, quantity: addQty, product_variant_option_ids: optionIds, combination_id: p.combinationId ?? undefined }
        ]
      }, { ...jsonHeaders })
      await fetchServerCart()
    } catch (e) {
      console.error('POST /cart gagal:', e)
    }
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

    const sid = getSession()
    if (!sid) return

    try {
      const optionIds = (Array.isArray(it.optionIds) && it.optionIds.length) ? it.optionIds : await (async () => {
        try {
          const { data } = await ApiService.query(`/product/${it.id}`, { headers })
          const root = (data.value as any)?.data?.product || (data.value as any)?.data || (data.value as any)
          const variants: any[] = root?.variants || []
          const combinations: any[] = root?.combinations || []
          const pickId = (labelLower: 'ukuran' | 'warna', name?: string) => {
            if (!name) return null
            const v = variants.find(v => String(v.name ?? '').trim().toLowerCase() === labelLower)
            if (!v?.options?.length) return null
            const opt = v.options.find((o: any) => String((o.name ?? o?.option?.name) ?? '').trim().toLowerCase() === String(name).trim().toLowerCase())
            return opt?.id || opt?.option?.id || null
          }
          const sizeId = pickId('ukuran', it.size)
          const colorId = pickId('warna', it.color)
          const ids = [sizeId, colorId].filter(Boolean) as string[]
          if (ids.length) return ids
          if (Array.isArray(combinations) && combinations.length === 1) {
            const comboIds = (combinations[0] as any)?.product_variant_option_ids || []
            return (Array.isArray(comboIds) ? comboIds.filter(Boolean) : []) as string[]
          }
          const singleVariantIds = variants
            .map(v => (Array.isArray(v.options) && v.options.length === 1 ? (v.options[0]?.id || v.options[0]?.option?.id || null) : null))
            .filter(Boolean)
          if (singleVariantIds.length && singleVariantIds.length === variants.length) {
            return singleVariantIds as string[]
          }
          return []
        } catch { return [] }
      })()
      await ApiService.post('/cart', {
        session_id: sid,
        products: [
          { id: it.id, quantity: it.qty, product_variant_option_ids: optionIds, combination_id: it.combinationId ?? undefined }
        ]
      }, { ...jsonHeaders })
      await fetchServerCart()
    } catch (e) {
      console.error('PATCH/POST qty gagal:', e)
    }
  }

  async function remove(key: string) {
    const idx = items.value.findIndex(i => i.key === key)
    if (idx < 0) return
    const snapshot = items.value[idx]
    items.value.splice(idx, 1)

    const sid = getSession()
    if (!sid) return

    try {
      let cid = snapshot.cartId
      if (!cid) {
        const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
        const carts: ServerCartItem[] = ((data.value as any)?.data?.carts) || []
        const target = carts.find(c => {
          const vo = Array.isArray(c.variant_options) ? c.variant_options : []
          const sizeOpt = vo.find(v => String(v.variant).toLowerCase() === 'ukuran')?.option || '-'
          const colorOpt = vo.find(v => String(v.variant).toLowerCase() === 'warna')?.option || '-'
          return String(c.product_id) === String(snapshot.id) &&
            String(sizeOpt) === String(snapshot.size ?? '-') &&
            String(colorOpt) === String(snapshot.color ?? '-')
        })
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

  if (process.client) fetchServerCart()

  return { items, count, total, addItem, updateQty, remove, clear, clearAll, fetchServerCart }
}
