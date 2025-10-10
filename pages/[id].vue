<template>
    <section class="container">
        <div v-if="debug" class="debugbar">
            <button class="dbgbtn" @click="simulateLoading">Simulate Loading (1.5s)</button>
            <button class="dbgbtn" @click="toggleStock">
                {{ product.stock === 0 ? 'Set Stok: 12' : 'Set Stok: 0' }}
            </button>
            <span class="dbgmeta">Stock: {{ product.stock }}</span>
        </div>

        <Breadcrumb :items="[{ label: 'Beranda', to: '/' }, { label: 'Detail Produk' }]" />

        <div class="cols">
            <div class="col col--left">
                <div v-if="loading" class="media skel"></div>

                <template v-else>
                    <figure class="media" @touchstart="ts = $event.touches[0].clientX"
                        @touchend="te = $event.changedTouches[0].clientX; onSwipe()">
                        <img :src="product.images[current] || product.image" :alt="product.name" />
                        <div class="badge">
                            <svg class="badge__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="#DBAD1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
                            </svg>
                            <span class="badge__text">Highly Recommend</span>
                        </div>
                        <figcaption class="pager">{{ current + 1 }} / {{ total }}</figcaption>
                        <div v-if="hasMulti" class="navgroup">
                            <button class="navbtn" aria-label="Sebelumnya" @click="prevImg">
                                <img src="/Icons/CaretLeft.svg" alt="" />
                            </button>
                            <button class="navbtn navbtn--right" aria-label="Berikutnya"
                                @click="nextImg">
                                <img src="/Icons/CaretRight.svg" alt="" />
                            </button>
                        </div>
                    </figure>

                    <section class="desc hidden-mobile">
                        <h3 class="desc__title">Deskripsi</h3>
                        <p class="desc__body">{{ product.description || '—' }}</p>
                        <button class="desc__read">Baca semua <img src="/Icons/CaretDownOrange.svg" alt="" /></button>
                    </section>
                </template>
            </div>

            <div class="col col--right">
                <template v-if="loading">
                    <div class="skline skline--lg skel"></div>
                    <div class="skline skel" style="width:120px;"></div>
                    <div class="skline skel" style="width:160px; height:24px; border-radius:8px;"></div>
                    <div class="skline skel" style="width:120px;"></div>

                    <div class="skblock">
                        <div class="skline skel" style="width:140px;"></div>
                        <div class="skgrid">
                            <div v-for="i in 6" :key="'sksize' + i" class="skopt skel"></div>
                        </div>
                    </div>

                    <div class="skblock">
                        <div class="skline skel" style="width:120px;"></div>
                        <div class="skgrid">
                            <div v-for="i in 6" :key="'skcolor' + i" class="skopt skel"></div>
                        </div>
                    </div>

                    <div class="skline skel" style="width:100px;"></div>
                    <div class="skbtn skel"></div>

                    <section class="desc desc--mobile">
                        <div class="skline skel" style="width:100px;"></div>
                        <div class="skline skel"></div>
                        <div class="skline skel" style="width:80%;"></div>
                    </section>
                </template>

                <template v-else>
                    <h1 class="title">{{ product.name }}</h1>
                    <div class="category">{{ product.category || 'Produk' }}</div>
                    <div class="price">Rp{{ formatIDR(product.price) }}</div>
                    <div class="tax">Termasuk pajak.</div>

                    <div v-if="product.sizes?.length" class="block">
                        <div class="block__head">
                            <span class="block__label">Pilih Ukuran</span>
                            <button class="sizeguide" type="button">Size Guide</button>
                        </div>
                        <div class="optgrid">
                            <button v-for="size in product.sizes" :key="size.name" class="opt"
                                :class="{ 'is-disabled': !size.available, 'is-active': selectedSize === size.name }"
                                :disabled="!size.available" @click="selectedSize = size.name">
                                {{ size.name }}
                            </button>
                        </div>
                    </div>

                    <div v-if="product.colors?.length" class="block">
                        <div class="block__head"><span class="block__label">Pilih Warna</span></div>
                        <div class="optgrid">
                            <button v-for="color in product.colors" :key="color.name" class="opt"
                                :class="{ 'is-disabled': !color.available, 'is-active': selectedColor === color.name }"
                                :disabled="!color.available" @click="selectedColor = color.name">
                                {{ color.name }}
                            </button>
                        </div>
                    </div>

                    <div class="block">
                        <div class="block__head"><span class="block__label">Jumlah</span></div>
                        <div class="optgrid" style="grid-template-columns: 1fr;">
                            <input class="input" type="number" min="1" :max="product.stock" v-model.number="qty" />
                        </div>
                    </div>

                    <div class="stock">Stok: {{ product.stock }}</div>
                    <button class="cta" :disabled="!canAdd" @click="onAddToCart">Tambahkan ke Keranjang</button>

                    <section class="desc desc--mobile">
                        <h3 class="desc__title">Deskripsi</h3>
                        <p class="desc__body">{{ product.description || '—' }}</p>
                        <button class="desc__read">Baca semua <img src="/Icons/CaretDownOrange.svg" alt="" /></button>
                    </section>

                    <section class="ship">
                        <h3 class="ship__title">Informasi Pengiriman</h3>
                        <div class="ship__row">
                            <img src="/Icons/truck.svg" alt="" class="ship__icon" />
                            <p class="ship__text">Estimasi 12–15 hari (Jawa), 20–22 hari (luar Jawa) setelah pemesanan.
                            </p>
                        </div>
                        <div class="ship__row">
                            <img src="/Icons/package.svg" alt="" class="ship__icon" />
                            <p class="ship__text">Pengemasan aman. Butuh tambahan kemasan? Hubungi layanan kami.</p>
                        </div>
                        <div class="ship__row">
                            <img src="/Icons/box.svg" alt="" class="ship__icon" />
                            <p class="ship__text">Kerusakan saat pengantaran di luar tanggung jawab kami.</p>
                        </div>
                    </section>
                </template>
            </div>
        </div>

        <Recommendations class="recs--compact" v-if="!loading && rec.length" title="Rekomendasi Untuk di Beli"
            :items="rec" />
        <div v-else class="rec-skeleton recs--compact">
            <div v-for="i in 4" :key="'recs' + i" class="card skel"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onServerPrefetch, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import { useCurrency } from '@/composables/useCurrency'
