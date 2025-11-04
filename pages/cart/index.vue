<template>
  <section class="page container">
    <Breadcrumb :items="[
      { label: 'Beranda', to: '/' },
      { label: 'Detail Produk', to: '/detail-product' },
      { label: 'Keranjang' },
    ]" />

    <div v-if="showDebug" class="dbg">
      <span class="dbg__title">Debug:</span>
      <button class="dbg__btn" :class="{ on: dbg.loading }" @click="toggleLoading">
        {{ dbg.loading ? 'Matikan' : 'Nyalakan' }} Skeleton
      </button>
      <button class="dbg__btn" :class="{ on: dbg.empty }" @click="toggleEmpty">
        {{ dbg.empty ? 'Isi Lagi' : 'Kosongkan' }} Keranjang
      </button>
    </div>

    <div v-if="!dbg.loading && displayedItems.length === 0" class="empty">
      <img src="/img/icons/EmptyState.svg" alt="" class="empty__img" />
      <h3 class="empty__title">Keranjangmu masih kosong</h3>
      <p class="empty__text">Yuk mulai belanja dan temukan produk terbaik dari PHRI.</p>
      <NuxtLink to="/" class="btn btn--primary">Belanja Sekarang</NuxtLink>
    </div>

    <div v-else class="cols">
      <div>
        <!-- PILIH SEMUA -->
        <div class="selectbar" v-if="!dbg.loading && displayedItems.length">
          <label class="chk">
            <input type="checkbox" :checked="allChecked" @change="toggleAll" />
            <span>Pilih Semua ({{ selectedItems.length }})</span>
          </label>
        </div>

        <div class="list">
          <!-- Skeleton -->
          <article v-if="dbg.loading" v-for="n in 3" :key="'skel' + n" class="row">
            <div class="row__thumb skel"></div>
            <div class="row__main">
              <div class="row__head">
                <div class="skel skel--line skel--w160"></div>
                <div class="skel skel--chip"></div>
              </div>
              <div class="row__meta">
                <div class="skel skel--line skel--w140"></div>
                <div class="skel skel--line skel--w100"></div>
              </div>
              <div class="row__foot">
                <div class="skel skel--price"></div>
                <div class="skel skel--stepper"></div>
              </div>
            </div>
          </article>

          <!-- Rows -->
          <article v-else v-for="(it, i) in displayedItems" :key="it.key" class="row row--withcheck">
            <div class="row__check">
              <input type="checkbox" :checked="isChecked(it.key)" @change="() => toggleOne(it.key)" />
            </div>

            <figure class="row__thumb"><img :src="it.image" :alt="it.name" /></figure>

            <div class="row__main">
              <div class="row__head">
                <h3 class="row__name">{{ it.name }}</h3>
                <button class="row__remove" @click="onRemove(it)">Hapus</button>
              </div>
              <div class="row__meta">
                <span v-if="it.color">Warna: <b>{{ it.color }}</b></span>
                <span v-if="it.size">Ukuran: <b>{{ it.size }}</b></span>
              </div>
              <div class="row__foot">
                <div class="row__price">Rp{{ formatIDR(it.price) }}</div>
                <div class="qty">
                  <button class="qbtn" @click="decQty(i)" :disabled="it.qty <= 0">-</button>
                  <span class="qval">{{ it.qty }}</span>
                  <button class="qbtn" @click="incQty(i)" :disabled="isMax(i)">+</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <SummaryBox v-if="!dbg.loading" title="Ringkasan Pembelian" :count-label="`${selectedItems.length} Item dipilih`"
        :lines="[
          ...selectedItems.map((it) => ({ name: `${it.qty}× ${it.name}`, price: it.price * it.qty })),
          ...(paymentFeeDisplay > 0 ? [{ name: 'Payment Fee', price: paymentFeeDisplay }] : []),
        ]" total-label="Estimasi Pembayaran" :total="grandTotalSelected" cta="Buat Pesanan" :cta-disabled="!canOrder"
        @cta="goCheckout" :links="[
          { label: 'Butuh Bantuan?', to: '/help' },
          { label: 'Hubungi Kami', to: '/contact', underline: true },
          { label: 'Informasi Pengiriman', to: '/help', underline: true },
        ]" />
    </div>

    <Recommendations v-if="!dbg.loading && rec.length" class="product-recs" title="Rekomendasi Untuk di Beli"
      :items="rec" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import { useCurrency } from '@/composables/useCurrency'
import { useCart } from '@/composables/useCart'

useHead({ title: 'Cart' })

