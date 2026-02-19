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
    variant: props.variant,
    type: props.type,
  })
})
</script>

<template>
  <span :class="computedClass">
    <component v-if="icon" :is="icon" :size="12" stroke-width="2" />
    {{ label }}
  </span>
</template>