import { useCart } from '@/composables/useCart'
const { formatIDR } = useCurrency()

useHead({
    title: 'Detail Product'
})

type VariantOpt = { id: string; name: string }
type Variant = { name: string; options: VariantOpt[] }
type ProductApi = {
    id: string; name: string; slug: string; thumbnail?: string; price: number;
    quantity: number | string; description?: string; product_category?: { id: string; name: string }
    variants?: Variant[]; images?: any[]; gallery?: any[]; medias?: any[]
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { addItem } = useCart()

const apiKey = (config.public.xApiKey || config.public.apiKey || '') as string
const headers = apiKey ? { 'x-api-key': apiKey } : undefined
const assetBase =
    (config.public.assetBase as string) ||
    (config.public.baseURL as string)?.replace(/\/api\/?$/, '') || ''
const asset = (p?: string) => !p ? '' : (p.startsWith('http') ? p : `${assetBase}/${p.replace(/^\/+/, '')}`)

function ensureSession(): string {
    try {
        let sid = localStorage.getItem('phri_session_id')
        if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('phri_session_id', sid) }
        return sid
    } catch { return crypto.randomUUID() }
}

const debug = false
const loading = ref(true)
const selectedSize = ref(''); const selectedColor = ref(''); const qty = ref(1)
const current = ref(0); const ts = ref(0); const te = ref(0)

