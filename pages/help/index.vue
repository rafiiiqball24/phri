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
            <h3 class="callout__title">Temukan Jawabanmu!</h3>
            <p class="callout__text">
                Temukan pekerjaan impian Anda dengan mudah di PHRI Karir! Cukup masukkan kata kunci seperti posisi
                atau lokasi di kolom pencarian, lalu manfaatkan filter untuk menyesuaikan hasil sesuai kebutuhan.
                Aktifkan notifikasi agar tidak ketinggalan peluang terbaru, dan simpan favorit untuk diakses nanti.
                Jangan lupa lengkapi profil dan unggah CV terbaru agar recruiter dapat menemukan Anda lebih mudah.
            </p>
        </aside>

        <section v-if="loading" class="faq">
            <p>Memuat FAQ…</p>
        </section>
        <section v-else-if="errorMsg" class="faq">
            <p>{{ errorMsg }}</p>
        </section>

        <template v-else>
            <section v-for="t in topics" :key="t.id" class="faq">
                <div class="faqGrid">
                    <div class="faq__intro">
                        <h2 class="faq__heading">{{ t.title }}</h2>
                        <p class="faq__desc">{{ t.description }}</p>
                    </div>

                    <div class="faq__list">
                        <ul class="accordion" role="list">
                            <li v-for="(q, i) in t.faqs" :key="`${t.id}-${i}`" class="accordion__item">
                                <button class="accordion__button" :aria-expanded="opened[t.id] === i"
                                    @click="toggle(t.id, i)">
                                    <span class="accordion__q">{{ q.q }}</span>
                                    <svg class="accordion__chev" viewBox="0 0 24 24" aria-hidden>
                                        <path d="M6 9l6 6 6-6" stroke="#0A0A0A" stroke-width="1.6" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <div class="accordion__panel" v-show="opened[t.id] === i">
                                    <p class="accordion__a">{{ q.a }}</p>
                                </div>
                            </li>

                            <li v-if="!t.faqs.length" class="accordion__item">
                                <div class="accordion__panel">
                                    <p class="accordion__a">Belum ada data untuk topik ini.</p>
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
                        <p class="cta__text">Hubungi tim kami melalui live chat atau email, dan kami akan dengan senang
                            hati
                            membantu.</p>
                    </div>
                    <button type="button" class="btn btn--primary" @click="$router.push('/contact')">
                        Hubungi Kami
                    </button>
                </div>
            </section>
        </template>
    </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
useHead({ title: 'Help' })

type RawFaq = { id: string; question: string; answer: string }
type RawTopic = { id: string; title: string; description: string; faqs: RawFaq[] }
type FaqTopicsResponse = { code: number; message: string; data: { faq_topics: RawTopic[] } }
type QA = { q: string; a: string }
type Topic = { id: string; title: string; description: string; faqs: QA[] }

const BASE = (import.meta.env.VITE_APP_BASE_URL as string || '').replace(/\/+$/, '')
const KEY = import.meta.env.VITE_APP_API_KEY as string

const loading = ref(true)
const errorMsg = ref<string | null>(null)
const topics = ref<Topic[]>([])
const opened = reactive<Record<string, number | null>>({})

const toggle = (topicId: string, i: number) => {
    opened[topicId] = opened[topicId] === i ? null : i
}

async function getFaqTopics(): Promise<FaqTopicsResponse> {
    const url = `${BASE}/faq`
    const res = await fetch(url, {
        headers: {
            'x-api-key': KEY,
            'Accept': 'application/json',
        },
    })
    if (!res.ok) throw new Error(`Gagal memuat FAQ (${res.status})`)
    return res.json() as Promise<FaqTopicsResponse>
}

const mapTopics = (rows: RawTopic[]): Topic[] =>
    (rows || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        faqs: (t.faqs || []).map(f => ({ q: f.question, a: f.answer })),
    }))

