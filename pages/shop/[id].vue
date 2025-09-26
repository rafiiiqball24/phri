<template>
    <div class="detail">
        <div v-if="showDebug" class="debug">
            <label class="debug__item">
                <input type="checkbox" v-model="loading" />
                <span>Loading</span>
            </label>
            <label class="debug__item">
                <input type="checkbox" v-model="forceStockZero" />
                <span>Paksa Stok 0</span>
            </label>
            <button class="debug__btn" @click="reset">Reset</button>
            <button class="debug__btn" @click="simulateLoading()">Simulasi 1.5s</button>
        </div>

        <nav class="breadcrumb">
            <NuxtLink to="/" class="bc bc--home">Beranda</NuxtLink>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <span class="bc bc--current">Detail Produk</span>
        </nav>

        <div class="cols">
            <div class="col col--left">
                <figure v-if="!loading" class="media">
                    <img :src="product.image" :alt="product.name" />
                    <div class="badge">
                        <svg class="badge__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                            stroke="#DBAD1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
                        </svg>
                        <span class="badge__text">Highly Recommend</span>
                    </div>
                    <figcaption class="pager">1/10</figcaption>
                    <div class="navgroup">
                        <button class="navbtn navbtn--left" aria-label="Sebelumnya">
                            <img src="/Icons/CaretLeft.svg" alt="" />
                        </button>
                        <button class="navbtn navbtn--right" aria-label="Berikutnya">
                            <img src="/Icons/CaretRight.svg" alt="" />
                        </button>
                    </div>
                </figure>
                <div v-else class="media skeleton-block"></div>

                <section v-if="!loading" class="desc desc--desktop">
                    <h3 class="desc__title">Deskripsi</h3>
                    <p class="desc__body">
                        Tunjukkan kebanggaanmu sebagai bagian dari industri perhotelan dan restoran Indonesia dengan
                        Kaos Official PHRI edisi reguler. Didesain minimalis namun elegan, kaos ini menampilkan logo
                        resmi PHRI yang dicetak menggunakan teknik sablon berkualitas tinggi.
                    </p>
                    <button class="desc__read">
                        Baca semua
                        <img src="/Icons/CaretDownOrange.svg" alt="" />
                    </button>
                </section>

                <section v-else class="desc">
                    <div class="skeleton-line h20 w40 mt20"></div>
                    <div class="skeleton-line h14 w90"></div>
                    <div class="skeleton-line h14 w85"></div>
                    <div class="skeleton-line h14 w70"></div>
                    <div class="skeleton-pill w20 mt10"></div>
                </section>
            </div>

            <div class="col col--right">
                <template v-if="!loading">
                    <h1 class="title">{{ product.name }}</h1>
                    <div class="category">Cloths</div>
                    <div class="price">Rp{{ formatIDR(product.price) }}</div>
                    <div class="tax">Termasuk pajak.</div>
                </template>
                <template v-else>
                    <div class="skeleton-line h26 w60"></div>
                    <div class="skeleton-line h16 w20 mt8"></div>
                    <div class="skeleton-line h22 w30 mt12"></div>
                    <div class="skeleton-line h16 w18 mt8"></div>
                </template>

                <div class="block">
                    <template v-if="!loading">
                        <div class="block__head">
                            <span class="block__label">Pilih Ukuran</span>
                            <button class="sizeguide" type="button">Size Guide</button>
                        </div>
                        <div class="optgrid">
                            <button v-for="size in product.sizes" :key="size.name" class="opt"
                                :class="{ 'is-disabled': !size.available, 'is-active': selectedSize === size.name }"
                                :disabled="!size.available || loading" @click="selectSize(size)">
                                {{ size.name }}
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="skeleton-line h16 w25 mt20"></div>
                        <div class="optgrid mt10">
                            <div v-for="i in 6" :key="'size-' + i" class="opt skeleton-pill"></div>
                        </div>
                    </template>
                </div>

                <div class="block">
                    <template v-if="!loading">
                        <div class="block__head">
                            <span class="block__label">Pilih Warna</span>
                        </div>
                        <div class="optgrid">
                            <button v-for="color in product.colors" :key="color.name" class="opt"
                                :class="{ 'is-disabled': !color.available, 'is-active': selectedColor === color.name }"
                                :disabled="!color.available || loading" @click="selectColor(color)">
                                {{ color.name }}
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="skeleton-line h16 w25 mt20"></div>
                        <div class="optgrid mt10">
                            <div v-for="i in 6" :key="'color-' + i" class="opt skeleton-pill"></div>
                        </div>
                    </template>
                </div>

                <template v-if="!loading">
                    <div class="stock">Stok: {{ currentStock }}</div>
                    <button class="cta" :disabled="isCtaDisabled" @click="addToCart">Tambahkan ke Keranjang</button>
                </template>
                <template v-else>
                    <div class="skeleton-line h16 w15 mt20"></div>
                    <div class="skeleton-btn mt10"></div>
                </template>

                <section v-if="!loading" class="desc desc--mobile">
                    <h3 class="desc__title">Deskripsi</h3>
                    <p class="desc__body">
                        Tunjukkan kebanggaanmu sebagai bagian dari industri perhotelan dan restoran Indonesia dengan
                        Kaos Official PHRI
                        edisi reguler. Didesain minimalis namun elegan, kaos ini menampilkan logo resmi PHRI yang
                        dicetak menggunakan
                        teknik sablon berkualitas tinggi.
                    </p>
                    <button class="desc__read">
                        Baca semua
                        <img src="/Icons/CaretDownOrange.svg" alt="" />
                    </button>
                </section>

                <section v-if="!loading" class="ship">
                    <h3 class="ship__title">Informasi Pengiriman</h3>
                    <div class="ship__row">
                        <img src="/Icons/truck.svg" alt="" class="ship__icon" />
                        <p class="ship__text">
                            Diperkirakan tiba dalam 12–15 hari (Pulau Jawa), 20–22 hari (Luar Pulau Jawa) setelah
                            pemesanan.
                        </p>
                    </div>
                    <div class="ship__row">
                        <img src="/Icons/package.svg" alt="" class="ship__icon" />
                        <p class="ship__text">
                            Kami menggunakan pengemasan yang aman. Apabila terdapat penambahan pengemasan, harap
                            menghubungi kontak
                            layanan kami.
                        </p>
                    </div>
                    <div class="ship__row">
                        <img src="/Icons/box.svg" alt="" class="ship__icon" />
                        <p class="ship__text">Kerusakan dalam pengantaran diluar dari tanggung jawab kami.</p>
                    </div>
                </section>

                <section v-else class="ship">
                    <div class="skeleton-line h20 w40 mt40"></div>
                    <div class="ship__row">
                        <div class="ship__icon skeleton-block"></div>
                        <div class="skeleton-line h14 w70"></div>
                    </div>
                    <div class="ship__row">
                        <div class="ship__icon skeleton-block"></div>
                        <div class="skeleton-line h14 w80"></div>
                    </div>
                    <div class="ship__row">
                        <div class="ship__icon skeleton-block"></div>
                        <div class="skeleton-line h14 w65"></div>
                    </div>
                </section>
            </div>
        </div>

        <section class="rec">
            <div class="rec__head">
                <h2 v-if="!loading" class="rec__title">Rekomendasi Untuk di Beli</h2>
                <div v-else class="rec__title skeleton-line h24 w30"></div>

                <div v-if="!loading" class="rec__nav">
                    <button class="rec__btn" aria-label="Sebelumnya"><img src="/Icons/CaretLeft.svg" alt="" /></button>
                    <button class="rec__btn rec__btn--next" aria-label="Berikutnya"><img src="/Icons/CaretRight.svg"
                            alt="" /></button>
                </div>
                <div v-else class="rec__nav">
                    <span class="sk-circle"></span>
                    <span class="sk-circle"></span>
                </div>
            </div>

            <div v-if="!loading" class="grid rec__grid">
                <article v-for="(p, i) in recommended" :key="i" :class="['card', { 'card--soldout': p.soldOut }]">
                    <div class="card__thumb" :class="{ 'card__thumb--soldout': p.soldOut }">
                        <img :src="p.image" :alt="p.name" />
                        <span v-if="p.soldOut" class="soldout-badge"><span class="soldout-text">Stok Habis</span></span>
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

            <div v-else class="grid rec__grid">
                <div v-for="i in 4" :key="'sk-card-' + i" class="card">
                    <div class="card__thumb skeleton-block"></div>
                    <div class="card__body">
                        <div class="skeleton-line h18 w70"></div>
                        <div class="skeleton-line h14 w60"></div>
                        <div class="skeleton-line h18 w40"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { navigateTo } from '#app'

