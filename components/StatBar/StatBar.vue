<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AliceStatBar' })

interface Props {
  /** Responsive direction. 'auto' means col on mobile, row on sm+. */
  direction?: 'row' | 'col' | 'auto'
  /** Show dividers between items */
  divided?: boolean
  /** Items alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'auto',
  divided: true,
  align: 'stretch',
})

const containerClasses = computed(() => {
  const classes = ['flex w-full']
  
  // Direction handling
  if (props.direction === 'row') classes.push('flex-row')
  else if (props.direction === 'col') classes.push('flex-col')
  else classes.push('flex-col sm:flex-row')

  // Alignment
  if (props.align === 'start') classes.push('items-start')
  else if (props.align === 'center') classes.push('items-center')
  else if (props.align === 'end') classes.push('items-end')
  else classes.push('items-stretch')

  // Dividers
  if (props.divided) {
    if (props.direction === 'row') {
      classes.push('divide-x divide-gray-100 dark:divide-white/5')
    } else if (props.direction === 'col') {
      classes.push('divide-y divide-gray-100 dark:divide-white/5')
    } else {
      // Auto: col on mobile (divide-y), row on sm+ (divide-x)
      classes.push('divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/5')
    }
  }

  return classes.join(' ')
})
</script>

<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>
