<template>
    <div class="cart">
        <div v-if="showDebug" class="debug">
            <label class="debug__item">
                <input type="checkbox" v-model="loading" /> <span>Loading</span>
            </label>
            <label class="debug__item">
                <input type="checkbox" v-model="isEmpty" /> <span>Empty</span>
            </label>
            <button class="debug__btn" @click="tryState('normal')">Normal</button>
            <button class="debug__btn" @click="tryState('loading')">Coba Loading</button>
            <button class="debug__btn" @click="tryState('empty')">Coba Empty</button>
        </div>

        <nav class="breadcrumb">
            <NuxtLink to="/" class="bc bc--home">Beranda</NuxtLink>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <span class="bc">Furniture</span>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <NuxtLink to="/shop/detail-product" class="bc bc--home">Pajamas Unisex</NuxtLink>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <span class="bc bc--current">Keranjang</span>
        </nav>

        <template v-if="loading">
            <div class="cols">
                <section class="list">
                    <article v-for="n in 3" :key="'skl-row-' + n" class="row">
                        <figure class="row__thumb skel"></figure>
                        <div class="row__main">
                            <div class="row__head">
                                <div class="skel skel-line w-40"></div>
                                <div class="skel skel-pill w-12"></div>
                            </div>
                            <div class="row__meta">
                                <div class="skel skel-line w-20"></div>
                                <div class="skel skel-line w-20"></div>
                            </div>
                            <div class="row__foot">
                                <div class="skel skel-line w-16"></div>
                                <div class="stepper">
                                    <div class="skel skel-square"></div>
                                    <div class="skel skel-line w-6"></div>
                                    <div class="skel skel-square"></div>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                <aside class="summary">
                    <div class="summary__box">
                        <div class="summary__top">
                            <div class="skel skel-line w-30"></div>
                            <div class="skel skel-line w-10"></div>
                        </div>
                        <ul class="summary__list">
                            <li v-for="n in 3" :key="'skl-sum-' + n" class="summary__line">
                                <div class="skel skel-line w-50"></div>
                                <div class="skel skel-line w-16"></div>
                            </li>
                        </ul>
                        <div class="summary__total">
                            <div class="skel skel-line w-24"></div>
                            <div class="skel skel-line w-20"></div>
                        </div>
                        <div class="skel skel-btn"></div>
                        <div class="summary__links">
                            <div class="skel skel-line w-20"></div>
                            <div class="skel skel-line w-20"></div>
                            <div class="skel skel-line w-28"></div>
                        </div>
                    </div>
                </aside>
            </div>

            <section class="rec">
                <div class="rec__header">
                    <h2 class="rec__title">Rekomendasi Untuk di Beli</h2>
                    <div class="rec__nav">
                        <button class="navsq" aria-label="Sebelumnya"><img src="/Icons/CaretLeft.svg" alt="" /></button>
                        <button class="navsq" aria-label="Berikutnya"><img src="/Icons/CaretRight.svg"
                                alt="" /></button>
                    </div>
                </div>

                <div class="grid rec__grid">
                    <article v-for="n in 4" :key="'skl-card-' + n" class="card">
                        <div class="card__thumb skel"></div>
                        <div class="card__body">
                            <div class="skel skel-line w-60"></div>
                            <div class="card__tags">
                                <span class="skel skel-chip" v-for="k in 4" :key="'skl-chip-' + n + '-' + k"></span>
                            </div>
                            <div class="skel skel-line w-24"></div>
                        </div>
                    </article>
                </div>
            </section>
        </template>

        <template v-else-if="isEmpty || items.length === 0">
            <section class="empty">
                <img src="/Icons/EmptyState.svg" alt="" class="empty__img" />
                <h3 class="empty__title">Belum ada produk di keranjang</h3>
                <p class="empty__desc">Pilih produk yang kamu suka dan tambahkan ke keranjang!</p>
                <button class="empty__cta" @click="goHome">Belanja Sekarang</button>
            </section>

            <section class="rec">
                <div class="rec__header">
                    <h2 class="rec__title">Rekomendasi Untuk di Beli</h2>
                    <div class="rec__nav">
                        <button class="navsq" aria-label="Sebelumnya"><img src="/Icons/CaretLeft.svg" alt="" /></button>
                        <button class="navsq" aria-label="Berikutnya"><img src="/Icons/CaretRight.svg"
                                alt="" /></button>
                    </div>
                </div>

                <div class="grid rec__grid">
                    <article v-for="(p, i) in recommended" :key="'rec-empty-' + i"
                        :class="['card', { 'card--soldout': p.soldOut }]">
                        <div class="card__thumb" :class="{ 'card__thumb--soldout': p.soldOut }">
                            <img :src="p.image" :alt="p.name" />
                            <span v-if="p.soldOut" class="soldout-badge">
                                <span class="soldout-text">Stok Habis</span>
                            </span>
                        </div>
                        <div class="card__body">
                            <h3 class="card__name">{{ p.name }}</h3>
                            <ul class="card__tags">
                                <li>Oranye</li>
                                <li>Hijau</li>
                                <li>Biru</li>
                                <li>Putih</li>
                                <li>+3</li>
                            </ul>
                            <p class="card__price">Rp{{ formatIDR(p.price) }}</p>
                        </div>
                    </article>
                </div>
            </section>
        </template>

        <template v-else>
            <div class="cols">
                <section class="list">
                    <article v-for="(item, i) in items" :key="item.id" class="row">
                        <figure class="row__thumb">
                            <img :src="item.image" :alt="item.name" />
                        </figure>

                        <div class="row__main">
                            <div class="row__head">
                                <h3 class="row__name">{{ item.name }}</h3>
                                <button class="row__remove" @click="remove(i)">Hapus</button>
                            </div>

                            <div class="row__meta">
                                <span>Warna: <b>{{ item.color }}</b></span>
                                <span>Ukuran: <b>{{ item.size }}</b></span>
                            </div>

                            <div class="row__foot">
                                <div class="row__price">Rp{{ formatIDR(item.price) }}</div>

                                <div class="stepper">
                                    <button class="stepper__btn" :disabled="item.qty <= 1" @click="dec(i)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 16 16" fill="none">
                                            <path d="M12.7992 8L3.19922 8" stroke="#1F1F1F" stroke-width="1.5"
                                                stroke-linecap="round" />
                                        </svg>
                                    </button>

                                    <span class="stepper__val">{{ item.qty }}</span>

                                    <button class="stepper__btn" @click="inc(i)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 16 16" fill="none">
                                            <path d="M7.99922 3.19922L7.99922 12.7992M12.7992 7.99922L3.19922 7.99922"
                                                stroke="#1F1F1F" stroke-width="1.5" stroke-linecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                <aside class="summary">
                    <div class="summary__box">
                        <div class="summary__top">
                            <h4 class="summary__title">Ringkasan Pembelian</h4>
                            <span class="summary__count">{{ items.length }} Item</span>
                        </div>

                        <ul class="summary__list">
                            <li v-for="it in items" :key="'s-' + it.id" class="summary__line">
                                <span class="summary__lineName">{{ it.qty }}× {{ it.name }}</span>
                                <span class="summary__linePrice">Rp{{ formatIDR(it.price * it.qty) }}</span>
                            </li>
                        </ul>

                        <div class="summary__total">
                            <span>Estimasi Pembayaran</span>
                            <b>Rp{{ formatIDR(grandTotal) }}</b>
                        </div>

                        <button class="summary__cta" @click="goCheckout">Buat Pesanan</button>

                        <div class="summary__links">
                            <NuxtLink to="/help" class="link no-underline">Butuh Bantuan?</NuxtLink>
                            <NuxtLink to="/contact" class="link">Hubungi Kami</NuxtLink>
                            <NuxtLink to="/shipping" class="link">Informasi Pengiriman</NuxtLink>
                        </div>
                    </div>
                </aside>
            </div>

            <section class="rec">
                <div class="rec__header">
                    <h2 class="rec__title">Rekomendasi Untuk di Beli</h2>
                    <div class="rec__nav">
                        <button class="navsq" aria-label="Sebelumnya"><img src="/Icons/CaretLeft.svg" alt="" /></button>
                        <button class="navsq" aria-label="Berikutnya"><img src="/Icons/CaretRight.svg"
                                alt="" /></button>
                    </div>
                </div>

                <div class="grid rec__grid">
                    <article v-for="(p, i) in recommended" :key="i" :class="['card', { 'card--soldout': p.soldOut }]">
                        <div class="card__thumb" :class="{ 'card__thumb--soldout': p.soldOut }">
                            <img :src="p.image" :alt="p.name" />
                            <span v-if="p.soldOut" class="soldout-badge">
                                <span class="soldout-text">Stok Habis</span>
                            </span>
                        </div>

                        <div class="card__body">
                            <h3 class="card__name">{{ p.name }}</h3>
                            <ul class="card__tags">
                                <li>Oranye</li>
                                <li>Hijau</li>
                                <li>Biru</li>
                                <li>Putih</li>
                                <li>+3</li>
                            </ul>
                            <p class="card__price">Rp{{ formatIDR(p.price) }}</p>
                        </div>
                    </article>
                </div>
            </section>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

