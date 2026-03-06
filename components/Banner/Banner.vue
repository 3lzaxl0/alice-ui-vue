<script setup lang="ts">
import { computed, type Component } from 'vue'
import { bannerVariants } from './Banner.variants'
import type { VariantProps } from 'class-variance-authority'

type BannerVariantProps = VariantProps<typeof bannerVariants>

interface Props {
  variant?: BannerVariantProps['variant']
  icon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

defineOptions({
  name: 'AliceBanner',
})

const computedClass = computed(() => {
  return bannerVariants({
    variant: props.variant,
  })
})
</script>

<template>
  <div :class="computedClass">
    <div
      v-if="icon || $slots.icon"
      class="p-2.5 bg-white/50 dark:bg-black/20 rounded-full shrink-0 flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5"
    >
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
