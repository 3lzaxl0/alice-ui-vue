<script setup lang="ts">
import { type Component } from 'vue'
import { containerVariants, buttonVariants } from './SegmentedControl.variants'

interface Option {
  label: string
  value: string | number
  icon?: Component
}

defineOptions({
  name: 'AliceSegmentedControl'
})

const props = withDefaults(defineProps<{
  modelValue: string | number
  options: Option[]
  disabled?: boolean
  expanded?: boolean
  gap?: 'sm' | 'md' | 'lg'
}>(), {
  disabled: false,
  expanded: false,
  gap: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const select = (value: string | number) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div :class="containerVariants({ gap, expanded, disabled })">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      @click="select(option.value)"
      :class="buttonVariants({ active: modelValue === option.value, disabled })"
      :disabled="disabled"
    >
      <component 
        :is="option.icon" 
        v-if="option.icon" 
      />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>
