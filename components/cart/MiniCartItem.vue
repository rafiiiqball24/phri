<template>
    <article class="mini">
        <figure class="mini__thumb">
            <img :src="image" :alt="name" />
        </figure>

        <div class="mini__info">
            <p class="mini__name">{{ name }}</p>
            <p class="mini__meta">
                <span class="meta-label">Warna:</span> <span class="meta-value">{{ color }}</span> •
                <span class="meta-label">Ukuran:</span> <span class="meta-value">{{ size }}</span> •
                <span class="meta-label">Qty:</span> <span class="meta-value">{{ qty }}</span>
            </p>
            <p class="mini__price">Rp{{ formatIDR(price) }}</p>
        </div>
    </article>
</template>

<script setup lang="ts">
import { useCurrency } from '@/composables/useCurrency'
const { formatIDR } = useCurrency()
defineProps<{ image: string; name: string; color: string; size: string; qty: number; price: number }>()
</script>