type CartItem = {
    id: number
    name: string
    image: string
    price: number
    qty: number
    color: string
    size: string
}

const items = ref<CartItem[]>([
    { id: 1, name: 'PUMA Travel Backpack', image: '/Images/shop/product.webp', price: 290000, qty: 2, color: 'Oranye', size: 'XL' },
    { id: 2, name: 'Pajamas Unisex', image: '/Images/shop/product2.webp', price: 290000, qty: 1, color: 'Oranye', size: 'XL' },
    { id: 3, name: 'Pajamas Unisex', image: '/Images/shop/product2.webp', price: 290000, qty: 1, color: 'Oranye', size: 'XL' }
])

const recommended = ref(
    Array.from({ length: 4 }).map((_, i) => ({
        name: 'PUMA Travel Backpack',
        image: '/Images/shop/product.webp',
        price: 340000,
        soldOut: i === 3
    }))
)

const loading = ref(false)
const isEmpty = ref(false)
const showDebug = ref(false)

const formatIDR = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 0 })
const grandTotal = computed(() => items.value.reduce((acc, it) => acc + it.price * it.qty, 0))

function inc(i: number) { items.value[i].qty++ }
function dec(i: number) { if (items.value[i].qty > 1) items.value[i].qty-- }
function remove(i: number) { items.value.splice(i, 1) }