const product = ref<{
    id?: string; name: string; price: number; stock: number; image: string; images: string[];
    description?: string; category?: string;
    sizes: { name: string; available: boolean }[];
    colors: { name: string; available: boolean }[];
}>({
    name: '—', price: 0, stock: 0, image: '/', images: [], sizes: [], colors: []
})

const rec = ref<Array<{ to: any; name: string; image: string; price: number; tags: string[]; soldOut: boolean }>>([])

const total = computed(() => product.value.images.length || (product.value.image ? 1 : 0))
const hasMulti = computed(() => product.value.images.length > 1)
const needSize = computed(() => product.value.sizes?.length > 0)
const needColor = computed(() => product.value.colors?.length > 0)
const canAdd = computed(() => {
    if (product.value.stock <= 0) return false
    if (needSize.value && !selectedSize.value) return false
    if (needColor.value && !selectedColor.value) return false
    return true
})

function normalizeImages(p: ProductApi): string[] {
    const arr =
        (Array.isArray(p.images) && p.images) ||
        (Array.isArray(p.gallery) && p.gallery) ||
        (Array.isArray(p.medias) && p.medias) || []
    const imgs = arr
        .map((it: any) => typeof it === 'string' ? it : (it?.url || it?.path || it?.src))
        .filter(Boolean)
        .map((u: string) => asset(u))
    if (!imgs.length && p.thumbnail) imgs.push(asset(p.thumbnail))
    return imgs
}

function mapProduct(p: ProductApi) {
    const sizes = (p.variants?.find(v => v.name?.toLowerCase() === 'ukuran')?.options || [])
        .map(o => ({ name: o.name, available: true }))
    const colors = (p.variants?.find(v => v.name?.toLowerCase() === 'warna')?.options || [])
        .map(o => ({ name: o.name, available: true }))
    const images = normalizeImages(p)
    product.value = {
        id: p.id, name: p.name, price: Number(p.price ?? 0), stock: Number(p.quantity ?? 0),
        image: images[0] || asset(p.thumbnail) || '',
        images, description: p.description, category: p.product_category?.name, sizes, colors
    }
    current.value = 0
}

async function fetchDetailById(id: string) {
    const detail = await ApiService.query(`/product/${id}`, { headers })
    if (!detail.error.value && detail.data.value) {
        const raw = (detail.data.value as any)?.data?.product
            || (detail.data.value as any)?.data || (detail.data.value as any)
        if (raw && raw.id) return raw as ProductApi
    }
    const list = await ApiService.query('/product', { params: { page: 1 }, headers })
    const arr: ProductApi[] = ((list.data.value as any)?.data?.products?.data) || []
    const found = arr.find(p => p.id === id)
    if (found) {
        rec.value = arr.filter(p => p.id !== id).slice(0, 4).map(p => ({
            to: { path: '/detail-product', query: { id: p.id } },
            name: p.name, image: asset(p.thumbnail), price: p.price,
            tags: (p.variants?.find(v => v.name?.toLowerCase() === 'warna')?.options || []).map(o => o.name).slice(0, 4),
            soldOut: Number(p.quantity ?? 0) <= 0
        }))
        return found
    }
    throw new Error('Produk tidak ditemukan.')
}

async function fetchPage() {
    loading.value = true
    try {
        const id = String(route.query.id || '')
        if (!id) throw new Error('Parameter id tidak ada.')
        const raw = await fetchDetailById(id)
        mapProduct(raw)
    } catch (e: any) {
        product.value.description = e?.message || 'Gagal memuat data.'
    } finally { loading.value = false }
}

function nextImg() { if (!hasMulti.value) return; current.value = (current.value + 1) % product.value.images.length }
function prevImg() { if (!hasMulti.value) return; current.value = (current.value - 1 + product.value.images.length) % product.value.images.length }
function onSwipe() { const d = te.value - ts.value; if (Math.abs(d) < 50) return; d < 0 ? nextImg() : prevImg() }

