<script setup lang="ts">
import { computed } from 'vue'
import { textVariants } from './Text.variants'
import type { VariantProps } from 'class-variance-authority'

defineOptions({ name: 'AliceText' })

type TextVariantProps = VariantProps<typeof textVariants>

interface Props {
  variant?: TextVariantProps['variant']
  color?: TextVariantProps['color']
  weight?: TextVariantProps['weight']
  align?: TextVariantProps['align']
  truncate?: boolean
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'div'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body',
  truncate: false,
})

const defaultTags: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  title: 'h4',
  subtitle: 'p',
  label: 'label',
  body: 'p',
  description: 'p',
  caption: 'span',
  error: 'p',
}

const defaultColors: Record<string, TextVariantProps['color']> = {
  h1: 'default',
  h2: 'default',
  h3: 'default',
  title: 'default',
  subtitle: 'muted',
  label: 'muted',
  body: 'default',
  description: 'muted',
  caption: 'muted',
  error: 'error',
}

const computedTag = computed(() => {
  if (props.tag) return props.tag
  return defaultTags[props.variant || 'body'] || 'span'
})

const computedColor = computed(() => {
  if (props.color) return props.color
  return defaultColors[props.variant || 'body'] || 'default'
})

const computedClass = computed(() => {
  return textVariants({
    variant: props.variant,
    color: computedColor.value,
    weight: props.weight,
    align: props.align,
    truncate: props.truncate,
  })
})
</script>

<template>
  <component :is="computedTag" :class="computedClass">
    <slot />
  </component>
</template>
