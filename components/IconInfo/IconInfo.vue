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
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-500',
    value: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-500',
    value: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-500',
    value: 'text-amber-600 dark:text-amber-400',
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-500',
    value: 'text-rose-600 dark:text-rose-400',
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