type CartItem = {
  key: string
  id: string | number
  name: string
  image: string
  price: number
  qty: number
  stock?: number
  color?: string
  size?: string
}

type VariantOpt = { id: string; name: string }
type Variant = { name: string; options: VariantOpt[] }
type ProductApi = {
  id: string
  name: string
  slug?: string
  thumbnail?: string
  price: number
  quantity: number | string
  description?: string
  product_category?: { id: string; name: string }
  variants?: Variant[]
  images?: any[]
  gallery?: any[]
  medias?: any[]
}

const { formatIDR } = useCurrency()
const router = useRouter()

const showDebug = false
const dbg = ref({ loading: false, empty: false })
function toggleLoading() { dbg.value.loading = !dbg.value.loading }
function toggleEmpty() { dbg.value.empty = !dbg.value.empty }

const { items, total, updateQty, remove } = useCart()
const displayedItems = computed<CartItem[]>(() =>
  dbg.value.empty ? [] : ((items.value as unknown) as CartItem[])
)

const config = useRuntimeConfig()
const apiKey = (config.public.xApiKey || config.public.apiKey || '') as string
const headers = apiKey ? { 'x-api-key': apiKey, Accept: 'application/json' } : { Accept: 'application/json' }

const assetBase =
  (config.public.assetBase as string) ||
  (config.public.baseURL as string)?.replace(/\/api\/?$/, '') ||
  ''
const asset = (p?: string) => (!p ? '' : p.startsWith('http') ? p : `${assetBase}/${p.replace(/^\/+/, '')}`)

function getSession(): string | null {
  try { return localStorage.getItem('phri_session_id') } catch { return null }
}

const paymentFee = ref(0)
const paymentFeeDisplay = computed(() => (canOrder.value ? paymentFee.value : 0))

async function fetchCartFee() {
  const sid = getSession()
  if (!sid) { paymentFee.value = 0; return }
  try {
    const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
    const root = (data.value as any)?.data || {}
    paymentFee.value = Number(root?.payment_fee ?? 0)
  } catch { paymentFee.value = 0 }
}

function onQtyChange(i: number, v: number) {
  const it = displayedItems.value[i]
  if (!it) return
  const max = (it as any).stock ?? Infinity
  const vv = Math.max(0, Math.min(Number(v) || 0, max))
    ; (updateQty as any)(it.key, vv)
  const raw = (items.value as unknown) as CartItem[]
  const target = raw.find((r) => r.key === it.key)
  if (target) target.qty = vv
}
function incQty(i: number) { const it = displayedItems.value[i]; if (!it) return; onQtyChange(i, (it.qty || 0) + 1) }
function decQty(i: number) { const it = displayedItems.value[i]; if (!it) return; onQtyChange(i, (it.qty || 0) - 1) }

function isMax(i: number) {
  const it = displayedItems.value[i]
  if (!it) return false
  const s = (it as any).stock
  const max = typeof s === 'number' && s > 0 ? s : Infinity
  return (it.qty || 0) >= max
}

async function onRemove(it: CartItem) {
  ; (remove as any)(it.key)
  selected.value.delete(it.key)
  persistSelection()
  fetchCartFee()
}

function ensureSession() {
  try {
    let sid = localStorage.getItem('phri_session_id')
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('phri_session_id', sid) }
  } catch { }
}

/* =======================
   Seleksi item (checkbox)
   ======================= */
const selected = ref<Set<string>>(new Set())

onMounted(() => {
  // default pilih semua
  for (const it of displayedItems.value) selected.value.add(it.key)
  // pulihkan dari storage
  try {
    const raw = localStorage.getItem('phri_cart_selected_keys')
    if (raw) selected.value = new Set(JSON.parse(raw) as string[])
  } catch { }
})

watch(displayedItems, (arr) => {
  const keysNow = new Set(arr.map((it) => it.key))
  // drop yg hilang
  for (const k of Array.from(selected.value)) if (!keysNow.has(k)) selected.value.delete(k)
  // pilih default item baru
  for (const it of arr) if (!selected.value.has(it.key)) selected.value.add(it.key)
  persistSelection()
}, { deep: true })

function isChecked(key: string) { return selected.value.has(key) }
function toggleOne(key: string) {
  if (selected.value.has(key)) selected.value.delete(key)
  else selected.value.add(key)
  persistSelection()
}
const allChecked = computed(() =>
  displayedItems.value.length > 0 && displayedItems.value.every((it) => selected.value.has(it.key))
)
function toggleAll() {
  if (allChecked.value) selected.value.clear()
  else for (const it of displayedItems.value) selected.value.add(it.key)
  persistSelection()
}
function persistSelection() {
  try { localStorage.setItem('phri_cart_selected_keys', JSON.stringify([...selected.value])) } catch { }
}

