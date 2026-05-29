<script setup lang="ts">
import { computed, type Component } from 'vue'
import { iconContainerVariants, iconValueVariants } from './IconInfo.variants'

defineOptions({ name: 'AliceIconInfo' })

interface Props {
  icon?: Component
  label?: string
  value?: string
  variant?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  layout?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  value: '',
  variant: 'default',
  layout: 'vertical',
})

const computedContainerClass = computed(() => {
  return iconContainerVariants({ variant: props.variant })
})

const computedValueClass = computed(() => {
  return iconValueVariants({ variant: props.variant })
})
</script>

<template>
  <div class="flex items-center gap-3 px-1">
    <div
      v-if="icon"
      :class="computedContainerClass"
    >
      <component :is="icon" :size="14" />
    </div>
    <div
      class="flex"
      :class="layout === 'horizontal' ? 'flex-row items-center gap-2' : 'flex-col'"
    >
      <span
        v-if="label"
        class="text-[10px] text-gray-400 font-bold uppercase leading-none"
        :class="layout === 'vertical' ? 'mb-0.5' : ''"
      >
        {{ label }}
      </span>
      <span v-if="value" :class="computedValueClass">
        {{ value }}
      </span>
    </div>
  </div>
</template>