const product = ref({
    name: 'Pajamas Unisex',
    price: 290000,
    stock: 12,
    image: '/Images/shop/product2.webp',
    sizes: [
        { name: 'S', available: true },
        { name: 'M', available: true },
        { name: 'L', available: true },
        { name: 'XL', available: false },
        { name: 'XXL', available: true },
        { name: 'XXXL', available: true }
    ],
    colors: [
        { name: 'Putih', available: true },
        { name: 'Krem', available: true },
        { name: 'Coklat', available: true },
        { name: 'Abu-abu', available: false },
        { name: 'Dongker', available: true },
        { name: 'Khaki', available: true }
    ]
})

const recommended = ref(
    Array.from({ length: 4 }).map((_, i) => ({
        name: 'PUMA Travel Backpack',
        image: '/Images/shop/product.webp',
        price: 340000,
        soldOut: i === 3
    }))
)

const selectedSize = ref('')
const selectedColor = ref('')

const showDebug = true
const loading = ref(false)
const forceStockZero = ref(false)

const currentStock = computed(() => (forceStockZero.value ? 0 : product.value.stock))
const isCtaDisabled = computed(() => loading.value || currentStock.value === 0)

function selectSize(size: any) {
    if (size.available && !loading.value) selectedSize.value = size.name
}
function selectColor(color: any) {
    if (color.available && !loading.value) selectedColor.value = color.name
}

