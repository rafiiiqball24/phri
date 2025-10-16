<template>
  <section class="rec">
    <div class="rec__head">
      <h2 class="rec__title">{{ title }}</h2>
      <div class="rec__nav">
        <button class="navsq" aria-label="Sebelumnya"><img src="/img/icons/CaretLeft.svg" alt="" /></button>
        <button class="navsq" aria-label="Berikutnya"><img src="/img/icons/CaretRight.svg" alt="" /></button>
      </div>
    </div>

    <div class="rec__grid">
      <CardProduct
        v-for="(p, i) in items"
        :key="i"
        :to="p.to"
        :name="p.name"
        :image="p.image"
        :price="p.price"
        :tags="p.tags"
        :soldOut="p.soldOut" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  items: Array<{ to: any; name: string; image: string; price: number; tags?: string[]; soldOut?: boolean }>;
}>();
</script>

<style scoped></style>
