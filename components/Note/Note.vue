<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AliceNote',
})

interface Props {
  variant?: 'info' | 'warning' | 'success' | 'danger' | 'neutral'
  content?: string
  italic?: boolean
  showQuotes?: boolean
  size?: 'sm' | 'md' | 'lg'
  shadow?: boolean
  border?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'warning',
  italic: false,
  showQuotes: true,
  size: 'sm',
  shadow: false,
  border: 'sm',
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'bg-info-50 dark:bg-info-900/10 border-info-400 text-info-900 dark:text-info-200'
    case 'success':
      return 'bg-success-50 dark:bg-success-900/10 border-success-400 text-success-900 dark:text-success-200'
    case 'danger':
      return 'bg-error-50 dark:bg-error-900/10 border-error-400 text-error-900 dark:text-error-200'
    case 'neutral':
      return 'bg-slate-50 dark:bg-slate-900/10 border-slate-400 text-slate-900 dark:text-slate-200'
    case 'warning':
    default:
      return 'bg-warning-50 dark:bg-warning-900/10 border-warning-400 text-warning-900 dark:text-warning-200'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'px-5 py-4 text-base leading-relaxed'
    case 'md':
      return 'px-4 py-3 text-sm leading-relaxed'
    case 'sm':
    default:
      return 'px-3 py-2 text-sm'
  }
})

const borderClasses = computed(() => {
  switch (props.border) {
    case 'lg':
      return 'border-l-4'
    case 'md':
      return 'border-l-[3px]'
    case 'sm':
    default:
      return 'border-l-2'
  }
})
</script>

<template>
  <div
    class="rounded-r transition-colors duration-300"
    :class="[
      variantClasses, 
      sizeClasses,
      borderClasses,
      { italic: italic, 'shadow-sm': shadow }
    ]"
  >
    <slot>
      <template v-if="showQuotes">"</template>{{ content }}<template v-if="showQuotes">"</template>
    </slot>
  </div>
</template>
