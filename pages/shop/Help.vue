<template>
    <section class="help">
        <header class="hero">
            <h1 class="hero__title">Pusat Bantuan</h1>
            <p class="hero__subtitle">
                Cari informasi yang Anda butuhkan dengan cepat. Gunakan kolom, kategori populer, untuk menemukan solusi
                terkait layanan kami.
            </p>
        </header>

        <aside class="callout" role="note" aria-label="Temukan Jawabanmu">
            <div class="callout__icon" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" class="i" width="28" height="28" viewBox="0 0 28 28"
                    fill="none">
                    <path
                        d="M25.1191 10.7561C25.2831 10.592 25.3752 10.3695 25.3752 10.1376C25.3752 9.9056 25.2831 9.68312 25.1191 9.51905L18.4845 2.88108C18.3204 2.71711 18.0979 2.625 17.8659 2.625C17.634 2.625 17.4115 2.71711 17.2474 2.88108L10.9802 9.16577C10.9802 9.16577 7.94508 7.64873 4.7032 10.265C4.60707 10.3419 4.52826 10.4383 4.47193 10.5478C4.4156 10.6573 4.38301 10.7775 4.3763 10.9004C4.36959 11.0234 4.38891 11.1464 4.43299 11.2613C4.47707 11.3763 4.54492 11.4807 4.63211 11.5676L16.4337 23.3681C16.5221 23.4558 16.6282 23.5237 16.7449 23.5672C16.8616 23.6106 16.9862 23.6286 17.1105 23.62C17.2347 23.6114 17.3557 23.5764 17.4653 23.5173C17.575 23.4582 17.6707 23.3764 17.7462 23.2773C18.6638 22.0567 20.1054 19.5487 18.852 17.043L25.1191 10.7561Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.5317 17.4688L5.25 22.7505" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="callout__content">
                <h3 class="callout__title">Temukan Jawabanmu!</h3>
                <p class="callout__text">
                    Temukan pekerjaan impian Anda dengan mudah di PHRI Karir! Cukup masukkan kata kunci seperti posisi
                    atau lokasi di kolom pencarian, lalu manfaatkan filter untuk menyesuaikan hasil sesuai kebutuhan.
                    Aktifkan notifikasi agar tidak ketinggalan peluang terbaru, dan simpan favorit untuk diakses nanti.
                    Jangan lupa lengkapi profil dan unggah CV terbaru agar recruiter dapat menemukan Anda lebih mudah.
                </p>
            </div>
        </aside>

        <section v-if="loading" class="faq">
            <p>Memuat FAQ…</p>
        </section>
        <section v-else-if="errorMsg" class="faq">
            <p>{{ errorMsg }}</p>
        </section>

        <section v-else class="faq">
            <div class="faqGrid">
                <div class="faq__intro">
                    <h2 class="faq__heading">Informasi Pengiriman</h2>
                    <p class="faq__desc">
                        Informasi mengenai proses pengiriman produk PHRI Shop, termasuk estimasi waktu, jasa ekspedisi
                        yang digunakan, serta status pelacakan pesanan.
                    </p>
                </div>

                <div class="faq__list">
                    <ul class="accordion" role="list">
                        <li v-for="(q, i) in shippingFaqs" :key="`ship-${i}-${q.q}`" class="accordion__item">
                            <button class="accordion__button" :aria-expanded="openedShipping === i"
                                @click="toggleShipping(i)">
                                <span class="accordion__q">{{ q.q }}</span>
                                <svg class="accordion__chev" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M6 9l6 6 6-6" :stroke="openedShipping === i ? '#F79F24' : '#9AA0A6'"
                                        stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <div class="accordion__panel" v-show="openedShipping === i">
                                <p class="accordion__a">{{ q.a }}</p>
                            </div>
                        </li>
                        <li v-if="!shippingFaqs.length" class="accordion__item">
                            <div class="accordion__panel">
                                <p class="accordion__a">Belum ada data pengiriman.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section v-if="!loading && !errorMsg" class="faq">
            <div class="faqGrid">
                <div class="faq__intro">
                    <h2 class="faq__heading">Privasi & Data</h2>
                    <p class="faq__desc">
                        Informasi terkait pengelolaan data pribadi Anda, siapa yang mengelola, dan praktik privasi di
                        PHRI Shop.
                    </p>
                </div>

                <div class="faq__list">
                    <ul class="accordion" role="list">
                        <li v-for="(q, i) in privacyFaqs" :key="`priv-${i}-${q.q}`" class="accordion__item">
                            <button class="accordion__button" :aria-expanded="openedPrivacy === i"
                                @click="togglePrivacy(i)">
                                <span class="accordion__q">{{ q.q }}</span>
                                <svg class="accordion__chev" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M6 9l6 6 6-6" :stroke="openedPrivacy === i ? '#F79F24' : '#9AA0A6'"
                                        stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <div class="accordion__panel" v-show="openedPrivacy === i">
                                <p class="accordion__a">{{ q.a }}</p>
                            </div>
                        </li>
                        <li v-if="!privacyFaqs.length" class="accordion__item">
                            <div class="accordion__panel">
                                <p class="accordion__a">Belum ada data privasi.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="cta" aria-labelledby="ctaTitle">
            <div class="cta__inner">
                <div class="cta__copy">
                    <h3 id="ctaTitle" class="cta__title">Masih ada pertanyaan lain?</h3>
                    <p class="cta__text">Hubungi tim kami melalui live chat atau email, dan kami akan dengan senang hati
                        membantu.</p>
                </div>
                <button type="button" class="btn btn--primary" @click="$router.push('/shop/contact')">
                    Hubungi Kami
                </button>


            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type RawFaq = { id: string; type: string; question: string; answer: string }
