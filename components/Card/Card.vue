<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AliceCard' })

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    alignTitle?: 'left' | 'center' | 'right'
    headerVerticalAlign?: 'start' | 'center'
  }>(),
  {
    title: '',
    subtitle: '',
    radius: 'lg',
    shadow: 'sm',
    alignTitle: 'left',
    headerVerticalAlign: undefined,
  },
)

const radiusClass = computed(() => {
  const map: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-[2.5rem]', // Para Login original
  }
  return map[props.radius] || 'rounded-lg'
})

const shadowClass = computed(() => {
  const map: Record<string, string> = {
    none: 'shadow-none hover:shadow-none',
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
    '2xl': 'shadow-2xl',
  }
  return map[props.shadow] || 'shadow-sm hover:shadow-md'
})

const titleAlignClass = computed(() => {
  const map: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return map[props.alignTitle] || 'text-left'
})

const headerVerticalAlignClass = computed(() => {
  if (props.headerVerticalAlign) {
    return props.headerVerticalAlign === 'start' ? 'items-start' : 'items-center'
  }
  return props.subtitle ? 'items-start' : 'items-center'
})
</script>

<template>
  <div
    class="border border-gray-100 dark:border-white/10 flex flex-col transition-shadow bg-white dark:bg-slate-900 overflow-hidden"
    :class="[radiusClass, shadowClass]"
  >
    <!-- Header -->
    <div
      v-if="title || $slots.header || $slots.action"
      class="flex justify-between p-4 border-b border-gray-100 dark:border-white/5"
      :class="headerVerticalAlignClass"
    >
      <div class="flex-1 w-full" :class="titleAlignClass">
        <slot name="header">
          <span v-if="title" class="text-base font-bold text-gray-800 dark:text-gray-200">
            {{ title }}
          </span>
          <p v-if="subtitle" class="text-xs text-gray-500 mt-1">
            {{ subtitle }}
          </p>
        </slot>
      </div>
      <slot name="action" />
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col gap-3">
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer"
      class="flex justify-end gap-3 p-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-slate-900/30"
      :class="radiusClass.replace('rounded-', 'rounded-b-')"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
