<template>
    <div class="stepper" role="group" aria-label="Kuantitas">
        <button type="button" class="btn" @click="dec" :disabled="internal <= min">-</button>
        <input class="inp" :value="internal" :readonly="!editable" :aria-readonly="String(!editable)"
            :tabindex="editable ? 0 : -1" inputmode="numeric" @keydown="onKeydown" @input="onInput" @blur="syncEmit"
            aria-label="Jumlah" />
        <button type="button" class="btn" @click="inc" :disabled="internal >= max">+</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    modelValue: number
    min?: number
    max?: number
    editable?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: number): void
}>()

const min = computed(() => (props.min ?? 0))
const max = computed(() => {
    const m = Number(props.max)
    return Number.isFinite(m) && m > 0 ? m : Infinity
})
const editable = computed(() => props.editable !== false)
const internal = computed({
    get: () => Number(props.modelValue ?? min.value),
    set: (v: number) => {
        const n = Number.isFinite(Number(v)) ? Number(v) : min.value
        const clamped = Math.max(min.value, Math.min(max.value, n))
        emit('update:modelValue', clamped)
    },
})

function inc() { internal.value = Math.min(max.value, internal.value + 1) }
function dec() { internal.value = Math.max(min.value, internal.value - 1) }

function onInput(e: Event) {
    if (!editable.value) return
    const v = (e.target as HTMLInputElement).value
    const parsed = parseInt(v.replace(/\D/g, ''), 10)
    const n = Number.isFinite(parsed) ? parsed : min.value
    internal.value = Math.max(min.value, Math.min(max.value, n))
}
function syncEmit() { emit('update:modelValue', internal.value) }

function onKeydown(e: KeyboardEvent) {
    if (!editable.value) {
        e.preventDefault()
        e.stopPropagation()
    }
}
</script>

<style scoped>
.stepper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px
}

.btn {
    width: 32px;
    height: 32px;
    border: 0;
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