async function addToCart() {
    if (isCtaDisabled.value) return
    await navigateTo('/shop/cart')
}

function reset() {
    loading.value = false
    forceStockZero.value = false
}

function simulateLoading(ms = 1500) {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, ms)
}

const formatIDR = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 0 })
</script>

<style scoped>
.detail {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px 56px
}

.debug {
    position: fixed;
    right: 16px;
    bottom: 16px;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, .95);
    box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
    z-index: 50
}

.debug__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: 500 12px/1 Inter, sans-serif;
    color: #333
}

.debug__btn {
    border: 1px solid #ddd;
    background: #f7f7f7;
    border-radius: 8px;
    padding: 6px 10px;
    font: 600 12px/1 Inter, sans-serif;
    cursor: pointer
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 18px 0 14px
}

.bc {
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    line-height: 22px;
    font-weight: 600
}

.bc--home {
    color: #757575;
    text-decoration: none !important
}

.bc--current {
    color: #0A0A0A
}

.bc__icon {
    width: 14px;
    height: 14px
}

.cols {
    display: grid;
    grid-template-columns: 495px 1fr;
    gap: 36px;
    align-items: start;
    margin-top: 40px
}

.media {
    position: relative;
    width: 495px;
    height: 495px;
    border-radius: 12px;
    overflow: hidden;
    margin: 0;
    background: #f2f2f2
}

.media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block
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
    height: 16px;
    display: block
}

.badge__text {
    color: #DBAD1B;
    font: 500 12px/16px Inter, sans-serif;
    white-space: nowrap
}

.pager {
    position: absolute;
    left: 16px;
    bottom: 16px;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px
}

.navgroup {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px
}

.navbtn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, .25)
}

.navbtn img {
    width: 16px;
    height: 16px
}

.navbtn--right {
    background: #EDEDED;
    border: 1px solid #C2C2C2
}

.desc {
    margin-top: 60px
}

.desc__title {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0 0 8px
}

.desc__body {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0 0 8px
}

.desc__read {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 0;
    border-radius: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: #F79F24;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 12px;
    font-weight: 500;
    line-height: 18px
}

.desc--desktop {
    display: block
}

.desc--mobile {
    display: none
}

.title {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    letter-spacing: -.003px;
    margin: 8px 0 2px
}

.category {
    color: #757575;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 500;
    line-height: 22px
}

.price {
    margin-top: 18px;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -.003px
}

.tax {
    margin-top: 8px;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 700;
    line-height: 22px
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
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 500;
    line-height: 22px
}

.sizeguide {
    color: #9E9E9E;
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 12px;
    line-height: 18px
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
    gap: 8px;
    flex: 1 0 0;
    min-width: 80px;
    border-radius: 4px;
    border: 1px solid #EDEDED;
    background: #FFF;
    color: #000;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    cursor: pointer
}

.opt.is-disabled {
    border: 1px solid #E0E0E0;
    background: #EDEDED;
    color: #9E9E9E;
    cursor: not-allowed
}

.opt.is-active {
    border: 1px solid #F79F24;
    color: #D47E1A
}

.stock {
    margin-top: 12px;
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 500;
    line-height: 22px
}

.cta {
    margin-top: 12px;
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    width: 100%;
    border-radius: 10px;
    border: none;
    background: #F79F24;
    color: #FFF;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    transition: .2s
}

.cta:disabled {
    background: #E0E0E0;
    color: #9E9E9E;
    cursor: not-allowed
}

.ship {
    margin-top: 75px
}

.ship__title {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0 0 6px
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
    flex: 0 0 auto;
    border-radius: 8px;
    background: #ffffff
}