async function loadAll() {
    loading.value = true
    errorMsg.value = null
    try {
        const res = await getFaqTopics()
        const data = mapTopics(res?.data?.faq_topics || [])
        topics.value = data
        topics.value.forEach(t => { if (!(t.id in opened)) opened[t.id] = 0 })
        if (!topics.value.length) errorMsg.value = 'Belum ada data FAQ.'
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
    --callout-w: clamp(320px, 88vw, 640px);
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
    max-width: var(--callout-w);
    margin: 20px auto 34px;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid rgba(247, 159, 36, 0.45);
    background: #FDFAED;
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 14px;
    align-items: start;
}

.callout * {
    min-width: 0;
}

.callout__icon {
    margin-top: 2px;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: #0A0A0A;
}

.callout__icon .i {
    width: 28px;
    height: 28px;
}

.callout__title {
    margin: 2px 0 4px;
    color: #0A0A0A;
    text-align: justify;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.003px;
    word-break: break-word;
    hyphens: auto;
}

.callout__text {
    grid-column: 1 / -1;
    margin: 0;
    text-align: justify;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    word-break: break-word;
    hyphens: auto;
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
    background: #fff;
    width: 100%;
}

.accordion__item {
    background: #fff;
    border-top: 1px solid #F3F4F6;
    position: relative;
}

.accordion__item+.accordion__item::before {
    content: "";
    position: absolute;
    top: 0;
    left: -18px;
    right: 0;
    height: 1px;
    background: #F3F4F6;
}

.accordion__item:first-child {
    border-top: none;
}

.accordion__button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    background: #fff;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.55;
    transition: background .2s ease;
}

.accordion__button:hover {
    background: #fffaf3;
}

.accordion__q {
    flex: 1;
    color: #0A0A0A;
    font-family: Urbanist, sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
}

.accordion__chev {
    width: 18px;
    height: 18px;
    transition: transform .25s ease;
}

[aria-expanded="true"] .accordion__chev {
    transform: rotate(180deg);
}

.accordion__panel {
    padding: 12px 0 18px;
    background: #fff;
    border-top: 1px solid #E5E7EB;
    margin-left: -18px;
    padding-left: 18px;
}

.accordion__a {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.75;
    color: #757575;
}

.cta {
    display: flex;
    justify-content: center;
    padding: 0 18px;
    margin: 48px 0 64px;
}

.cta__inner {
    width: 100%;
    max-width: 1500px;
    background: #fff;
    border-radius: 12px;
    padding: 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

.cta__copy {
    flex: 1;
}

.cta__title {
    margin: 0 0 4px;
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
    flex-shrink: 0;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
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

@media (max-width: 768px) {
    .cta__inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 16px 20px;
    }

    .btn {
        align-self: flex-start;
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
        max-width: min(var(--callout-w), calc(100% - 48px));
        margin-left: auto;
        margin-right: auto;
    }

    .faq {
        padding: 0 24px;
    }
}

@media (max-width: 1024px) {
    .callout {
        grid-template-columns: 36px minmax(0, 1fr);
        gap: 12px;
        padding: 14px 16px;
    }

    .callout__icon .i {
        width: 22px;
        height: 22px;
    }

    .callout__title {
        font-size: 16px;
        line-height: 22px;
    }

    .callout__text {
        font-size: 14px;
        line-height: 20px;
    }

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
        max-width: 100%;
        margin: 18px auto 28px;
        grid-template-columns: 32px minmax(0, 1fr);
        padding: 12px 14px;
        gap: 10px;
    }

    .callout__icon {
        width: 32px;
        height: 32px;
    }

    .callout__icon .i {
        width: 18px;
        height: 18px;
    }

    .callout__title {
        font-size: 14px;
        line-height: 20px;
    }

    .callout__text {
        font-size: 12.5px;
        line-height: 18.5px;
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

@media (max-width: 360px) {
    .callout {
        grid-template-columns: 28px minmax(0, 1fr);
        padding: 10px 12px;
    }

    .callout__title {
        font-size: 13.5px;
        line-height: 19px;
    }

    .callout__text {
        font-size: 12px;
        line-height: 18px;
    }
}

.faq+.faq {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #F3F4F6;
}

@media (max-width: 768px) {
    .faq+.faq {
        margin-top: 28px;
        padding-top: 16px;
    }
}
</style>