// hanya item terpilih
const selectedItems = computed<CartItem[]>(() =>
  displayedItems.value.filter((it) => selected.value.has(it.key))
)
const selectedSubtotal = computed(() =>
  selectedItems.value.reduce((s, it) => s + Number(it.price) * Number(it.qty || 0), 0)
)
const selectedTotalQty = computed(() =>
  selectedItems.value.reduce((s, it) => s + (Number(it.qty) || 0), 0)
)
const canOrder = computed(() => selectedTotalQty.value > 0)
const grandTotalSelected = computed(() => (dbg.value.empty ? 0 : selectedSubtotal.value + paymentFeeDisplay.value))

function goCheckout() {
  if (!canOrder.value) return
  ensureSession()
  try {
    localStorage.setItem('phri_checkout_selection', JSON.stringify(selectedItems.value.map((it) => it.key)))
  } catch { }
  router.push('/checkout')
}

/* =======================
   Rekomendasi produk
   ======================= */
const rec = ref<Array<{ to: any; name: string; image: string; price: number; tags: string[]; soldOut: boolean }>>([])

function normalizeImages(p: ProductApi): string[] {
  const arr =
    (Array.isArray(p.images) && p.images) ||
    (Array.isArray(p.gallery) && p.gallery) ||
    (Array.isArray(p.medias) && p.medias) ||
    []
  const imgs = arr
    .map((it: any) => (typeof it === 'string' ? it : it?.url || it?.path || it?.src))
    .filter(Boolean)
    .map((u: string) => asset(u))
  if (!imgs.length && p.thumbnail) imgs.push(asset(p.thumbnail))
  return imgs
}
function mapToCard(p: ProductApi) {
  const tags = (p.variants?.find((v) => v.name?.toLowerCase() === 'warna')?.options || [])
    .map((o) => o.name)
    .slice(0, 4)
  return {
    to: { path: '/detail-product', query: { slug: p.slug } },
    name: p.name,
    image: normalizeImages(p)[0] || asset(p.thumbnail) || '',
    price: Number(p.price ?? 0),
    tags,
    soldOut: Number(p.quantity ?? 0) <= 0,
  }
}
async function fetchRecommendations() {
  try {
    const { data, error } = await ApiService.query('/product', { params: { page: 1 }, headers })
    if (error.value) return
    const arr: ProductApi[] = (data.value as any)?.data?.products?.data || []
    const cartIds = new Set((items.value as any[]).map((it) => String(it.id)))
    const cleaned = arr.filter((p) => !cartIds.has(String(p.id)))
    rec.value = cleaned.slice(0, 10).map(mapToCard)
  } catch { }
}

/* =======================
   Sinkron stok di cart
   ======================= */
watch(items, () => {
  fetchRecommendations()
  syncCartStocks()
}, { deep: true })

async function syncCartStocks() {
  try {
    const arr = (items.value as unknown) as CartItem[]
    if (!Array.isArray(arr) || arr.length === 0) return
    const uniqueIds = Array.from(new Set(arr.map((it) => String(it.id))))
    const results = await Promise.allSettled(
      uniqueIds.map(async (id) => {
        const { data, error } = await ApiService.query(`/product/${id}`, { headers })
        if (error.value) throw error.value
        const root = (data.value as any)?.data?.product || (data.value as any)?.data || (data.value as any)
        const stock = Number(root?.quantity ?? 0)
        return { id, stock }
      })
    )
    const stockMap = new Map<string, number>()
    for (const r of results) if (r.status === 'fulfilled') stockMap.set(r.value.id, r.value.stock)

    for (const it of arr) {
      const s = stockMap.get(String(it.id))
      const cur = (it as any).stock
      if (typeof s === 'number' && (typeof cur !== 'number' || (cur <= 0 && s > 0))) (it as any).stock = s
      const max = (it as any).stock ?? Infinity
      if (typeof it.qty === 'number' && it.qty > max) {
        ; (updateQty as any)(it.key, max)
        it.qty = max
      }
    }
  } catch { }
}

onMounted(() => {
  ensureSession()
  fetchCartFee()
  fetchRecommendations()
  syncCartStocks()
})
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 300px;
}

.dbg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0 4px;
}

.dbg__title {
  font: 600 12px/18px var(--ff);
  color: #757575;
}

