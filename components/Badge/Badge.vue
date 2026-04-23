<script setup lang="ts">
import { computed, type Component } from 'vue'
import { badgeVariants } from './Badge.variants'
import type { VariantProps } from 'class-variance-authority'

type BadgeVariantProps = VariantProps<typeof badgeVariants>

interface Props {
  label: string
  variant?: BadgeVariantProps['variant']
  type?: BadgeVariantProps['type']
  icon?: Component
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  type: 'soft',
})

defineOptions({
  name: 'AliceBadge',
})

const computedClass = computed(() => {
  return badgeVariants({
    variant: props.color ? 'default' : props.variant,
    type: props.type,
  })
})

const computedStyles = computed(() => {
  if (!props.color) return {}
  
  if (props.type === 'filled') {
    return {
      backgroundColor: props.color,
      borderColor: props.color,
      color: 'white'
    }
  }

  if (props.type === 'soft') {
    return {
      backgroundColor: `${props.color}15`,
      borderColor: `${props.color}30`,
      color: props.color
    }
  }

  return {
    color: props.color,
    borderColor: 'transparent'
  }
})
</script>

<template>
  <span :class="computedClass" :style="computedStyles">
    <component v-if="icon" :is="icon" :size="12" stroke-width="2" />
    {{ label }}
  </span>
</template>
