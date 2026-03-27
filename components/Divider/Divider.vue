<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AliceDivider',
})

interface Props {
  vertical?: boolean
  variant?: 'light' | 'normal' | 'dashed'
  label?: string
  labelAlign?: 'left' | 'center' | 'right'
  margin?: string
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  variant: 'normal',
  labelAlign: 'center',
})

const borderClass = computed(() => {
  const base = props.variant === 'dashed' ? 'border-dashed' : 'border-solid'
  const color =
    props.variant === 'light'
      ? 'border-gray-50 dark:border-white/5'
      : 'border-gray-100 dark:border-white/10'

  return `${base} ${color}`
})

const containerClass = computed(() => {
  if (props.vertical) {
    return `inline-flex h-full border-l ${borderClass.value} ${props.margin || 'mx-4'}`
  }
  return `flex w-full items-center ${props.margin || 'my-2'}`
})
</script>

<template>
  <div :class="containerClass" role="separator">
    <template v-if="!vertical && label">
      <div
        class="flex-1 border-t"
        :class="borderClass"
        v-if="labelAlign === 'center' || labelAlign === 'right'"
      ></div>
      <span
        class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 whitespace-nowrap"
      >
        {{ label }}
      </span>
      <div
        class="flex-1 border-t"
        :class="borderClass"
        v-if="labelAlign === 'center' || labelAlign === 'left'"
      ></div>
    </template>
    <div v-else-if="!vertical" class="w-full border-t" :class="borderClass"></div>
  </div>
</template>
