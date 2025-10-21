<template>
    <div>
        <!-- ERROR -->
        <section v-if="errorMsg" class="container section-pad">
            <div class="err">
                <p>{{ errorMsg }}</p>
                <button class="hero__cta" @click="fetchHome">Coba Lagi</button>
            </div>
        </section>

        <!-- HERO (SKELETON) -->
        <section v-else-if="loading" class="hero hero--skel">
            <div class="container hero__container">
                <div class="hero__left">
                    <div class="skel skel--title"></div>
                    <div class="skel skel--sub"></div>
                    <div class="skel skel--btn"></div>
                </div>
            </div>
        </section>

        <!-- HERO (DATA) -->
        <section v-else class="hero"
            :style="banner?.image ? { backgroundImage: 'url(' + asset(banner.image) + ')' } : undefined">
            <div class="container hero__container">
                <div class="hero__left">
                    <h1 class="hero__title">
                        {{ banner?.title || 'Temukan Produk Terbaik untuk Industri Perhotelan' }}
                    </h1>
                    <p class="hero__subtitle">
                        {{
                            banner?.sub_title ||
                            'Belanja produk terbaik, sekaligus ikut berkontribusi dalam program berbagi untuk sesama.'
                        }}
                    </p>
                    <button type="button" class="hero__cta" @click="scrollToProduk">Belanja Sekarang</button>
                </div>
            </div>
        </section>

        <!-- PRODUK -->
        <section ref="produkRef" id="produk-section" class="container section-pad">
            <h2 class="section__title" style="margin:8px 0 18px">Produk Kami</h2>

            <!-- GRID SKELETON -->
            <div v-if="loading" class="products-grid">
                <div v-for="i in 8" :key="i" class="card-skel"></div>
            </div>

            <!-- GRID DATA -->
            <div v-else class="products-grid">
                <CardProduct v-for="p in products" :key="p.id" :to="{ path: '/detail-product', query: { id: p.id } }"
                    :name="p.name" :image="p.image" :price="p.price" :tags="p.tags" :soldOut="p.soldOut" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onServerPrefetch, watch } from 'vue'
import { useRoute } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import CardProduct from '~/components/ui/CardProduct.vue'

useHead({
    title: 'Home'
})

type Banner = { id: string; title: string; sub_title: string; image: string }
type ProductApi = {
    id: string
    name: string
    price: number
    quantity: number
    thumbnail?: string
    variants?: Array<{ name: string; options: Array<{ name: string }> }>
}

const config = useRuntimeConfig()
const route = useRoute()


const assetBase =
    (config.public.assetBase as string) ||
    (config.public.baseURL as string)?.replace(/\/api\/?$/, '') ||
    ''

const asset = (path?: string) => {
    if (!path) return ''
    return path.startsWith('http') ? path : `${assetBase}/${path.replace(/^\/+/, '')}`
}

const loading = ref(true)
const errorMsg = ref<string | null>(null)
const page = ref<number>(Number(route.query.page || 1))
const search = ref<string>((route.query.search as string) || '')

const banner = ref<Banner | null>(null)
const products = ref<
    Array<{ id: string; name: string; image: string; price: number; tags: string[]; soldOut: boolean }>
>([])

const fetchHome = async () => {
    loading.value = true
    errorMsg.value = null
    try {
        const { data, error } = await ApiService.query('/home', {
            params: { page: page.value, search: search.value }
        })
        if (error.value) throw new Error(error.value.message || 'Gagal memuat data.')

        const res = data.value as any
        banner.value = res?.data?.banner ?? null

        const list: ProductApi[] = res?.data?.products?.data ?? []
        products.value = list.map((p) => {
            const colorOpts = p.variants?.find((v) => v.name?.toLowerCase() === 'warna')?.options?.map((o) => o.name) ?? []
            return {
                id: p.id,
                name: p.name,
                image: asset(p.thumbnail),
                price: p.price,
                tags: colorOpts.slice(0, 4),
                soldOut: (p.quantity ?? 0) <= 0
            }
        })
    } catch (e: any) {
        errorMsg.value = e?.message || 'Gagal memuat data.'
    } finally {
        loading.value = false
    }
}

