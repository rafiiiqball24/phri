<template>
  <div class="cselect" :class="[{ open: isOpen, 'is-error': invalid }]">
    <button type="button" class="cselect__control" :aria-expanded="isOpen" aria-haspopup="listbox" @click.stop="toggle">
      <span>{{ modelValue?.label || placeholder }}</span>
      <img src="/img/icons/CaretDownBlack.svg" class="caret" alt="" />
    </button>
    <ul v-if="isOpen" class="cselect__menu" role="listbox">
      <li
        v-for="opt in options"
        :key="opt.value"
        class="cselect__option"
        :class="{ isSelected: modelValue?.value === opt.value }"
        role="option"
        @click.stop="choose(opt)">
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
type Opt = { value: string; label: string };
const props = withDefaults(
  defineProps<{
    modelValue: Opt | null;
    options: Opt[];
    placeholder?: string;
    invalid?: boolean;
  }>(),
  { placeholder: "Pilih salah satu", invalid: false }
);
const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const toggle = () => (isOpen.value = !isOpen.value);
const choose = (opt: Opt) => {
  emit("update:modelValue", opt);
  isOpen.value = false;
};
const onDoc = () => (isOpen.value = false);
onMounted(() => document.addEventListener("click", onDoc));
onBeforeUnmount(() => document.removeEventListener("click", onDoc));
</script>
