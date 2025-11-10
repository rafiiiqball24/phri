<template>
    <NuxtLink :to="to" class="card-link" :aria-label="`Lihat detail ${name}`">
        <article :class="['card', { 'card--soldout': soldOut }]">
            <div class="card__thumb">
                <img :src="image" :alt="name" />
                <span v-if="soldOut" class="soldout-badge"><span class="soldout-text">Stok Habis</span></span>
            </div>

            <div class="card__body">
                <h3 class="card__name">{{ name }}</h3>

                <ul v-if="visibleTags.length" class="card__tags">
                    <li v-for="(t, i) in visibleTags" :key="i">{{ t }}</li>
                </ul>

                <div v-if="extraBelow && extraCount > 0" class="card__extra">+{{ extraCount }}</div>

                <p class="card__price">Rp{{ idr(price) }}</p>
            </div>
        </article>
    </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type To = string | { path?: string; name?: string; query?: Record<string, any> }

const props = withDefaults(defineProps<{
    to: To
    name: string
    image: string
    price: number
    tags: string[]
    soldOut?: boolean
    tagLimit?: number
    extraBelow?: boolean
}>(), {
    tagLimit: 3,
    extraBelow: false
})

const cleanTags = computed(() =>
    (props.tags || []).map(t => String(t ?? '').trim()).filter(Boolean)
)

const visibleTags = computed(() => cleanTags.value.slice(0, props.tagLimit))
const extraCount = computed(() => Math.max(0, cleanTags.value.length - props.tagLimit))

const idr = (n: number) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)
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
    transition: box-shadow .2s, transform .2s;
    height: 360px;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, .08);
}

.card-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.card__thumb {
    aspect-ratio: 1 / 1;
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #eee;
}

.card__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}


.soldout-badge {
    position: absolute;
    left: 8px;
    top: 8px;
    background: rgba(0, 0, 0, .6);
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
    gap: 6px;
    padding: 12px;
    flex: 1 1 auto;
}

.card__name {
    margin: 0;
    font: 600 14px/20px var(--ff);
    color: #111;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card__tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
    font: 500 12px/16px var(--ff);
    color: #757575;
    overflow: hidden;
}

.card__tags li {
    background: #f5f5f5;
    padding: 2px 10px;
    border-radius: 999px;
    white-space: nowrap;
}

.card__extra {
    width: fit-content;
    background: #f5f5f5;
    color: #757575;
    font: 600 11px/16px var(--ff);
    padding: 2px 8px;
    border-radius: 999px;
    margin-top: 2px;
}

.card__price {
    margin: 0;
    font: 700 14px/20px var(--ff);
    color: #111;
    margin-top: auto;
}

@media (max-width:600px) {
    .card {
        height: 320px;
        border-radius: 12px;
    }

    .card__thumb {
        height: 200px;
    }

    .card__body {
        padding: 10px;
        gap: 6px;
    }

    .card__name {
        font-size: 12px;
        line-height: 18px;
    }

    .card__tags {
        font-size: 10px;
        line-height: 14px;
        gap: 6px;
    }

    .card__tags li {
        padding: 2px 8px;
        border-radius: 6px;
    }

    .card__extra {
        font-size: 10px;
        line-height: 14px;
        padding: 2px 6px;
    }

    .card__price {
        font-size: 12px;
        line-height: 18px;
    }
}
</style>
