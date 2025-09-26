<template>
    <div>
        <!-- HERO -->
        <section class="hero">
            <div class="hero__left">
                <h1 class="hero__title">
                    Temukan Produk Terbaik Dari<br />
                    Perhimpunan Hotel & Restoran Indonesia
                </h1>
                <p class="hero__subtitle">
                    Belanja produk terbaik, sekaligus ikut berkontribusi dalam program berbagi untuk sesama.
                </p>
                <NuxtLink to="/shop" class="hero__cta">Belanja Sekarang</NuxtLink>
            </div>
        </section>

        <!-- PRODUK -->
        <section class="section">
            <h2 class="section__title">Produk Kami</h2>

            <div class="grid">
                <NuxtLink v-for="(p, i) in products" :key="p.id" class="card-link"
                    :to="{ path: '/shop/detail-product', query: { id: p.id } }" aria-label="Lihat detail produk">
                    <article :class="['card', { 'card--soldout': p.soldOut }]">
                        <div class="card__thumb" :class="{ 'card__thumb--soldout': p.soldOut }">
                            <img :src="p.image" :alt="p.name" />
                            <!-- BADGE STOK HABIS -->
                            <span v-if="p.soldOut" class="soldout-badge">
                                <span class="soldout-text">Stok Habis</span>
                            </span>
                        </div>

                        <div class="card__body">
                            <h3 class="card__name">{{ p.name }}</h3>
                            <ul class="card__tags">
                                <li v-for="t in p.tags.slice(0, 4)" :key="t">{{ t }}</li>
                                <li v-if="p.tags.length > 4">+{{ p.tags.length - 4 }}</li>
                            </ul>
                            <p class="card__price">Rp{{ formatIDR(p.price) }}</p>
                        </div>
                    </article>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const products = ref(
    Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        name: 'PUMA Travel Backpack',
        image: '/Images/shop/product.webp',
        tags: ['Oranye', 'Hijau', 'Biru', 'Putih', '+3'],
        price: 340000,
        soldOut: i === 3,
    }))
)

const formatIDR = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 0 })
</script>
<style scoped>
:root {
    --brand: #F79F24;
    --text: #0A0A0A;
    --muted: #777;
    --card: #fff;
    --border: #EAEAEA;
}


.hero {
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
    max-width: 100vw;

    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 40px clamp(16px, 6vw, 112px);

    min-height: 700px;


    background: url('/Images/shop/header.webp') center/cover no-repeat;
    background-color: #F79F24;
    box-sizing: border-box;
}

.hero__left {
    margin-left: 40px;
}

.card-link {
    text-decoration: none;
    color: inherit;
}

.hero__title {
    width: 614px;
    color: var(--Text-color-text-white-primary, #FFF);
    font-family: var(--Font-Family-Text-Tittle, Urbanist);
    font-size: var(--Font-Size-L, 32px);
    font-weight: var(--Weight-weight-600, 600);
}

.hero__subtitle {
    margin-top: 12px;
    color: var(--Text-color-text-white-primary, #FFF);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-M, 20px);
    font-weight: 400;
    line-height: 28px;
    max-width: 614px;
}

.hero__cta {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--Bg-color-bg-button-secondary-default, #FDFAED);
    box-shadow: 0 0 2px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .14);
    color: var(--Text-color-text-button-secondary-default, #F79F24);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-M, 20px);
    font-weight: 500;
    line-height: 28px;
    text-decoration: none;
    transition: background .2s, color .2s;
}

.hero__cta:hover {
    background: #fefefe;
    color: var(--brand);
}


.section {
    padding: 32px;
}

.section__title {
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Tittle, Urbanist);
    font-size: var(--Font-Size-L, 32px);
    font-weight: var(--Weight-weight-600, 600);
    line-height: var(--Font-Line-Height-L, 40px);
    letter-spacing: -0.008px;
    margin-top: 8px;
    margin-bottom: 18px;
    margin-left: 120px;

}


.grid {
    display: flex;
    width: 1440px;
    padding: 40px 112px;
    gap: 20px;
    flex-wrap: wrap;
    margin: 0 auto;
    box-sizing: border-box;
}

.card {
    display: flex;
    width: 289px;
    flex-direction: column;
    border-radius: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .04);
}

.card__thumb {
    position: relative;
    width: 100%;
    height: 289px;
    background: #f2f2f2;
}

.card__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}


.card--soldout .card__thumb img {
    filter: grayscale(100%);
    opacity: 0.9;
}

.soldout-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background: var(--Bg-color-bg-surface-danger, #FEF6F2);
    backdrop-filter: blur(10px);
}

