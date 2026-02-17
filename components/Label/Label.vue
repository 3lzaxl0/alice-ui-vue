<script setup lang="ts">
import { labelVariants } from './Label.variants'

defineOptions({
  name: 'AliceLabel',
})

interface Props {
  for?: string
  error?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: false,
  disabled: false,
})
</script>

<template>
  <label :for="props.for" :class="labelVariants({ error: props.error, disabled: props.disabled })">
    <slot />
  </label>
</template>
