<script setup lang="ts">
import { computed } from 'vue'
import { trackVariants, knobVariants } from './Switch.variants'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  id?: string
  name?: string
  label?: string
  variant?: 'primary' | 'status'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  variant: 'primary',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

defineOptions({
  name: 'AliceSwitch',
})

const isChecked = computed(() => props.modelValue)

function toggle() {
  if (props.disabled) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// Active/Inactive Track Color Classes
const colorClass = computed(() => {
  if (props.variant === 'status') {
    return isChecked.value
      ? 'bg-emerald-500 border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600'
      : 'bg-rose-500 border-rose-500 dark:bg-rose-600 dark:border-rose-600 group-hover:bg-rose-600 dark:group-hover:bg-rose-700'
  }
  
  // default / primary
  return isChecked.value
    ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
    : 'bg-slate-200 dark:bg-white/10 border-slate-300 dark:border-white/10 group-hover:border-slate-400 dark:group-hover:border-white/20'
})

// Translation for knob on checked state depending on size
const translateClass = computed(() => {
  if (!isChecked.value) return 'translate-x-0'
  
  const translates = {
    sm: 'translate-x-3',
    md: 'translate-x-4',
    lg: 'translate-x-6',
  }
  return translates[props.size]
})
</script>

<template>
  <div 
    class="relative inline-flex items-center gap-2.5 cursor-pointer select-none group" 
    @click.stop="toggle"
  >
    <div class="relative flex items-center">
      <input
        :id="id"
        :name="name || id"
        type="checkbox"
        class="sr-only peer"
        :checked="isChecked"
        :disabled="disabled"
        @change.stop
      />

      <!-- Track -->
      <div
        :class="[
          trackVariants({ variant, size, disabled }),
          colorClass
        ]"
      >
        <!-- Knob -->
        <div
          :class="[
            knobVariants({ size }),
            translateClass
          ]"
        ></div>
      </div>

      <!-- Focus Ring -->
      <div
        class="absolute -inset-1 rounded-full ring-4 ring-primary-500/10 opacity-0 peer-focus-visible:opacity-100 transition-opacity pointer-events-none"
      ></div>
    </div>

    <!-- Label -->
    <label
      v-if="label || $slots.default"
      :for="id"
      class="text-sm font-medium transition-colors select-none"
      :class="[
        disabled 
          ? 'text-slate-400 cursor-not-allowed' 
          : 'text-slate-700 dark:text-slate-200 cursor-pointer group-hover:text-primary-600 dark:group-hover:text-primary-400'
      ]"
      @click.prevent
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>
