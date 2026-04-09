<script setup lang="ts">
import AliceText from '../Text/Text.vue'

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
  <AliceText
    tag="label"
    variant="label"
    :color="props.error ? 'error' : 'muted'"
    class="block mb-2 pl-1 transition-colors"
    :class="[props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default']"
    :for="props.for"
  >
    <slot />
  </AliceText>
</template>
