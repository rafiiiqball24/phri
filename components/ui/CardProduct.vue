<template>
    <NuxtLink :to="to" class="card-link" :aria-label="`Lihat detail ${name}`">
        <article :class="['card', { 'card--soldout': soldOut }]">
            <div class="card__thumb">
                <img :src="image" :alt="name" />
                <span v-if="soldOut" class="soldout-badge">
                    <span class="soldout-text">Stok Habis</span>
                </span>
            </div>

            <div class="card__body">
                <h3 class="card__name">{{ name }}</h3>
                <ul class="card__tags">
                    <li v-for="(t, i) in tags.slice(0, 4)" :key="i">{{ t }}</li>
                    <li v-if="tags.length > 4">+{{ tags.length - 4 }}</li>
                </ul>
                <p class="card__price">Rp{{ idr(price) }}</p>
            </div>
        </article>
    </NuxtLink>
</template>

<script setup lang="ts">
type To = string | { path?: string; name?: string; query?: Record<string, any> }

defineProps<{
    to: To
    name: string
    image: string
    price: number
    tags: string[]
    soldOut?: boolean
}>()

const idr = (n: number) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)
</script>

<style scoped>
.card {
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ececec;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.card__thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #fff;
    overflow: hidden;
}

.card__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (max-width: 900px) {
    .card__thumb img {
        object-fit: contain;
        padding: 8px;
        background: #fff;
    }
}

.soldout-badge {
    position: absolute;
    left: 8px;
    top: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 999px;
    padding: 6px 10px;
}

.soldout-text {
    font: 700 12px/18px var(--ff);
}

.card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
}

.card__name {
    margin: 0;
    font: 600 14px/20px var(--ff);
    color: #111;
}

.card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
    font: 500 12px/16px var(--ff);
    color: #757575;
}

.card__tags li {
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 999px;
    white-space: nowrap;
}

.card__price {
    margin: 0;
    font: 700 14px/20px var(--ff);
    color: #111;
}

@media (max-width: 600px) {
    .card {
        border-radius: 12px;
    }

    .card__body {
        padding: 10px;
        gap: 6px;
    }

    .card__name {
        font-size: 12px;
        line-height: 18px;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card__tags {
        font-size: 10px;
        line-height: 14px;
        gap: 6px;
    }

    .card__tags li {
        padding: 2px 6px;
        border-radius: 6px;
    }

    .card__price {
        font-size: 12px;
        line-height: 18px;
    }
}
</style>
