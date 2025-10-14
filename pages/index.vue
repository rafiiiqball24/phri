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
                    <NuxtLink to="/" class="hero__cta">Belanja Sekarang</NuxtLink>
                </div>
            </div>
        </section>

        <!-- PRODUK -->
        <section class="container section-pad">
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
</script>

<style scoped>
/* ===== HERO ===== */
.hero {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 0;
    min-height: 700px;
    background: center/cover no-repeat;
    background-color: #f79f24;
    color: #fff;
    box-sizing: border-box;
}

.hero__container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
}

.hero__container.container {
    margin-left: 0;
    padding-left: 0;
    max-width: 100%;
}

.hero__left {
    margin-left: 120px;

}


.hero__title {
    width: 614px;
    font: 600 32px/1.25 var(--ff);
}

.hero__subtitle {
    margin-top: 12px;
    font: 400 20px/28px var(--ff);
    max-width: 614px;
}

.hero__cta {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    border-radius: 12px;
    background: #fdfaed;
    color: #f79f24;
    font: 500 20px/28px var(--ff);
    letter-spacing: -0.003px;
    box-shadow: var(--shadow-1);
    text-decoration: none;
}

.hero__cta:hover {
    background: #fff;
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

@media (max-width: 600px) {
    .hero {
        min-height: 414px;
        padding: 20px 0;
    }

    .hero__left {
        margin: 0;
        width: 100%;
        max-width: 328px;
    }

    .hero__title {
        font-size: 20px;
        line-height: 28px;
        margin: 0 0 8px;
        width: auto;
    }

    .hero__subtitle {
        font-size: 14px;
        line-height: 22px;
        margin: 0 0 12px;
        max-width: none;
    }

    .hero__cta {
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 18px;
        width: 100px;
    }
}


.products-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
}

@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 900px) {
    .products-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}


@media (max-width: 600px) {
    .products-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }
}


.card-skel {
    height: 320px;
    border-radius: 16px;
    background: #eee;
}


.section-pad {
    padding: 32px 0 48px;
}

.err {
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>
