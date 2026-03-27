<script setup lang="ts">
import { computed } from 'vue'
import Loading from '../Loading/Loading.vue'

defineOptions({ name: 'AliceContainer' })

const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    borderVariant?:
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'error'
      | 'info'
      | 'light'
      | 'none'
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'panel'
    loading?: boolean
    loadingText?: string
    loadingType?: 'spinner' | 'skeleton'
  }>(),
  {
    padding: 'lg',
    radius: '3xl',
    borderVariant: 'default',
    shadow: 'sm',
    loading: false,
    loadingText: 'Cargando información...',
    loadingType: 'spinner',
  },
)

const paddingClass = computed(() => {
  const map: Record<string, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-10',
  }
  return map[props.padding] || 'p-6'
})

const radiusClass = computed(() => {
  const map: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  }
  return map[props.radius] || 'rounded-2xl'
})

const borderClass = computed(() => {
  const map: Record<string, string> = {
    none: 'border-none',
    default: 'border border-gray-200 dark:border-slate-700',
    light: 'border border-gray-100 dark:border-white/10',
    primary: 'border border-blue-500/50 dark:border-blue-400/50',
    success: 'border border-emerald-500/50 dark:border-emerald-400/50',
    warning: 'border border-amber-500/50 dark:border-amber-400/50',
    error: 'border border-red-500/50 dark:border-red-400/50',
    info: 'border border-indigo-500/50 dark:border-indigo-400/50',
  }
  return map[props.borderVariant] || map.default
})

const shadowClass = computed(() => {
  const map: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    panel: 'shadow-alice-panel',
  }
  return map[props.shadow] || ''
})
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 relative w-full overflow-hidden"
    :class="[paddingClass, radiusClass, borderClass, shadowClass]"
  >
    <Loading :active="loading" :type="loadingType" :text="loadingText" />
    <slot />
  </div>
</template>
