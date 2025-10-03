<template>
    <div class="notice">
        <div class="notice__left">
            <img :src="icon" alt="Info" style="width:18px;height:18px; position:relative; top:4px;" />
            <p>
                <slot />
            </p>
        </div>
        <img v-if="image" class="notice__img" :src="image" alt="illustration" />
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; image?: string }>(), {
    icon: '/Icons/Info.svg',
    image: '/Icons/BoxBlue.svg'
})
</script>
