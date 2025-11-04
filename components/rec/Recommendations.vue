<template>
  <section class="rec">
    <div class="rec__head">
      <h2 class="rec__title">{{ title }}</h2>
      <div class="rec__nav" v-if="!isMobile">
        <button class="navsq" :class="{ 'navsq--disabled': currentIndex <= 0 }" :disabled="currentIndex <= 0"
          @click="prevSlide">
          <img src="/img/icons/CaretLeft.svg" alt="" />
        </button>
        <button class="navsq" :class="{ 'navsq--disabled': currentIndex >= maxIndex }"
          :disabled="currentIndex >= maxIndex" @click="nextSlide">
          <img src="/img/icons/CaretRight.svg" alt="" />
        </button>
      </div>
    </div>

    <!-- desktop -->
    <div v-if="!isMobile" class="rec__carousel rec__carousel--fixed" ref="carouselRef">
      <div class="rec__track" :style="trackStyle">
        <div v-for="(p, i) in items" :key="i" class="rec__slide">
          <CardProduct :to="p.to" :name="p.name" :image="p.image" :price="p.price" :tags="p.tags || []"
            :soldOut="p.soldOut" />
        </div>
      </div>
    </div>

    <!-- mobile -->
    <div v-else class="rec__grid">
      <div v-for="(p, i) in items" :key="i" class="rec__grid-item">
        <CardProduct :to="p.to" :name="p.name" :image="p.image" :price="p.price" :tags="p.tags || []"
          :soldOut="p.soldOut" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
const props = defineProps<{ title?: string; items: Array<{ to: any; name: string; image: string; price: number; tags?: string[]; soldOut?: boolean }> }>()

const carouselRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const slideWidth = ref(0)
const visibleSlides = ref(4)
const isMobile = ref(false)
const GAP = 12

const checkMobile = () => { isMobile.value = window.matchMedia('(max-width:768px)').matches }
const maxIndex = computed(() => Math.max(0, props.items.length - visibleSlides.value))
const trackStyle = computed(() => isMobile.value ? {} : { transform: `translateX(-${currentIndex.value * (slideWidth.value + GAP)}px)` })

function updateDesktop() { if (!carouselRef.value) return; visibleSlides.value = 4; slideWidth.value = 220; if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value }
function updateLayout() { checkMobile(); if (!isMobile.value) updateDesktop(); else currentIndex.value = 0 }
function nextSlide() { if (!isMobile.value && currentIndex.value < maxIndex.value) currentIndex.value++ }
function prevSlide() { if (!isMobile.value && currentIndex.value > 0) currentIndex.value-- }

watch(() => props.items, () => currentIndex.value = 0)
onMounted(async () => { await nextTick(); updateLayout(); window.addEventListener('resize', updateLayout) })
onUnmounted(() => window.removeEventListener('resize', updateLayout))
watch(() => props.items.length, async () => { await nextTick(); updateLayout(); currentIndex.value = 0 })
</script>

<style scoped>
.rec {
  position: relative;
  margin: 40px 0;
}

.rec__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 20px;
}

.rec__title {
  font: 600 18px/24px var(--ff);
  color: var(--text);
  margin: 0;
}

.rec__nav {
  display: flex;
  gap: 6px;
}

.navsq {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--brand);
  background: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: .12s;
}

.navsq img {
  width: 14px;
  height: 14px;
  filter: invert(100%) brightness(200%);
}

.navsq:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, .08);
}

.navsq--disabled {
  opacity: .6;
  cursor: not-allowed;
}

.rec__carousel {
  overflow: hidden;
  padding: 0 20px;
  margin: 0 -20px;
}

.rec__track {
  display: flex;
  gap: 12px;
  transition: transform .3s ease;
  padding: 0 20px;
}

.rec__slide {
  flex: 0 0 auto;
  width: 220px;
}

.rec__carousel--fixed {
  padding: 0;
  margin: 0 auto;
  max-width: calc(220px*4 + 12px*3);
}

.rec__carousel--fixed .rec__track {
  padding: 0;
}

/* === MOBILE GRID FIX === */
.rec__grid {
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.rec__grid-item {
  min-width: 0;
}

@media (max-width:360px) {
  .rec__grid {
    padding: 0 12px;
    grid-template-columns: 1fr;
  }
}

/* Paksa override 2 kolom aktif */
@media (max-width:768px) {
  .rec__nav {
    display: none !important;
  }

  .rec__carousel {
    overflow: visible !important;
    padding: 0 16px !important;
    margin: 0 !important;
  }

  .rec__track {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 12px !important;
    transform: none !important;
    padding: 0 !important;
  }

  .rec__slide {
    width: auto !important;
    min-width: 0 !important;
  }

  .rec__slide :deep(.card),
  .rec__slide :deep(> *) {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
  }
}
</style>