const router = useRouter()
function goBackToDetail() {
    if (window.history.length > 1) router.back()
    else router.push('/shop')
}

function goHome() {
    router.push('/')
}

function goCheckout() {
    router.push('/shop/checkout')
}

function tryState(mode: 'normal' | 'loading' | 'empty') {
    if (mode === 'normal') {
        loading.value = false
        isEmpty.value = false
        if (items.value.length === 0) {
            items.value = [
                { id: 1, name: 'PUMA Travel Backpack', image: '/Images/shop/product.webp', price: 290000, qty: 2, color: 'Oranye', size: 'XL' },
                { id: 2, name: 'Pajamas Unisex', image: '/Images/shop/product2.webp', price: 290000, qty: 1, color: 'Oranye', size: 'XL' },
                { id: 3, name: 'Pajamas Unisex', image: '/Images/shop/product2.webp', price: 290000, qty: 1, color: 'Oranye', size: 'XL' }
            ]
        }
    } else if (mode === 'loading') {
        loading.value = true
    } else if (mode === 'empty') {
        loading.value = false
        isEmpty.value = true
        items.value = []
    }
}
</script>

<style scoped>
.cart {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px 56px
}

.debug {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 0
}

.debug__item {
    display: flex;
    align-items: center;
    gap: 6px;
    font: 500 13px/1 var(--Font-Family-Text-Body, Urbanist)
}

.debug__btn {
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 18px 0 14px
}

.bc {
    color: #757575;
    text-align: center;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px
}

.bc--home {
    color: #757575;
    text-decoration: none !important;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px
}

.bc--current {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px
}

.bc--link {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #757575;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    text-decoration: none !important
}

.bc--link:hover {
    text-decoration: underline
}

.bc__icon {
    width: 14px;
    height: 14px
}

.cols {
    display: grid;
    grid-template-columns: 1fr 392px;
    gap: 28px;
    align-items: start;
    margin-top: 20px
}

.list {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.row {
    display: grid;
    grid-template-columns: 186px 1fr;
    gap: 16px;
    padding: 12px;
    border: 1px solid #EAEAEA;
    border-radius: 12px;
    background: #fff
}

.row__thumb {
    width: 186px;
    height: 134px;
    border-radius: 8px;
    overflow: hidden;
    background: #f2f2f2;
    margin: 0
}

.row__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block
}

