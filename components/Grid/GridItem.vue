<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AliceGridItem' })

interface Props {
  span?: number | string
  smSpan?: number | string
  mdSpan?: number | string
  lgSpan?: number | string
  xlSpan?: number | string
  start?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  span: 1,
})

const classes = computed(() => {
  const classes = [`col-span-${props.span}`]
  
  if (props.smSpan) classes.push(`sm:col-span-${props.smSpan}`)
  if (props.mdSpan) classes.push(`md:col-span-${props.mdSpan}`)
  if (props.lgSpan) classes.push(`lg:col-span-${props.lgSpan}`)
  if (props.xlSpan) classes.push(`xl:col-span-${props.xlSpan}`)
  
  if (props.start) classes.push(`col-start-${props.start}`)
  
  return classes.join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