.dbg__btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ededed;
  background: #fff;
  cursor: pointer;
  font: 500 12px/18px var(--ff);
}

.dbg__btn.on {
  border-color: #ffd6a6;
  background: #fff7ea;
  color: #b96a00;
}

.cols {
  display: grid;
  grid-template-columns: 1fr 392px;
  gap: 28px;
  align-items: start;
  margin-top: 12px;
}

/* PILIH SEMUA */
.selectbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0 8px;
}

.chk {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 500 14px/22px var(--ff);
  color: var(--text);
}

.chk input {
  width: 16px;
  height: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: grid;
  grid-template-columns: 186px 1fr;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
}

.row--withcheck {
  grid-template-columns: 24px 186px 1fr;
}

.row__check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row__check input {
  width: 16px;
  height: 16px;
}

.row__thumb {
  width: 186px;
  height: 134px;
  border-radius: 8px;
  overflow: hidden;
  background: #f2f2f2;
  margin: 0;
}

.row__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
  display: block;
}

.row__main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row__name {
  margin: 0;
  font: 600 16px/24px var(--ff);
  color: var(--text);
}

.row__remove {
  background: none;
  border: 0;
  cursor: pointer;
  font: 500 12px/18px var(--ff);
  color: var(--text);
}

.row__meta {
  display: flex;
  gap: 16px;
  font: 500 14px/22px var(--ff);
  color: var(--text);
}

.row__meta b {
  font-weight: 400;
  color: #757575;
}

.row__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row__price {
  margin-top: 20px;
  font: 700 16px/24px var(--ff);
  color: var(--text);
}

.qty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 4px;
}

.qbtn {
  width: 32px;
  height: 32px;
  border: 0;
  background: #fafafa;
  border-radius: 6px;
  cursor: pointer;
}

.qbtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qval {
  min-width: 24px;
  text-align: center;
  font: 600 14px/1 var(--ff);
}

.btn.btn--primary {
  text-decoration: none;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 0 48px;
  gap: 10px;
}

.empty__img {
  width: 200px;
  height: 200px;
}

.empty__title {
  margin: 6px 0 0;
  font: 700 18px/26px var(--ff);
  color: var(--text);
}

.empty__text {
  margin: 0 0 6px;
  font: 400 14px/22px var(--ff);
  color: #757575;
}

.skel {
  background: linear-gradient(270deg, rgba(219, 219, 219, 0.05) 0%, #dbdbdb 50%, rgba(219, 219, 219, 0.05) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  border-radius: 8px;
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #c2c2c2;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease, border-color 0.15s ease;
}


input[type="checkbox"]:checked {
  background-color: #f79f24;
  border-color: #f79f24;
}

input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 0px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Opsional: hover state */
input[type="checkbox"]:hover {
  border-color: #ffb84d;
}


@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.product-recs {
  position: relative;
  transform: translateY(150px);
}

/* Override carousel styles for the cart page */
.product-recs :deep(.rec__carousel) {
  margin: 0 -20px;
  padding: 0 20px;
}

.product-recs :deep(.rec__slide) {
  min-width: 220px;
}

@media (max-width: 768px) {
  .product-recs :deep(.rec__carousel) {
    margin: 0 -16px;
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .product-recs :deep(.rec__carousel) {
    margin: 0 -12px;
    padding: 0 12px;
  }
}

.rec-skeleton .card {
  height: 220px;
}

.skel--line {
  height: 14px;
  border-radius: 6px;
}

.skel--w140 {
  width: 140px;
}

.skel--w160 {
  width: 160px;
}

.skel--chip {
  width: 56px;
  height: 22px;
  border-radius: 999px;
}

.skel--price {
  width: 110px;
  height: 20px;
  border-radius: 6px;
}

.skel--stepper {
  width: 104px;
  height: 32px;
  border-radius: 8px;
}

.rec-skeleton {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 24px;
}

.rec-skeleton .card {
  height: 320px;
  border-radius: 16px;
}

@media (max-width: 1024px) {
  .rec-skeleton {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 520px) {
  .rec-skeleton {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .cols {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: 88px 1fr;
    gap: 12px;
    padding: 10px;
  }

  .row--withcheck {
    grid-template-columns: 24px 88px 1fr;
  }

  .row__thumb {
    width: 88px;
    height: 88px;
  }

  .row__price {
    margin-top: 0;
    font-size: 14px;
    line-height: 20px;
  }

  .product-recs {
    transform: translateY(56px);
  }
}
</style>