.row__main {
    display: flex;
    flex-direction: column;
    gap: 10px
}

.row__head {
    display: flex;
    align-items: center;
    justify-content: space-between
}

.row__name {
    margin: 0;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px
}

.row__remove {
    background: none;
    border: none;
    cursor: pointer;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 12px;
    font-weight: 500;
    line-height: 18px
}

.row__remove:hover {
    color: #757575
}

.row__meta {
    display: flex;
    gap: 16px;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 500;
    line-height: 22px
}

.row__meta b {
    color: #757575;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px
}

.row__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px
}

.row__price {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    margin-top: 20px
}

.stepper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid #EAEAEA;
    border-radius: 8px;
    background: #fff
}

.stepper__btn {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: none;
    background: #fff;
    font: 700 14px/1 Inter, sans-serif;
    cursor: pointer
}

.stepper__btn:disabled {
    opacity: .45;
    cursor: not-allowed
}

.stepper__val {
    min-width: 20px;
    text-align: center;
    font: 600 14px/1 var(--Font-Family-Text-Body, Urbanist);
    color: #0A0A0A
}

.summary__box {
    display: flex;
    width: 392px;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    border-radius: 16px;
    border: 1px solid #EDEDED;
    background: #fff;
    box-sizing: border-box
}

.summary__top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between
}

.summary__title {
    margin: 0;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px
}

.summary__count {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px
}

.summary__list {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px
}

.summary__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #757575;
    font: 500 12px/18px var(--Font-Family-Text-Body, Urbanist)
}

.summary__lineName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 8px;
    color: #757575;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px
}

.summary__linePrice {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px
}

.summary__total {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-top: 1px dashed #EAEAEA;
    border-bottom: 1px dashed #EAEAEA
}

.summary__total span,
.summary__total b {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px
}

.summary__cta {
    width: 100%;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: #F79F24;
    color: #FFF;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px
}

.summary__links {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap
}

.summary__links .no-underline {
    text-decoration: none !important
}

.summary__links .link {
    color: #757575;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px
}

.summary__links .link:hover {
    color: #0A0A0A
}

.rec {
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
    max-width: 100vw;
    margin-top: 32px
}

.rec__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1440px;
    padding: 0 112px;
    margin: 0 auto 12px;
    box-sizing: border-box
}

.rec__title {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Tittle, Urbanist);
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    letter-spacing: -.005px
}

.rec__nav {
    display: flex;
    gap: 16px
}

.navsq {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: #F79F24;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px
}

.navsq img {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1)
}

.grid.rec__grid {
    display: flex;
    width: 1440px;
    padding: 24px 112px;
    gap: 20px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    margin: 0 auto;
    box-sizing: border-box
}

.card {
    display: flex;
    width: 289px;
    flex-direction: column;
    border-radius: 16px;
    background: #fff;
    border: 1px solid #EAEAEA;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .04)
}

.card__thumb {
    position: relative;
    width: 100%;
    height: 289px;
    background: #f2f2f2
}

.card__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block
}

.card--soldout .card__thumb img {
    filter: grayscale(100%);
    opacity: .9
}

.soldout-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    padding: 8px 12px;
    border-radius: 10px;
    background: #FEF6F2;
    backdrop-filter: blur(10px)
}

.soldout-text {
    color: #FF4542;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px
}

.card__body {
    display: flex;
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    background: #fff
}

.card__name {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    margin: 0
}

.card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0;
    margin: 0;
    list-style: none;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: #757575
}

.card__tags li {
    background: #F5F5F5;
    padding: 2px 6px;
    border-radius: 6px;
    white-space: nowrap
}

.card--soldout .card__tags li {
    background: #9E9E9E;
    color: #FFF
}

.card__price {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    margin: 0
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 0 8px;
    text-align: center
}

.empty__img {
    width: 200px;
    height: 200px;
    display: block
}

.empty__title {
    margin: 0;
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    text-align: center;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-M, 20px);
    font-style: normal;
    font-weight: var(--Weight-weight-700, 700);
    line-height: var(--Font-Line-Height-M, 28px);
    letter-spacing: -0.003px;
}