onServerPrefetch(fetchHome)
onMounted(fetchHome)

watch(
    () => route.query,
    (q) => {
        page.value = Number(q.page || 1)
        search.value = (q.search as string) || ''
        fetchHome()
    },
    { deep: true }
)

// Scroll halus ke bagian "Produk Kami"
const produkRef = ref<HTMLElement | null>(null)
function scrollToProduk() {
    if (process.client) {
        const el = (produkRef.value as any) || document.getElementById('produk-section')
        if (el && 'scrollIntoView' in el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
</script>

<style scoped>
.hero {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 0;
    min-height: 600px;
    background: center/cover no-repeat;
    background-color: #f79f24;
    color: #fff;
    box-sizing: border-box;
}

.hero__container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
    padding: 0 20px;
}

.hero__container.container {
    margin: 0 auto;
    max-width: 1280px;
    width: 100%;
}

.hero__left {
    max-width: 614px;
    width: 100%;
}

.hero__title {
    font: 600 42px/1.2 var(--ff);
    margin: 0 0 16px;
}

.hero__subtitle {
    font: 400 18px/1.6 var(--ff);
    margin: 0 0 32px;
    opacity: 0.9;
}

.hero__cta {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 14px 28px;
    border-radius: 12px;
    background: #fdfaed;
    border: 2px solid #f79f24;
    color: #f79f24;
    font: 600 16px/1 var(--ff);
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    transition: all 0.2s ease;
}

.hero__cta:hover {
    background: #fff;
    border-color: #f79f24;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.hero--skel {
    background: #ffe3bb;
}

.skel {
    background: #ffffff40;
    border-radius: 12px;
}

.skel--title {
    width: 420px;
    height: 40px;
}

.skel--sub {
    width: 520px;
    height: 22px;
    margin: 12px 0;
}

.skel--btn {
    width: 160px;
    height: 40px;
}

@media (max-width: 1024px) {
    .hero {
        min-height: 500px;
        padding: 40px 0;
    }

    .hero__title {
        font-size: 36px;
    }

    .hero__subtitle {
        font-size: 16px;
    }
}

@media (max-width: 768px) {
    .hero {
        min-height: 450px;
        padding: 30px 0;
    }

    .hero__container {
        padding: 0 16px;
    }

    .hero__left {
        max-width: 500px;
    }

    .hero__title {
        font-size: 32px;
        margin: 0 0 12px;
    }

    .hero__subtitle {
        font-size: 15px;
        margin: 0 0 24px;
    }
}

@media (max-width: 600px) {
    .hero {
        min-height: 400px;
        padding: 0;
        justify-content: flex-start;
    }

    .hero__container {
        padding: 24px 16px;
        margin: 0;
        max-width: 100%;
    }

    .hero__left {
        max-width: 100%;
        text-align: left;
    }

    .hero__title {
        font-size: 20px;
        line-height: 1.3;
        margin: 0 0 8px;
        max-width: 280px;
    }

    .hero__subtitle {
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 16px;
        max-width: 280px;
        opacity: 0.9;
    }

    .hero__cta {
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 6px;
        width: auto;
        min-width: 120px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

.section__title {
    padding: 0 20px;
}

@media (max-width: 900px) {
    .section__title {
        padding: 0 16px;
    }
}

@media (max-width: 600px) {
    .section__title {
        padding: 0 12px;
    }
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin: 0 auto;
    max-width: 1280px;
    padding: 0 20px;
}

@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 900px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        padding: 0 16px;
    }
}

@media (max-width: 600px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 0 12px;
    }
}

.card-skel {
    height: 320px;
    border-radius: 16px;
    background: #eee;
}

.section-pad {
    padding: 40px 0 60px;
}

@media (max-width: 768px) {
    .section-pad {
        padding: 32px 0 48px;
    }
}

@media (max-width: 600px) {
    .section-pad {
        padding: 24px 0 36px;
    }
}

.err {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 0 20px;
}

@media (max-width: 600px) {
    .err {
        padding: 0 12px;
        flex-direction: column;
        text-align: center;
    }
}
</style>
