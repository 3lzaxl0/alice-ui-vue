<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

defineOptions({
  name: 'AliceRadio',
})

const isChecked = computed(() => props.modelValue)

function toggle() {
  if (props.disabled) return
  const newValue = !isChecked.value
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<template>
  <div
    class="relative inline-flex items-center cursor-pointer select-none group"
    @click.stop="toggle"
  >
    <input
      :id="id"
      type="radio"
      class="sr-only"
      :checked="isChecked"
      :disabled="disabled"
      @change.stop
    />

    <div
      class="flex items-center justify-center transition-all duration-200 border rounded-full w-5 h-5 shadow-alice-sm"
      :class="[
        isChecked
          ? 'bg-white dark:bg-white/5 border-blue-600 border-[6px]'
          : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 group-hover:border-blue-500',
        disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer',
      ]"
    ></div>

    <!-- Focus Ring -->
    <div
      class="absolute -inset-1 rounded-full ring-2 ring-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
    ></div>
  </div>
</template>
