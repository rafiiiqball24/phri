<template>
  <div class="notice">
    <div class="notice__left">
      <img :src="icon" alt="Info" class="notice__icon" />
      <p>
        <slot />
      </p>
    </div>

    <!-- ilustrasi kanan -->
    <img v-if="image" class="notice__img" :src="image" alt="illustration" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; image?: string }>(), {
  icon: "/img/icons/Info.svg",
  image: "/img/icons/BoxBlue.svg",
});
</script>

<style scoped>
.notice {
  position: relative;
  border-radius: 12px;
  background: #f6fbff;
  border: 1px solid #e8f2fb;
  padding: 14px 20px;
  padding-right: 84px;
  overflow: hidden;
}


.notice__left {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.notice__icon {
  width: 24px;
  height: 18px;
  position: relative;
  top: 4px;
}

.notice__left p {
  margin: 0;
  color: #1287b8;
  font: 500 15px/22px var(--ff, system-ui, sans-serif);
}


.notice__img {
  position: absolute;
  top: 70%;
  right: -2px;
  width: 70px;
  height: 70px;
  transform: translateY(-50%);
  object-fit: contain;
  pointer-events: none;
  z-index: 0;
}


@media (max-width: 768px) {
  .notice {
    padding-right: 20px;

  }

  .notice__img {
    display: block;
    width: 56px;
    height: 56px;
    right: -4px;
    top: 80%;

  }
}
</style>
