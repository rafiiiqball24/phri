<template>
    <section class="page container">
        <Breadcrumb :items="[
            { label: 'Beranda', to: '/' },
            { label: 'Detail Produk', to: '/shop/detail-product' },
            { label: 'Keranjang' }
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
            <img src="/Icons/EmptyState.svg" alt="" class="empty__img" />
            <h3 class="empty__title">Keranjangmu masih kosong</h3>
            <p class="empty__text">Yuk mulai belanja dan temukan produk terbaik dari PHRI.</p>
            <NuxtLink to="/shop" class="btn btn--primary">Belanja Sekarang</NuxtLink>
        </div>

        <div v-else class="cols">
            <div class="list">
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

                <article v-else v-for="(it, i) in displayedItems" :key="it.key" class="row">
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
                            <StepperQty :model-value="it.qty" :min="1" @update:model-value="v => onQtyChange(i, v)" />
                        </div>
                    </div>
                </article>
            </div>

            <SummaryBox v-if="!dbg.loading" title="Ringkasan Pembelian" :count-label="`${displayedItems.length} Item`"
                :lines="[
                    ...displayedItems.map(it => ({ name: `${it.qty}× ${it.name}`, price: it.price * it.qty })),
                    ...(paymentFee > 0 ? [{ name: 'Payment Fee', price: paymentFee }] : [])
                ]" total-label="Estimasi Pembayaran" :total="grandTotal" cta="Buat Pesanan" @cta="goCheckout" :links="[
                    { label: 'Butuh Bantuan?', to: '/help' },
                    { label: 'Hubungi Kami', to: '/contact', underline: true },
                    { label: 'Informasi Pengiriman', to: '/shipping', underline: true }
                ]" />
        </div>

        <Recommendations class="recs--compact" v-if="!dbg.loading && rec.length" title="Rekomendasi Untuk di Beli"
            :items="rec" />
    </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import { useCurrency } from '@/composables/useCurrency'
import { useCart } from '@/composables/useCart'

type CartItem = {
    key: string
    id: string | number
    name: string
    image: string
    price: number
    qty: number
    color?: string
    size?: string
    cartId?: string
}

type VariantOpt = { id: string; name: string }
type Variant = { name: string; options: VariantOpt[] }
type ProductApi = {
    id: string; name: string; slug?: string; thumbnail?: string; price: number;
    quantity: number | string; description?: string;
    product_category?: { id: string; name: string };
    variants?: Variant[]; images?: any[]; gallery?: any[]; medias?: any[];
}

const { formatIDR } = useCurrency()
const router = useRouter()

const showDebug = false
const dbg = ref({ loading: false, empty: false })
function toggleLoading() { dbg.value.loading = !dbg.value.loading }
function toggleEmpty() { dbg.value.empty = !dbg.value.empty }

const { items, total, updateQty, remove } = useCart()
const displayedItems = computed<CartItem[]>(() => (dbg.value.empty ? [] : (items.value as unknown as CartItem[])))

const config = useRuntimeConfig()
const apiKey = (config.public.xApiKey || config.public.apiKey || '') as string
const headers = apiKey ? { 'x-api-key': apiKey, Accept: 'application/json' } : { Accept: 'application/json' }

const assetBase = (config.public.assetBase as string) || (config.public.baseURL as string)?.replace(/\/api\/?$/, '') || ''
const asset = (p?: string) => !p ? '' : (p.startsWith('http') ? p : `${assetBase}/${p.replace(/^\/+/, '')}`)

function getSession(): string | null { try { return localStorage.getItem('phri_session_id') } catch { return null } }

const paymentFee = ref(0)
const grandTotal = computed(() => (dbg.value.empty ? 0 : total.value + paymentFee.value))

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
    // @ts-ignore
    updateQty(it.key, v)
    const raw = items.value as unknown as CartItem[]
    const target = raw.find(r => r.key === it.key)
    if (target) target.qty = v
}

async function onRemove(it: CartItem) {
    // @ts-ignore
    await remove(it.key)
    fetchCartFee()
}

function ensureSession() {
    try {
        let sid = localStorage.getItem('phri_session_id')
        if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('phri_session_id', sid) }
    } catch { }
}
function goCheckout() {
    ensureSession()
    router.push('/shop/checkout')
}

const rec = ref<Array<{ to: any; name: string; image: string; price: number; tags: string[]; soldOut: boolean }>>([])

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

function mapToCard(p: ProductApi) {
    const tags = (p.variants?.find(v => v.name?.toLowerCase() === 'warna')?.options || []).map(o => o.name).slice(0, 4)
    return {
        to: { path: '/shop/detail-product', query: { id: p.id } },
        name: p.name,
        image: normalizeImages(p)[0] || asset(p.thumbnail) || '/Images/placeholder.png',
        price: Number(p.price ?? 0),
        tags,
        soldOut: Number(p.quantity ?? 0) <= 0
    }
}

async function fetchRecommendations() {
    try {
        const { data, error } = await ApiService.query('/product', { params: { page: 1 }, headers })
        if (error.value) return
        const arr: ProductApi[] = ((data.value as any)?.data?.products?.data) || []
        const cartIds = new Set((items.value as any[]).map(it => String(it.id)))
        const cleaned = arr.filter(p => !cartIds.has(String(p.id)))
        rec.value = cleaned.slice(0, 4).map(mapToCard)
    } catch { }
}

onMounted(() => {
    ensureSession()
    fetchCartFee()
    fetchRecommendations()
})

watch(items, () => { fetchRecommendations() }, { deep: true })
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
    border: 1px solid #EDEDED;
    background: #fff;
    cursor: pointer;
    font: 500 12px/18px var(--ff);
}

.dbg__btn.on {
    border-color: #FFD6A6;
    background: #FFF7EA;
    color: #B96A00;
}

.cols {
    display: grid;
    grid-template-columns: 1fr 392px;
    gap: 28px;
    align-items: start;
    margin-top: 12px;
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
    background: linear-gradient(270deg, rgba(219, 219, 219, .05) 0%, #DBDBDB 50%, rgba(219, 219, 219, .05) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
    border-radius: 8px;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

.recs--compact :deep(.recs-grid) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
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

.rec-skeleton .card {
    height: 220px;
}

.skel--line {
    height: 14px;
    border-radius: 6px
}

.skel--w140 {
    width: 140px
}

.skel--w160 {
    width: 160px
}

.skel--chip {
    width: 56px;
    height: 22px;
    border-radius: 999px
}

.skel--price {
    width: 110px;
    height: 20px;
    border-radius: 6px
}

.skel--stepper {
    width: 104px;
    height: 32px;
    border-radius: 8px
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

@media (max-width:1024px) {
    .cols {
        grid-template-columns: 1fr;
        gap: 16px
    }
}

@media (max-width:600px) {
    .row {
        grid-template-columns: 88px 1fr;
        gap: 12px;
        padding: 10px;
    }

    .row__thumb {
        width: 88px;
        height: 88px
    }

    .row__price {
        margin-top: 0;
        font-size: 14px;
        line-height: 20px
    }
}
</style>