.soldout-text {
    color: var(--Text-color-text-danger, #FF4542);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-SM, 16px);
    font-weight: 500;
    line-height: 24px;
}

.card__body {
    display: flex;
    padding: 16px;
    flex-direction: column;
    gap: 20px;
    background: var(--card);
}

.card__name {
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0;
}

.card__tags {
    display: flex;
    gap: 8px;
    padding: 0;
    margin: 0;
    list-style: none;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: var(--Text-color-text-neutral-secondary, #757575);
}

.card__tags li {
    background: var(--Bg-color-bg-surface-neutral, #F5F5F5);
    padding: 2px 6px;
    border-radius: 6px;
}

.card--soldout .card__tags li {
    background: var(--Bg-color-bg-fill-neutral, #9E9E9E);
    color: var(--Text-color-text-white-primary, #FFF);
}

.card__price {
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    margin: 0;
}


@media (max-width: 1100px) {
    .grid {
        width: 100%;
        padding: 32px;
        justify-content: center;
    }
}

@media (max-width: 760px) {
    .grid {
        width: 100%;
        padding: 16px;
        justify-content: center;
    }

    .hero {
        padding: 28px 16px;
        min-height: 420px;
    }

    .hero__title,
    .hero__subtitle {
        width: 100%;
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .grid {
        flex-direction: column;
        align-items: center;
    }
}


@media (max-width:480px) {


    .hero {
        min-height: 414.874px !important;
        height: auto !important;
        padding: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        background-position: center !important;
    }

    .hero__left {
        margin: 0 !important;
        width: 100% !important;
        max-width: 328px !important;
    }


    .hero__title {
        align-self: stretch !important;
        color: #FFF !important;
        font-family: var(--Font-Family-Text-Body, Urbanist) !important;
        font-size: 20px !important;
        font-weight: 600 !important;
        line-height: 28px !important;
        letter-spacing: -0.003px !important;
        margin: 0 0 8px 0 !important;
    }


    .hero__subtitle {
        align-self: stretch !important;
        color: #FFF !important;
        font-family: var(--Font-Family-Text-Body, Urbanist) !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 22px !important;
        margin: 0 0 12px 0 !important;
    }


    .hero__cta {
        display: flex !important;
        justify-content: center;
        align-items: center;
        padding: 4px 12px !important;
        gap: 4px !important;
        border-radius: 8px !important;
        background: var(--Bg-color-bg-button-secondary-default, #FDFAED) !important;
        box-shadow: 0 0 2px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .14) !important;
        color: var(--Text-color-text-button-secondary-default, #F79F24) !important;
        font-family: var(--Font-Family-Text-Body, Urbanist) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        line-height: 18px !important;

        align-self: flex-start !important;

        width: 100px !important;

    }



    .section {
        padding: 16px !important;
    }

    .section__title {
        margin: 0 0 12px 0 !important;
        color: #0A0A0A !important;
        font-family: var(--Font-Family-Text-Body, Urbanist) !important;
        font-size: 20px !important;
        font-weight: 600 !important;
        line-height: 28px !important;
        letter-spacing: -0.003px !important;
    }


    .grid {
        width: 100% !important;
        padding: 0 !important;
        display: grid !important;
        grid-template-columns: repeat(2, 150px) !important;
        justify-content: space-between !important;
        gap: 16px !important;
    }

    .card {
        width: 150px !important;
        border-radius: 12px !important;
        border: 1px solid var(--Border-color-border-neutral, #EDEDED) !important;
        box-shadow: none !important;
    }

    .card__thumb {
        height: 144px !important;
    }

    .card__body {
        padding: 12px !important;
        gap: 8px !important;
    }


    .card__name {
        font-size: 12px !important;
        font-weight: 600 !important;
        line-height: 18px !important;
        color: #0A0A0A !important;
    }

    .card__tags {
        flex: 1 0 0 !important;
        gap: 6px !important;
        font-size: 10px !important;
        line-height: 14px !important;
        font-weight: 400 !important;
        color: #9E9E9E !important;
    }

    .card__tags li {
        padding: 2px 6px !important;
        border-radius: 6px !important;
    }


    .card__price {
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 18px !important;
        color: #0A0A0A !important;
    }

    .soldout-badge {
        padding: 6px 10px !important;
        border-radius: 10px !important;
    }

    .soldout-text {
        font-size: 12px !important;
        line-height: 18px !important;
    }
}


@media (max-width:390px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
    }

    .card {
        width: auto !important;
    }
}

@media (max-width:480px) {
    .hero {
        background: url('/Images/shop/headerresponsive.webp') center/cover no-repeat !important;
        background-color: #F79F24;
    }
}


@media (max-width: 480px) {
    .card__tags {
        display: flex !important;
        flex-wrap: wrap !important;

        column-gap: 6px !important;
        row-gap: 6px !important;
        overflow: visible !important;

    }

    .card__tags li {
        white-space: nowrap !important;

        padding: 2px 8px !important;
        border-radius: 999px !important;

        max-width: 100%;
    }


    .card__body {
        overflow: visible !important;
    }
}


@media (max-width:480px) {
    .card__tags {
        display: block !important;

        padding: 0 !important;
        margin: 0 !important;
        list-style: none !important;
        font-family: var(--Font-Family-Text-Body, Urbanist) !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        line-height: 18px !important;
        color: #9E9E9E !important;
    }

    .card__tags li {
        display: inline !important;
        background: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }


    .card__tags li::after {
        content: ", ";
    }

    .card__tags li:last-child::after {
        content: "";
    }
}
</style>
