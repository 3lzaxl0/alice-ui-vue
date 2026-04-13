<script setup lang="ts">
import { computed } from 'vue'
import { Check, Minus } from 'lucide-vue-next'

interface Props {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  id?: string
  name?: string
  label?: string
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
  <div class="relative inline-flex items-center gap-2.5 cursor-pointer select-none group" @click.stop="toggle">
    <div class="relative flex items-center justify-center">
      <input
        :id="id"
        :name="name || id"
        type="checkbox"
        class="sr-only peer"
        :checked="isChecked"
        :disabled="disabled"
        @change.stop
      />

      <div
        class="flex items-center justify-center transition-all duration-200 border w-5 h-5 shadow-alice-sm rounded-alice-md"
        :class="[
          isChecked || indeterminate
            ? 'bg-primary-600 border-primary-600'
            : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 group-hover:border-primary-500',
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
        class="absolute -inset-1 rounded-lg ring-4 ring-primary-500/10 opacity-0 peer-focus-visible:opacity-100 transition-opacity pointer-events-none"
      ></div>
    </div>

    <!-- Label -->
    <label
      v-if="label || $slots.default"
      :for="id"
      class="text-sm font-medium transition-colors select-none"
      :class="[
        disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 dark:text-slate-200 cursor-pointer group-hover:text-primary-600 dark:group-hover:text-primary-400'
      ]"
      @click.prevent
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>
