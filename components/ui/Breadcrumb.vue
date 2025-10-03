<template>
    <nav class="bcbar" aria-label="Breadcrumb">
        <template v-for="(it, i) in items" :key="i">
            <NuxtLink v-if="it.to && i < items.length - 1" :to="it.to" class="bc">
                {{ it.label }}
            </NuxtLink>
            <span v-else class="bc bc--current">{{ it.label }}</span>

            <!-- chevron -->
            <svg v-if="i < items.length - 1" class="bc__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </template>
    </nav>
</template>

<script setup lang="ts">
type Crumb = { label: string; to?: string | Record<string, any> }
defineProps<{ items: Crumb[] }>()
</script>

<style scoped>
.bcbar {
    display: flex;
    align-items: center;
    gap: 6px;
}

.bc {
    font: 600 14px/22px var(--ff, Urbanist, system-ui);
    color: #757575;
    text-decoration: none;
}

.bc:hover {
    text-decoration: underline;
}

.bc--current {
    color: #0A0A0A;
    text-decoration: none;
}

.bc__icon {
    width: 14px;
    height: 14px;
    color: #9E9E9E;
    flex: 0 0 14px;
}
</style>
