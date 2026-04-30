<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AliceFlex' })

interface Props {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  wrap?: boolean
  inline?: boolean
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'row',
  justify: 'start',
  align: 'stretch',
  gap: 'none',
  wrap: false,
  inline: false,
  expanded: false,
})

const classes = computed(() => {
  const base = props.inline ? 'inline-flex' : 'flex'
  
  const directions = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  }

  const justifies = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  const aligns = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }

  const gaps = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  return [
    base,
    directions[props.direction],
    justifies[props.justify],
    aligns[props.align],
    gaps[props.gap],
    props.wrap ? 'flex-wrap' : 'flex-nowrap',
    props.expanded ? 'w-full' : '',
  ].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
