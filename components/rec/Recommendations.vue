<template>
  <section class="rec">
    <div class="rec__head">
      <h2 class="rec__title">{{ title }}</h2>
      <div class="rec__nav">
        <button class="navsq" :class="{ 'navsq--disabled': currentIndex <= 0 }" :disabled="currentIndex <= 0"
          aria-label="Sebelumnya" @click="prevSlide">
          <img src="/img/icons/CaretLeft.svg" alt="" />
        </button>

        <button class="navsq" :class="{ 'navsq--disabled': currentIndex >= maxIndex }"
          :disabled="currentIndex >= maxIndex" aria-label="Berikutnya" @click="nextSlide">
          <img src="/img/icons/CaretRight.svg" alt="" />
        </button>
      </div>
    </div>

    <div class="rec__carousel rec__carousel--fixed" ref="carouselRef">
      <div class="rec__track" :style="trackStyle">
        <div v-for="(p, i) in items" :key="i" class="rec__slide">
          <CardProduct :to="p.to" :name="p.name" :image="p.image" :price="p.price" :tags="p.tags || []"
            :soldOut="p.soldOut" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps<{
  title?: string;
  items: Array<{ to: any; name: string; image: string; price: number; tags?: string[]; soldOut?: boolean }>;
}>();

const carouselRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const slideWidth = ref(0);
const visibleSlides = ref(4);

// Computed maximum index based on items length and visible slides
const maxIndex = computed(() => Math.max(0, props.items.length - visibleSlides.value));

// gap between slides (must match CSS .rec__track gap)
const GAP = 12;
// computed style for the track (use px units). Include gap in the step so slides align exactly.
const trackStyle = computed(() => ({ transform: `translateX(-${currentIndex.value * (slideWidth.value + GAP)}px)` }));

function updateSlideWidth() {
  if (!carouselRef.value) return;
  const containerWidth = carouselRef.value.offsetWidth;

  // If this carousel is using the fixed 4-slide layout, force 4 visible slides
  if (carouselRef.value?.classList?.contains('rec__carousel--fixed')) {
    visibleSlides.value = 4;
  } else {
    // Update visible slides based on container width
    if (containerWidth >= 992) {
      visibleSlides.value = 4;
    } else if (containerWidth >= 768) {
      visibleSlides.value = 3;
    } else if (containerWidth >= 480) {
      visibleSlides.value = 2;
    } else {
      visibleSlides.value = 1;
    }
  }

  // Fixed slide width of 220px (keeps card size consistent)
  slideWidth.value = 220;

  // Clamp currentIndex if needed
  if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value;
}

function nextSlide() {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++;
  }
}

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

// Reset position when items change
watch(() => props.items, () => {
  currentIndex.value = 0;
});

onMounted(async () => {
  await nextTick();
  updateSlideWidth();
  window.addEventListener('resize', updateSlideWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSlideWidth);
});

// Recompute sizes when items change (e.g. async load)
watch(
  () => props.items.length,
  async () => {
    await nextTick();
    updateSlideWidth();
    currentIndex.value = 0;
  }
);
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
  transition: all 0.12s ease;
  z-index: 40;
}

.navsq img {
  width: 14px;
  height: 14px;
  /* make icon visible on brand background */
  filter: invert(100%) brightness(200%);
}

.navsq:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.navsq--disabled {
  /* Keep brand background, but visually indicate disabled with reduced opacity */
  background: var(--brand);
  border: 1px solid var(--brand);
  opacity: 0.6;
  cursor: not-allowed;
}

.navsq--disabled img {
  filter: invert(100%) brightness(200%);
}

.rec__carousel {
  position: relative;
  overflow: hidden;
  padding: 0 20px;
  margin: 0 -20px;
}

.rec__track {
  display: flex;
  gap: 12px;
  transition: transform 0.3s ease;
  padding: 0 20px;
}

/* When carousel is fixed to show exactly 4 slides, remove extra track padding so last card isn't clipped */
.rec__carousel--fixed .rec__track {
  padding: 0;
}

.rec__slide {
  flex: 0 0 auto;
  width: 220px;
}

/* Force initial visible area to 4 slides on desktop */
.rec__carousel--fixed {
  max-width: calc(220px * 4 + 12px * 3);
  margin: 0 auto;
}

@media (max-width: 768px) {
  .rec__head {
    padding: 0 16px;
  }

  .rec__carousel {
    padding: 0 16px;
  }

  .rec__carousel--fixed {
    max-width: 100%;
    margin: 0 -16px;
  }
}

@media (max-width: 480px) {
  .rec__head {
    padding: 0 12px;
  }

  .rec__carousel {
    padding: 0 12px;
  }

  .rec__carousel--fixed {
    max-width: 100%;
    margin: 0 -12px;
  }
}
</style>
