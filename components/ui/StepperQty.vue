<template>
    <div class="stepper" role="group" aria-label="Kuantitas">
        <button type="button" class="btn" @click="dec" :disabled="internal <= min">−</button>
        <input class="inp" :value="internal" inputmode="numeric" @input="onInput" @blur="syncEmit"
            aria-label="Jumlah" />
        <button type="button" class="btn" @click="inc">+</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    modelValue: number
    min?: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: number): void
}>()

const min = computed(() => props.min ?? 1)
const internal = computed({
    get: () => Number(props.modelValue ?? min.value),
    set: (v: number) => emit('update:modelValue', Math.max(min.value, Number(v) || min.value)),
})

function inc() { internal.value = internal.value + 1 }
function dec() { internal.value = Math.max(min.value, internal.value - 1) }

function onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value
    const n = Math.max(min.value, parseInt(v.replace(/\D/g, ''), 10) || min.value)
    internal.value = n
}
function syncEmit() { emit('update:modelValue', internal.value) }
</script>

<style scoped>
.stepper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--border, #e5e5e5);
    border-radius: 8px;
    padding: 4px
}

.btn {
    width: 32px;
    height: 32px;
    border: 0;
    background: #fafafa;
    cursor: pointer;
    border-radius: 6px
}

.btn:disabled {
    opacity: .4;
    cursor: not-allowed
}

.inp {
    width: 48px;
    height: 32px;
    border: 0;
    text-align: center;
    outline: none;
    background: transparent;
    font: 600 14px/32px var(--ff, system-ui)
}
</style>
