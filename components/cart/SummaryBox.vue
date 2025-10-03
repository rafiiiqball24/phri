<template>
    <aside class="summary">
        <div class="summary__top">
            <h3 class="summary__title">{{ title }}</h3>
            <span class="summary__count">{{ countLabel }}</span>
        </div>

        <ul class="summary__list">
            <li v-for="(l, i) in lines" :key="i" class="summary__line">
                <span class="summary__lineName">{{ l.name }}</span>
                <span class="summary__linePrice">Rp{{ formatIDR(l.price) }}</span>
            </li>
        </ul>

        <div class="summary__total">
            <span>{{ totalLabel }}</span>
            <b>Rp{{ formatIDR(total) }}</b>
        </div>

        <button v-if="cta" class="btn btn--primary btn--block" @click="$emit('cta')">{{ cta }}</button>


        <div class="summary__extra">
            <slot name="extra"></slot>
        </div>

        <div v-if="links?.length" class="summary__links">
            <NuxtLink v-for="(ln, i) in links" :key="i" :to="ln.to"
                :class="['link', ln.underline && 'link--underline']">
                {{ ln.label }}
            </NuxtLink>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { useCurrency } from '@/composables/useCurrency'
const { formatIDR } = useCurrency()

defineProps<{
    title: string
    countLabel?: string
    lines: { name: string; price: number }[]
    totalLabel: string
    total: number
    cta?: string
    links?: { label: string; to: string; underline?: boolean }[]
}>()
</script>

<style scoped>
.summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: #fff;
    padding: 12px;
    width: min(392px, 100%);
    box-sizing: border-box;
}

.summary__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.summary__title,
.summary__count {
    margin: 0;
    font: 600 16px/24px var(--ff);
    color: var(--text);
}

.summary__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.summary__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.summary__lineName {
    color: #757575;
    font: 400 14px/22px var(--ff);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 8px;
}

.summary__linePrice {
    color: var(--text);
    font: 600 14px/22px var(--ff);
}

.summary__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-top: 1px dashed #eaeaea;
    border-bottom: 1px dashed #eaeaea;
}

.summary__total span,
.summary__total b {
    font: 600 16px/24px var(--ff);
    color: var(--text);
}


.summary__extra {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}


.summary__links {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.link {
    color: #757575;
    text-decoration: none;
    font: 400 12px/18px var(--ff);
}

.link--underline {
    text-decoration: underline;
    color: var(--text);
}
</style>
