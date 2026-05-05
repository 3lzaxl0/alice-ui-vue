<script setup lang="ts">
import { computed, type Component } from 'vue'
import AliceText from '../Text/Text.vue'

defineOptions({ name: 'AliceSectionHeader' })

interface Props {
  title: string
  icon?: Component
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-50 dark:bg-primary-900/20 text-primary-500'
    case 'success':
      return 'bg-success-50 dark:bg-success-900/20 text-success-500'
    case 'warning':
      return 'bg-warning-50 dark:bg-warning-900/20 text-warning-500'
    case 'error':
      return 'bg-error-50 dark:bg-error-900/20 text-error-500'
    case 'info':
      return 'bg-info-50 dark:bg-info-900/20 text-info-500'
    case 'default':
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
  }
})
</script>

<template>
  <AliceText variant="title" class="flex items-center gap-3 font-bold text-slate-800 dark:text-slate-100 mb-2">
    <div 
      v-if="icon"
      class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      :class="variantClasses"
    >
      <component :is="icon" :size="18" />
    </div>
    {{ title }}
  </AliceText>
</template>