async function onAddToCart() {
    if (!canAdd.value) return
    const session_id = ensureSession()
    try {
        await ApiService.post('/cart', {
            session_id,
            products: [{
                product_id: product.value.id,
                qty: qty.value,
                size: selectedSize.value || undefined,
                color: selectedColor.value || undefined
            }]
        }, { headers })
    } catch (e) {
        console.error('POST /cart gagal:', e)
    }
    addItem({
        id: product.value.id as string,
        name: product.value.name,
        image: product.value.images[current.value] || product.value.image,
        price: product.value.price,
        qty: qty.value,
        stock: product.value.stock,
        size: selectedSize.value || undefined,
        color: selectedColor.value || undefined,
    })
    router.push('/cart')
}

onServerPrefetch(fetchPage)
onMounted(() => {
    fetchPage()
    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextImg()
        if (e.key === 'ArrowLeft') prevImg()
    }
    window.addEventListener('keydown', onKey)
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
watch(() => route.query.id, () => fetchPage())

function simulateLoading() { loading.value = true; setTimeout(() => loading.value = false, 1500) }
function toggleStock() { product.value.stock = product.value.stock === 0 ? 12 : 0 }
</script>

<style scoped>
.debugbar {
    position: sticky;
    top: 8px;
    z-index: 10;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    padding: 8px;
    border: 1px dashed #ffd699;
    border-radius: 10px;
    background: #fffaf2;
    margin-bottom: 8px
}

.dbgbtn {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ffd699;
    background: #fff;
    cursor: pointer
}

.dbgmeta {
    font: 600 12px/1 var(--ff);
    color: #DB8A00
}

.cols {
    display: grid;
    grid-template-columns: 440px 1fr;
    gap: 28px;
    align-items: start;
    margin-top: 40px
}

@media (max-width:1280px) {
    .cols {
        grid-template-columns: 400px 1fr;
        gap: 24px
    }
}

@media (max-width:1024px) {
    .cols {
        grid-template-columns: 1fr;
        gap: 24px
    }
}

.recs--compact :deep(.recs-grid) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px
}

@media (min-width:1280px) {
    .recs--compact :deep(.recs-grid) {
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
    }
}

.recs--compact :deep(.card) {
    padding: 10px;
    border-radius: 12px;
}

.recs--compact :deep(.card__thumb) {
    height: 240px;
}

.recs--compact :deep(.card__name) {
    font-size: 14px;
    line-height: 20px;
}

.recs--compact :deep(.card__price) {
    font-size: 14px;
    line-height: 20px;
}

.recs--compact :deep(.card-link) {
    display: block;
}

.recs--compact :deep(.card) {
    max-width: 100%;
}

.media {
    position: relative;
    width: 440px;
    height: 440px;
    border-radius: 12px;
    overflow: hidden;
    margin: 0;
    background: #f2f2f2
}

.media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
    display: block
}

@media (max-width:1024px) {

    .media,
    .media img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1
    }
}

.badge {
    position: absolute;
    top: 16px;
    left: 16px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    height: 26px;
    border-radius: 40px;
    background: #FFFCEB
}

.badge__icon {
    width: 16px;
    height: 16px
}

.badge__text {
    color: #DBAD1B;
    font: 500 12px/16px Inter, sans-serif
}

.pager {
    position: absolute;
    left: 16px;
    bottom: 16px;
    font: 600 16px/24px var(--ff);
    color: var(--text)
}

.navgroup {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    gap: 8px
}

.navbtn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, .9);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 0 1px rgba(0,0,0,.06);
}

.navbtn--right {
    background: #fff;
    border: 1px solid #E6E6E6;
}

.desc {
    margin-top: 60px
}

.desc__title {
    margin: 0 0 8px;
    font: 600 16px/24px var(--ff);
    color: var(--text)
}

