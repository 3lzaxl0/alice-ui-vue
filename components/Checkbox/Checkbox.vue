<script setup lang="ts">
import { computed } from 'vue'
import { Check, Minus } from 'lucide-vue-next'

interface Props {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

defineOptions({
  name: 'AliceCheckbox',
})

const isChecked = computed(() => props.modelValue)

function toggle() {
  if (props.disabled) return
  const newValue = !props.modelValue
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
      type="checkbox"
      class="sr-only"
      :checked="isChecked"
      :disabled="disabled"
      @change.stop
    />

    <div
      class="flex items-center justify-center transition-all duration-200 border w-5 h-5 shadow-alice-sm rounded-alice-md"
      :class="[
        isChecked || indeterminate
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 group-hover:border-blue-500',
        disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer',
      ]"
    >
      <transition name="alice-scale">
        <Minus v-if="indeterminate" :size="14" class="text-white" stroke-width="4" />
        <Check v-else-if="isChecked" :size="14" class="text-white" stroke-width="4" />
      </transition>
    </div>

    <!-- Focus Ring -->
    <div
      class="absolute -inset-1 rounded-lg ring-2 ring-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
    ></div>
  </div>
</template>
