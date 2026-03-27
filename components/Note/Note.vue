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
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'warning',
  italic: false,
  showQuotes: true,
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'bg-blue-50 dark:bg-blue-900/10 border-blue-400 text-blue-900 dark:text-blue-200'
    case 'success':
      return 'bg-green-50 dark:bg-green-900/10 border-green-400 text-green-900 dark:text-green-200'
    case 'danger':
      return 'bg-red-50 dark:bg-red-900/10 border-red-400 text-red-900 dark:text-red-200'
    case 'neutral':
      return 'bg-slate-50 dark:bg-slate-900/10 border-slate-400 text-slate-900 dark:text-slate-200'
    case 'warning':
    default:
      return 'bg-amber-50 dark:bg-amber-900/10 border-amber-400 text-amber-900 dark:text-amber-200'
  }
})
</script>

<template>
  <div
    class="px-3 py-2 border-l-2 rounded-r text-sm transition-colors duration-300"
    :class="[variantClasses, { italic: italic }]"
  >
    <slot>
      <template v-if="showQuotes">"</template>{{ content }}<template v-if="showQuotes">"</template>
    </slot>
  </div>
</template>
