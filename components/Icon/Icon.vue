<script setup lang="ts">
import { computed, type Component } from 'vue'
import { iconVariants } from './Icon.variants'
import type { VariantProps } from 'class-variance-authority'

defineOptions({ name: 'AliceIcon' })

type IconVariantProps = VariantProps<typeof iconVariants>

interface Props {
  icon: Component
  variant?: IconVariantProps['variant']
  size?: IconVariantProps['size']
  radius?: IconVariantProps['radius']
  iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  radius: undefined, // Uses size-based default if undefined
})

const computedClass = computed(() => {
  return iconVariants({
    variant: props.variant,
    size: props.size,
    radius: props.radius,
  })
})

const computedIconSize = computed(() => {
  if (props.iconSize) return props.iconSize
  const map: Record<string, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  }
  return map[props.size as string] || 20
})
</script>

<template>
  <div :class="computedClass">
    <component :is="icon" :size="computedIconSize" stroke-width="2" />
  </div>
</template>
