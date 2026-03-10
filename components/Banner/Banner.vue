<script setup lang="ts">
import { computed, type Component } from 'vue'
import { bannerVariants, bannerIconVariants } from './Banner.variants'
import type { VariantProps } from 'class-variance-authority'

type BannerVariantProps = VariantProps<typeof bannerVariants>

interface Props {
  variant?: BannerVariantProps['variant']
  type?: BannerVariantProps['type']
  icon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'soft',
})

defineOptions({
  name: 'AliceBanner',
})

const computedClass = computed(() => {
  return bannerVariants({
    variant: props.variant,
    type: props.type,
  })
})

const computedIconClass = computed(() => {
  return bannerIconVariants({
    variant: props.variant,
    type: props.type,
  })
})
</script>

<template>
  <div :class="computedClass">
    <div v-if="icon || $slots.icon" :class="computedIconClass">
      <slot name="icon">
        <component :is="icon" :size="24" stroke-width="2.5" />
      </slot>
    </div>
    <div class="flex-1 min-w-0">
      <slot />
    </div>
    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>