.empty__desc {
    margin: 0;
    color: var(--Text-color-text-neutral-secondary, #757575);
    text-align: center;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-SM, 16px);
    font-style: normal;
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-SM, 24px);
}

.empty__cta {
    display: flex;
    padding: var(--Space-space-200, 8px) var(--Space-space-300, 12px);
    align-items: center;
    gap: 8px;
    border-radius: 10px;
    border: 0;
    background: var(--Bg-color-bg-button-secondary-default, #FDFAED);
    color: var(--Text-color-text-button-secondary-default, #F79F24);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-SM, 16px);
    font-style: normal;
    font-weight: var(--Weight-weight-500, 500);
    line-height: var(--Font-Line-Height-SM, 24px);
    cursor: pointer
}

.skel {
    background: var(--Gradient-Skeleton, linear-gradient(270deg, rgba(219, 219, 219, 0.05) 0%, #DBDBDB 50%));
    animation: shimmer 1.3s infinite linear;
    background-size: 200% 100%;
    border-radius: 8px
}

.skel-line {
    height: 14px
}

.skel-pill {
    height: 18px;
    border-radius: 999px
}

.skel-square {
    width: 30px;
    height: 30px;
    border-radius: 6px
}

.skel-btn {
    width: 100%;
    height: 36px;
    border-radius: 10px
}

.skel-chip {
    display: inline-block;
    width: 48px;
    height: 18px;
    border-radius: 6px
}

.w-6 {
    width: 24px
}

.w-10 {
    width: 40px
}

.w-12 {
    width: 48px
}

.w-16 {
    width: 64px
}

.w-20 {
    width: 80px
}

.w-24 {
    width: 96px
}

.w-28 {
    width: 112px
}

.w-30 {
    width: 120px
}

.w-40 {
    width: 160px
}

.w-50 {
    width: 200px
}

.w-60 {
    width: 240px
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

@media (max-width:1024px) {
    .cols {
        grid-template-columns: 1fr;
        gap: 16px
    }

    .rec__header {
        width: 100%;
        padding: 0 16px
    }

    .grid.rec__grid {
        width: 100%;
        padding: 16px;
        flex-wrap: wrap;
        justify-content: center
    }
}

@media (max-width:600px) {
    .cart {
        padding: 0 16px 48px
    }

    .row {
        grid-template-columns: 88px 1fr;
        gap: 12px;
        padding: 10px
    }

    .row__thumb {
        width: 88px;
        height: 88px
    }

    .row__head {
        align-items: flex-start
    }

    .row__name {
        font-size: 14px;
        line-height: 20px
    }

    .row__meta {
        gap: 10px;
        font-size: 12px;
        line-height: 18px
    }

    .row__meta b {
        font-size: 12px;
        line-height: 18px
    }

    .row__price {
        margin-top: 0;
        font-size: 14px;
        line-height: 20px
    }

    .stepper {
        gap: 6px;
        padding: 4px 6px;
        border-radius: 6px
    }

    .stepper__btn {
        width: 26px;
        height: 26px;
        border-radius: 6px
    }

    .stepper__val {
        min-width: 18px;
        font-size: 13px
    }

    .summary__box {
        width: 100%;
        padding: 12px
    }

    .summary__title,
    .summary__count {
        font-size: 14px;
        line-height: 20px
    }

    .summary__total span,
    .summary__total b {
        font-size: 14px;
        line-height: 20px
    }

    .summary__links {
        gap: 6px
    }

    .rec__header {
        width: 100%;
        padding: 0 16px;
        margin-bottom: 8px
    }

    .rec__title {
        font-size: 18px;
        line-height: 24px
    }

    .navsq {
        width: 28px;
        height: 28px
    }

    .navsq img {
        width: 14px;
        height: 14px
    }

    .grid.rec__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        width: 100%;
        padding: 12px 16px 20px
    }

    .card {
        width: auto;
        border-radius: 12px
    }

    .card__thumb {
        height: 140px
    }

    .card__name {
        font-size: 13px;
        line-height: 18px
    }

    .card__price {
        font-size: 13px;
        line-height: 18px
    }

    .rec {
        margin-top: 24px
    }
}

@media (max-width:600px) {
    .rec__nav {
        display: none !important
    }

    .rec__header {
        justify-content: flex-start
    }
}

@media (min-width: 1025px) {
    .cols {
        gap: 140px
    }
}
</style>
