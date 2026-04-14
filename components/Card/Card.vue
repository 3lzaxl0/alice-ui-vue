<script setup lang="ts">
import { computed } from 'vue'
import AliceLoading from '../Loading/Loading.vue'
import AliceText from '../Text/Text.vue'

defineOptions({ name: 'AliceCard' })

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    alignTitle?: 'left' | 'center' | 'right'
    headerVerticalAlign?: 'start' | 'center'
    loading?: boolean
    loadingText?: string
    active?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    radius: 'lg',
    shadow: 'sm',
    alignTitle: 'left',
    headerVerticalAlign: undefined,
    loading: false,
    loadingText: 'Sincronizando...',
    active: false,
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

const activeClass = computed(() => {
  if (!props.active) return ''
  return 'border-primary-500! dark:border-primary-400! bg-primary-50/90 dark:bg-primary-500/10'
})
</script>

<template>
  <div
    class="relative border border-gray-100 dark:border-white/10 flex flex-col transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden"
    :class="[radiusClass, shadowClass, activeClass]"
  >
    <AliceLoading :active="loading" :text="loadingText" />

    <!-- Header -->
    <div
      v-if="title || $slots.header || $slots.action"
      class="flex justify-between p-4 border-b border-gray-100 dark:border-white/5"
      :class="headerVerticalAlignClass"
    >
      <div class="flex-1 w-full" :class="titleAlignClass">
        <slot name="header">
          <AliceText v-if="title" variant="title">
            {{ title }}
          </AliceText>
          <AliceText v-if="subtitle" tag="p" variant="caption" class="mt-1">
            {{ subtitle }}
          </AliceText>
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
