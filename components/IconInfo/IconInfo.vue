<script setup lang="ts">
import type { Component } from 'vue'

defineOptions({ name: 'AliceIconInfo' })

interface Props {
  icon: Component
  label: string
  value: string
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
  layout?: 'horizontal' | 'vertical'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  layout: 'vertical',
})

const variantClasses = {
  default: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-500',
    value: 'text-gray-700 dark:text-gray-200',
  },
  info: {
    bg: 'bg-info-50 dark:bg-info-900/20',
    text: 'text-info-500',
    value: 'text-info-600 dark:text-info-400',
  },
  success: {
    bg: 'bg-success-50 dark:bg-success-900/20',
    text: 'text-success-500',
    value: 'text-success-600 dark:text-success-400',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    text: 'text-warning-500',
    value: 'text-warning-600 dark:text-warning-400',
  },
  error: {
    bg: 'bg-error-50 dark:bg-error-900/20',
    text: 'text-error-500',
    value: 'text-error-600 dark:text-error-400',
  },
}
</script>

<template>
  <div class="flex items-center gap-3 px-1">
    <div
      class="p-1.5 rounded-full shrink-0"
      :class="[variantClasses[variant].bg, variantClasses[variant].text]"
    >
      <component :is="icon" :size="14" />
    </div>
    <div
      class="flex"
      :class="layout === 'horizontal' ? 'flex-row items-center gap-2' : 'flex-col'"
    >
      <span
        class="text-[10px] text-gray-400 font-bold uppercase leading-none"
        :class="layout === 'vertical' ? 'mb-0.5' : ''"
      >
        {{ label }}
      </span>
      <span class="text-sm font-medium" :class="variantClasses[variant].value">
        {{ value }}
      </span>
    </div>
  </div>
</template>