.ship__text {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px
}

.rec {
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
    max-width: 100vw;
    margin-top: 36px
}

.rec__head {
    width: 1440px;
    padding: 0 112px;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box
}

.rec__title {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Tittle, Urbanist);
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    margin: 0
}

.rec__nav {
    display: flex;
    align-items: center;
    gap: 8px
}

.rec__btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: #F79F24;
    cursor: pointer;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .12), 0 1px 2px 0 rgba(0, 0, 0, .14);
    transition: transform .15s ease
}

.rec__btn:hover {
    transform: translateY(-1px)
}

.rec__btn:active {
    transform: translateY(0)
}

.rec__btn img {
    width: 14px;
    height: 14px;
    filter: invert(1) brightness(5)
}

.sk-circle {
    width: 28px;
    height: 28px;
    border-radius: 8px
}

.grid.rec__grid {
    display: flex;
    width: 1440px;
    padding: 40px 112px;
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
    gap: 20px;
    background: #fff
}

.card__name {
    color: #0A0A0A;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
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
    color: #75775
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
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    margin: 0
}

.skeleton-block,
.skeleton-line,
.skeleton-pill,
.skeleton-btn,
.sk-circle {
    background: var(--Gradient-Skeleton, linear-gradient(270deg, rgba(219, 219, 219, 0.05) 0%, #DBDBDB 50%, rgba(219, 219, 219, 0.05) 100%));
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
}

.skeleton-block {
    border-radius: 12px;
    width: 100%;
    height: 100%
}

.skeleton-line {
    border-radius: 8px
}

.skeleton-pill {
    height: 36px;
    border-radius: 10px
}

.skeleton-btn {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    margin-top: 8px
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

.mt8 {
    margin-top: 8px
}

.mt10 {
    margin-top: 10px
}

.mt12 {
    margin-top: 12px
}

.mt20 {
    margin-top: 20px
}

.mt40 {
    margin-top: 40px
}

.w15 {
    width: 15%
}

.w18 {
    width: 18%
}

.w20 {
    width: 20%
}

.w25 {
    width: 25%
}

.w30 {
    width: 30%
}

.w40 {
    width: 40%
}

.w60 {
    width: 60%
}

.w65 {
    width: 65%
}

.w70 {
    width: 70%
}

.w80 {
    width: 80%
}

.w85 {
    width: 85%
}

.w90 {
    width: 90%
}

.h14 {
    height: 14px
}

.h16 {
    height: 16px
}

.h18 {
    height: 18px
}

.h20 {
    height: 20px
}

.h22 {
    height: 22px
}

.h24 {
    height: 24px
}

.h26 {
    height: 26px
}

@media (max-width:1024px) {
    .detail {
        padding: 0 16px 40px
    }

    .cols {
        grid-template-columns: 1fr;
        gap: 24px
    }

    .media,
    .media img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1
    }

    .desc--desktop {
        display: none
    }

    .desc--mobile {
        display: block;
        margin-top: 16px
    }

    .ship {
        margin-top: 24px
    }

    .rec__head {
        width: 100%;
        padding: 0 32px;
        margin-bottom: 12px
    }

    .grid.rec__grid {
        width: 100%;
        padding: 32px;
        justify-content: center;
        flex-wrap: wrap;
        gap: 16px
    }
}

@media (max-width:760px) {
    .rec__head {
        padding: 0 16px
    }

    .grid.rec__grid {
        width: 100%;
        padding: 16px;
        justify-content: center;
        gap: 16px
    }
}

@media (max-width:480px) {
    .rec__head {
        padding: 0 12px
    }

    .grid.rec__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        justify-content: stretch;
        gap: 12px;
        padding: 0;
        width: 100%
    }

    .card {
        width: auto;
        border-radius: 12px;
        border: 1px solid #EDEDED;
        box-shadow: none
    }

    .card__thumb {
        height: 144px
    }

    .card__body {
        padding: 12px;
        gap: 8px
    }

    .card__name {
        font-size: 12px;
        line-height: 18px
    }

    .card__tags {
        gap: 6px;
        font-size: 9.5px;
        line-height: 14px;
        font-weight: 400;
        color: #9E9E9E
    }

    .card__tags li {
        padding: 2px 5px;
        border-radius: 4px
    }

    .card__price {
        font-size: 12px;
        line-height: 18px
    }

    .soldout-badge {
        padding: 6px 10px
    }

    .soldout-text {
        font-size: 12px;
        line-height: 18px
    }
}

@media (max-width:390px) {
    .grid.rec__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px
    }
}
</style>
