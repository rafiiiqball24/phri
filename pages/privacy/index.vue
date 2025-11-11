<template>
    <section class="privacy">
        <header class="hero">
            <h1 class="hero__title">Privacy & Policy</h1>
        </header>

        <section v-if="loading" class="intro intro--loading">
            <p>Memuat pernyataan privasi…</p>
        </section>

        <section v-else-if="errorMsg" class="intro intro--error">
            <p>{{ errorMsg }}</p>
        </section>

        <section v-else class="intro">
            <p class="intro__text">{{ statement }}</p>
        </section>

        <section v-if="!loading && !errorMsg" class="faq">
            <ul class="accordion" role="list">
                <li v-for="(row, i) in faqs" :key="row.id || i" class="accordion__item">
                    <button class="accordion__button" :aria-expanded="opened === i" @click="toggle(i)">
                        <span class="accordion__q">{{ row.question }}</span>
                        <svg class="accordion__chev" viewBox="0 0 24 24" aria-hidden>
                            <path d="M6 9l6 6 6-6" stroke="#0A0A0A" stroke-width="1.6" fill="none"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <div class="accordion__panel" v-show="opened === i">
                        <p class="accordion__a">{{ row.answer }}</p>
                    </div>
                </li>
                <li v-if="!faqs.length" class="accordion__item">
                    <div class="accordion__panel">
                        <p class="accordion__a">Belum ada data.</p>
                    </div>
                </li>
            </ul>
        </section>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
useHead({ title: 'Privacy & Policy' })

type Faq = { id?: string; question: string; answer: string }
type ApiOk = { code: number; message: string; data: Record<string, any> }

const BASE = (import.meta.env.VITE_APP_BASE_URL as string || '').replace(/\/+$/, '')
const KEY = import.meta.env.VITE_APP_API_KEY as string

const LS_KEY = 'privacy:auto'

const loading = ref(true)
const errorMsg = ref<string | null>(null)
const statement = ref('')
const faqs = ref<Faq[]>([])
const opened = ref<number | null>(0)
const toggle = (i: number) => { opened.value = opened.value === i ? null : i }

const lsGet = <T = unknown>(k: string): T | null => {
    try {
        const raw = localStorage.getItem(k)
        return raw ? JSON.parse(raw) as T : null
    } catch {
        localStorage.removeItem(k)
        return null
    }
}
const lsSet = (k: string, v: unknown) => {
    try {
        localStorage.setItem(k, JSON.stringify(v))
    } catch { }
}

const findStatement = (bag: Record<string, any>): string => {
    for (const k of Object.keys(bag || {})) {
        if (k.replace(/\s/g, '').toLowerCase().includes('privacy_statement')) {
            return String(bag[k] ?? '')
        }
    }
    return ''
}

async function getRemote(): Promise<{ statement: string; faqs: Faq[] }> {
    const url = `${BASE}/privacy-statement`
    const res = await fetch(url, { headers: { 'x-api-key': KEY, 'Accept': 'application/json' } })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Gagal memuat Privacy Statement (HTTP ${res.status})${text ? ` - ${text}` : ''}`)
    }
    const json = await res.json() as ApiOk
    const data = json?.data || {}
    const stmt = findStatement(data).replace(/\r\n/g, '\n').trim()
    const list = Array.isArray(data.faqs)
        ? data.faqs.map((r: any) => ({ id: r.id, question: String(r.question || ''), answer: String(r.answer || '') }))
        : []
    return { statement: stmt, faqs: list }
}

async function load() {
    loading.value = true
    errorMsg.value = null

    const cached = lsGet<{ statement: string; faqs: Faq[]; updatedAt: number }>(LS_KEY)
    if (cached) {
        statement.value = cached.statement
        faqs.value = cached.faqs
        loading.value = false
        getRemote()
            .then(fresh => {
                statement.value = fresh.statement
                faqs.value = fresh.faqs
                lsSet(LS_KEY, { ...fresh, updatedAt: Date.now() })
            })
            .catch(() => { })
        return
    }

    try {
        const fresh = await getRemote()
        statement.value = fresh.statement
        faqs.value = fresh.faqs
        lsSet(LS_KEY, { ...fresh, updatedAt: Date.now() })
    } catch (e: any) {
        errorMsg.value = e?.message || 'Gagal memuat data.'
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>




<style scoped>
:root {
    --brand: #F79F24;
    --ink: #1F1F1F;
    --muted: #6B7280;
    --line: #EDEDED;
    --max: 1160px;
}

.privacy {
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

.intro {
    border-radius: var(--Border-Radius-border-radius-300, 12px);
    background: var(--Bg-color-bg, #FFF);
    box-shadow: 0 4px 15px 0 rgba(16, 24, 40, 0.12);
    padding: 20px 24px;
    margin: 0 0 24px;
    margin-top: 62px;
}

.intro__text {
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    text-align: justify;
    font-family: var(--Font-Family-Text-Body, Urbanist), system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: var(--Font-Size-SM, 16px);
    font-style: normal;
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-SM, 24px);
    white-space: pre-line;
    letter-spacing: 0;
}

.faq {
    padding: 0 100px;
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
    transition: transform 0.25s ease;
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

.privacy {
    padding-bottom: 340px;

}

@media (max-width: 768px) {
    .privacy {
        padding-bottom: 120px;

    }
}

@media (max-width: 1200px) {
    .privacy {
        padding-left: 24px;
        padding-right: 24px
    }

    .faq {
        padding: 0 24px
    }

    .intro {
        margin-left: 0;
        margin-right: 0
    }
}

@media (max-width: 768px) {
    .privacy {
        padding-top: 32px
    }

    .intro {
        padding: 16px 18px;
    }


    .hero__title {
        font-size: 26px
    }

    .faq {
        padding: 0 18px
    }
}
</style>
