<script setup lang="ts">
import type { Component } from 'vue'

defineOptions({
  name: 'AliceEmpty',
})

interface Props {
  icon?: Component
  title?: string
  description: string
  showBorder?: boolean
  compact?: boolean
  fullHeight?: boolean
}

withDefaults(defineProps<Props>(), {
  showBorder: true,
  compact: false,
  fullHeight: false,
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center text-center transition-all duration-300"
    :class="[
      compact ? 'py-6 px-4' : 'py-12 px-6',
      fullHeight ? 'flex-1 h-full' : '',
      showBorder
        ? 'border border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/30 dark:bg-white/5'
        : '',
    ]"
  >
    <!-- Icon Slot / Prop -->
    <div
      v-if="icon || $slots.icon"
      class="mb-4 text-gray-300 dark:text-gray-600 transition-colors group-hover:text-gray-400 dark:group-hover:text-gray-500"
    >
      <slot name="icon">
        <component :is="icon" :size="compact ? 32 : 48" stroke-width="1.5" />
      </slot>
    </div>

    <!-- Title -->
    <h3
      v-if="title"
      class="text-base font-semibold text-gray-900 dark:text-white mb-1 tracking-tight"
    >
      {{ title }}
    </h3>

    <!-- Description -->
    <p
      class="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed"
      :class="{ italic: !title }"
    >
      {{ description }}
    </p>

    <!-- Custom Content Slot -->
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