.desc__body {
    margin: 0 0 8px;
    font: 400 16px/24px var(--ff);
    color: var(--text)
}

.desc__read {
    display: flex;
    gap: 4px;
    padding: 4px 0;
    background: none;
    border: 0;
    cursor: pointer;
    color: var(--brand);
    font: 500 12px/18px var(--ff)
}

.desc--mobile {
    display: none
}

@media (max-width:1024px) {
    .desc--mobile {
        display: block;
        margin-top: 16px
    }

    .hidden-mobile {
        display: none
    }
}

.title {
    margin: 8px 0 2px;
    font: 600 20px/28px var(--ff);
    color: var(--text)
}

.category {
    font: 500 14px/22px var(--ff);
    color: #75775
}

.price {
    margin-top: 18px;
    font: 700 20px/28px var(--ff);
    color: var(--text)
}

.tax {
    margin-top: 8px;
    font: 700 14px/22px var(--ff);
    color: var(--text)
}

.block {
    margin-top: 18px
}

.block__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px
}

.block__label {
    font: 500 14px/22px var(--ff)
}

.sizeguide {
    color: #9E9E9E;
    background: none;
    border: 0;
    cursor: pointer;
    font: 400 12px/18px var(--ff)
}

.optgrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 8px;
    row-gap: 12px
}

.opt {
    display: flex;
    height: 36px;
    padding: 8px 0;
    justify-content: center;
    align-items: center;
    min-width: 80px;
    border-radius: 4px;
    border: 1px solid #EDEDED;
    background: #FFF;
    color: #000;
    font: 400 14px/22px var(--ff);
    cursor: pointer
}

.opt.is-disabled {
    border-color: #E0E0E0;
    background: #EDEDED;
    color: #9E9E9E;
    cursor: not-allowed
}

.opt.is-active {
    border-color: var(--brand);
    color: #D47E1A
}

.input {
    height: 36px;
    border: 1px solid #EDEDED;
    border-radius: 6px;
    padding: 0 10px;
    font: 400 14px/22px var(--ff)
}

.stock {
    margin-top: 12px;
    font: 500 14px/22px var(--ff);
    color: var(--text)
}

.cta {
    margin-top: 12px;
    width: 100%;
    border: 0;
    border-radius: 10px;
    padding: 8px 12px;
    background: var(--brand);
    color: #fff;
    font: 500 16px/24px var(--ff);
    cursor: pointer
}

.cta:disabled {
    background: #E0E0E0;
    color: #9E9E9E;
    cursor: not-allowed
}

.ship {
    margin-top: 36px
}

.ship__title {
    margin: 0 0 6px;
    font: 600 16px/24px var(--ff);
    color: var(--text)
}

.ship__row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 8px 0
}

.ship__icon {
    width: 46px;
    height: 46px;
    border-radius: 8px;
    background: #fff
}

.ship__text {
    font: 400 14px/22px var(--ff);
    color: var(--text)
}

.skel {
    background: linear-gradient(270deg, rgba(219, 219, 219, 0.05) 0%, #DBDBDB 50%, rgba(219, 219, 219, 0.05) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
    border-radius: 8px
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

.skline {
    height: 18px;
    width: 180px;
    border-radius: 6px;
    margin: 8px 0 6px
}

.skline--lg {
    height: 28px;
    width: 60%;
    border-radius: 8px
}

.skblock {
    margin-top: 14px
}

.skgrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 8px;
    margin-top: 8px
}

.skopt {
    height: 36px;
    border-radius: 6px
}

.skbtn {
    margin-top: 12px;
    height: 44px;
    border-radius: 10px
}

.rec-skeleton {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
    margin-top: 24px
}

.rec-skeleton .card {
    height: 320px;
    border-radius: 16px
}

@media (max-width:1024px) {
    .rec-skeleton {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px
    }
}

@media (max-width:520px) {
    .rec-skeleton {
        grid-template-columns: 1fr
    }
}
</style>
