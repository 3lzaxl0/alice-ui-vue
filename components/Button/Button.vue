<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { buttonVariants } from './Button.variants'
import type { VariantProps } from 'class-variance-authority'

defineOptions({
  name: 'AliceButton',
})

type ButtonVariantProps = VariantProps<typeof buttonVariants>

interface Props {
  variant?: ButtonVariantProps['variant']
  design?: ButtonVariantProps['design']
  size?: ButtonVariantProps['size']
  rounded?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: object // Component
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  design: 'solid',
  size: 'md',
  rounded: false,
  loading: false,
  disabled: false,
  type: 'button',
})

const computedClass = computed(() => {
  return buttonVariants({
    variant: props.variant,
    design: props.design,
    size: props.size,
    rounded: props.rounded,
  })
})
</script>

<template>
  <button :type="type" :class="computedClass" :disabled="disabled || loading">
    <!-- Loading Spinner -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <Loader2 class="animate-spin" :size="20" />
    </div>

    <!-- Content -->
    <div :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <component :is="icon" v-if="icon" :size="20" />
      <slot />
    </div>
  </button>
</template>
