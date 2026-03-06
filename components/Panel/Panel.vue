<script setup lang="ts">
import { type Component } from 'vue'

defineOptions({
  name: 'AlicePanel',
})

interface Props {
  title: string
  description?: string
  icon?: Component
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray'
  bodyPadding?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  bodyPadding: 'p-0',
})

const variantClasses = {
  primary: {
    header: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-800/30',
    title: 'text-blue-700 dark:text-blue-300',
    description: 'text-blue-600/70 dark:text-blue-400/70',
  },
  success: {
    header:
      'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100/50 dark:border-emerald-800/30',
    title: 'text-emerald-700 dark:text-emerald-300',
    description: 'text-emerald-600/70 dark:text-emerald-400/70',
  },
  warning: {
    header: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100/50 dark:border-amber-800/30',
    title: 'text-amber-700 dark:text-amber-300',
    description: 'text-amber-600/70 dark:text-amber-400/70',
  },
  error: {
    header: 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100/50 dark:border-rose-800/30',
    title: 'text-rose-700 dark:text-rose-300',
    description: 'text-rose-600/70 dark:text-rose-400/70',
  },
  info: {
    header: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-800/30',
    title: 'text-blue-700 dark:text-blue-300',
    description: 'text-blue-600/70 dark:text-blue-400/70',
  },
  gray: {
    header: 'bg-gray-50/50 dark:bg-gray-800/10 border-gray-200/50 dark:border-gray-700/30',
    title: 'text-gray-700 dark:text-gray-300',
    description: 'text-gray-500/70 dark:text-gray-400/70',
  },
}
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/10 h-full overflow-hidden rounded-alice-md shadow-alice-sm transition-all duration-300"
  >
    <!-- Header -->
    <div
      class="px-5 py-3.5 border-b shrink-0 select-none transition-colors duration-300"
      :class="variantClasses[props.variant].header"
    >
      <h3 class="font-bold flex items-center gap-2.5" :class="variantClasses[props.variant].title">
        <component :is="icon" v-if="icon" :size="18" stroke-width="2.5" />
        {{ title }}
      </h3>
      <p v-if="description" class="text-xs mt-1" :class="variantClasses[props.variant].description">
        {{ description }}
      </p>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-hidden" :class="bodyPadding">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Standard Alice transition if used with v-if elsewhere */
.alice-panel-enter-active,
.alice-panel-leave-active {
  transition: all 0.3s ease;
}
.alice-panel-enter-from,
.alice-panel-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