type FaqResponse = { code: number; message: string; data: { faqs: RawFaq[] } }
type QA = { q: string; a: string }
type CachePayload<T> = { ts: number; data: T }

const BASE = (import.meta.env.VITE_APP_BASE_URL as string || '').replace(/\/+$/, '')
const KEY = import.meta.env.VITE_APP_API_KEY as string

const loading = ref(true)
const errorMsg = ref<string | null>(null)
const shippingFaqs = ref<QA[]>([])
const privacyFaqs = ref<QA[]>([])

const openedShipping = ref<number | null>(0)
const openedPrivacy = ref<number | null>(0)
const toggleShipping = (i: number) => { openedShipping.value = openedShipping.value === i ? null : i }
const togglePrivacy = (i: number) => { openedPrivacy.value = openedPrivacy.value === i ? null : i }

const safeGet = <T = unknown>(key: string): T | null => {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return null
        return JSON.parse(raw) as T
    } catch {
        localStorage.removeItem(key)
        return null
    }
}

const safeSet = (key: string, val: unknown) => {
    try {
        localStorage.setItem(key, JSON.stringify(val))
    } catch { }
}

const isFresh = (ts: number, ttlMs: number) => (Date.now() - ts) < ttlMs

async function getFaq(path: string): Promise<FaqResponse> {
    const url = `${BASE}/${path.replace(/^\/+/, '')}`
    const res = await fetch(url, {
        headers: {
            'x-api-key': KEY,
            'Accept': 'application/json',
        },
    })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Gagal memuat ${path} (HTTP ${res.status})${text ? ` - ${text}` : ''}`)
    }
    return res.json() as Promise<FaqResponse>
}

const mapFaqs = (rows: RawFaq[]): QA[] => (rows || []).map(r => ({ q: r.question, a: r.answer }))

const DEFAULT_TTL = 6 * 60 * 60 * 1000
async function fetchFaqCached(path: string, cacheKey: string, ttlMs = DEFAULT_TTL): Promise<QA[]> {
    const cached = safeGet<CachePayload<QA[]>>(cacheKey)
    let fromCache: QA[] | null = null
    if (cached && Array.isArray(cached.data) && cached.ts) {
        if (isFresh(cached.ts, ttlMs)) {
            fromCache = cached.data
        } else {
            fromCache = cached.data
        }
    }
    if (fromCache) {
        const age = Date.now() - (cached!.ts)
        const shouldRevalidate = age > ttlMs * 0.5
        if (shouldRevalidate) {
            getFaq(path)
                .then(res => {
                    const fresh = mapFaqs(res?.data?.faqs || [])
                    safeSet(cacheKey, { ts: Date.now(), data: fresh } as CachePayload<QA[]>)
                    if (cacheKey === 'faq:shipping') shippingFaqs.value = fresh
                    if (cacheKey === 'faq:privacy') privacyFaqs.value = fresh
                })
                .catch(() => { })
        }
        return fromCache
    }
    const res = await getFaq(path)
    const fresh = mapFaqs(res?.data?.faqs || [])
    safeSet(cacheKey, { ts: Date.now(), data: fresh } as CachePayload<QA[]>)
    return fresh
}

async function forceRefreshAll() {
    loading.value = true
    errorMsg.value = null
    try {
        const [ship, priv] = await Promise.all([
            getFaq('faq-shipping').then(r => mapFaqs(r?.data?.faqs || [])),
            getFaq('faq-privacy').then(r => mapFaqs(r?.data?.faqs || [])),
        ])
        shippingFaqs.value = ship
        privacyFaqs.value = priv
        safeSet('faq:shipping', { ts: Date.now(), data: ship } as CachePayload<QA[]>)
        safeSet('faq:privacy', { ts: Date.now(), data: priv } as CachePayload<QA[]>)
    } catch (e: any) {
        errorMsg.value = e?.message || 'Gagal menyegarkan FAQ.'
    } finally {
        loading.value = false
    }
}

async function loadAll() {
    loading.value = true
    errorMsg.value = null
    try {
        const [ship, priv] = await Promise.all([
            fetchFaqCached('faq-shipping', 'faq:shipping'),
            fetchFaqCached('faq-privacy', 'faq:privacy'),
        ])
        shippingFaqs.value = ship
        privacyFaqs.value = priv
        if (!ship.length && !priv.length) {
            errorMsg.value = 'Belum ada data FAQ.'
        }
    } catch (e: any) {
        errorMsg.value = e?.message || 'Terjadi kesalahan saat memuat FAQ.'
    } finally {
        loading.value = false
    }
}

onMounted(loadAll)
</script>

<style scoped>
:root {
    --brand: #F79F24;
    --ink: #1F1F1F;
    --muted: #6B7280;
    --muted-2: #9CA3AF;
    --line: #EDEDED;
    --soft: #FFF7EC;
    --soft-line: #FFDDB9;
    --max: 1160px;
}

.help {
    max-width: var(--max);
    margin: 0 auto;
    padding: 56px 28px 0;
    color: var(--ink);
    background: #fff;
}

.hero {
    text-align: center;
    margin-bottom: 16px;
}

.hero__title {
    font-weight: 700;
    font-size: 32px;
    line-height: 1.25;
    margin: 0 0 8px;
}

.hero__subtitle {
    max-width: 720px;
    margin: 0 auto;
    font-size: 15px;
    line-height: 1.65;
    color: var(--muted);
}

.callout {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 16px;
    border-radius: 12px;
    border: 0.6px solid var(--brand);
    background: #FDFAED;
    padding: 16px 18px;
    margin: 22px auto 36px;
    max-width: calc(var(--max) - 200px);
}

.callout__icon {
    width: 56px;
    height: 56px;
    display: grid;
    place-items: center;
    margin-top: -12px;
    border: 1px solid var(--soft-line);
    border-radius: 12px;
    color: var(--brand);
}

.callout__icon .i {
    width: 28px;
    height: 28px;
}

.callout__title {
    color: #0A0A0A;
    text-align: justify;
    font-family: Urbanist, sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    margin: -5px 0 6px;
}

.callout__text {
    color: #0A0A0A;
    text-align: justify;
    font-family: Urbanist, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0;
}

.faq {
    padding: 0 100px;
}

.faqGrid {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 40px;
    align-items: start;
}

.faq__heading {
    color: #0A0A0A;
    font-family: Urbanist, sans-serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    margin: 0 0 8px;
}

.faq__desc {
    color: #757575;
    text-align: justify;
    font-family: Urbanist, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0;
    max-width: unset;
}

.accordion {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid #EFEFEF;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    width: 100%;
}

.accordion__item+.accordion__item {
    border-top: 1px solid #EFEFEF;
}

.accordion__button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 22px;
    background: #fff;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.55;
}

.accordion__button:hover {
    background: #FFFDF9;
}

.accordion__q {
    flex: 1;
}

.accordion__chev {
    width: 18px;
    height: 18px;
    transition: transform .2s ease;
}

[aria-expanded="true"] .accordion__chev {
    transform: rotate(180deg);
}

.accordion__panel {
    padding: 0 22px 16px;
    background: #fff;
}

.accordion__a {
    margin: 6px 0 0;
    font-size: 13.6px;
    line-height: 1.85;
    color: #9AA0A6;
}

.cta {
    display: flex;
    justify-content: center;
    padding: 0 18px;
    margin: 36px 0 48px;
}

.cta__inner {
    width: 520px;
    max-width: 100%;
    background: #fff;
    border: 1px solid #ffffff;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.cta__title {
    margin: 0;
    color: #0A0A0A;
    font-family: Urbanist, sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
}

.cta__text {
    margin: 0;
    color: #757575;
    font-family: Urbanist, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
}

.btn {
    margin: 0;
    border: none;
    border-radius: 12px;
    padding: 10px 16px;
    background: #F79F24;
    color: #fff;
    font-family: Urbanist, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    box-shadow: 0 0 2px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .14);
}

.btn:hover {
    filter: brightness(.98);
}

@media (min-width: 1025px) {
    .cta__inner {
        width: 100%;
        max-width: none;
        padding: 12px 16px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .cta__copy {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .cta__title {
        font-size: 18px;
        line-height: 24px;
    }

    .cta__text {
        font-size: 13px;
        line-height: 18px;
    }

    .btn {
        align-self: center;
    }
}

.backtop {
    position: fixed;
    right: 28px;
    bottom: 28px;
    border: 1px solid #FFD39A;
    background: #FFF7EC;
    color: #F79F24;
    border-radius: 999px;
    padding: 10px 14px;
    font-weight: 700;
    box-shadow: 0 2px 0 rgba(0, 0, 0, .03);
}

.backtop:hover {
    background: #FFF2DF;
}

@media (max-width: 1200px) {
    .help {
        padding-left: 24px;
        padding-right: 24px;
    }

    .callout {
        max-width: none;
        margin-left: 24px;
        margin-right: 24px;
    }

    .faq {
        padding: 0 24px;
    }
}

@media (max-width: 1024px) {
    .faqGrid {
        grid-template-columns: 1fr;
        gap: 24px;
    }
}

@media (max-width: 768px) {
    .help {
        padding-top: 32px;
    }

    .hero__title {
        font-size: 26px;
    }

    .hero__subtitle {
        font-size: 14px;
    }

    .callout {
        grid-template-columns: 48px 1fr;
        margin: 18px 18px 28px;
    }

    .faq {
        padding: 0 18px;
    }

    .cta__inner {
        width: 100%;
    }

    .backtop {
        right: 18px;
        bottom: 18px;
    }
}
</style>
