<script setup lang="ts">
import { computed } from 'vue'
import Loading from '../Loading/Loading.vue'

defineOptions({
  name: 'AliceView',
})

const props = withDefaults(
  defineProps<{
    gap?: '0' | '2' | '4' | '6' | '8'
    padding?: '0' | '2' | '4' | '6' | '8'
    scrollable?: boolean
    height?: 'full' | 'auto' | 'screen'
    loading?: boolean
    loadingType?: 'spinner' | 'skeleton'
    loadingText?: string
  }>(),
  {
    gap: '4',
    padding: '2',
    scrollable: true,
    height: 'full',
    loading: false,
    loadingType: 'spinner',
    loadingText: 'Cargando información...',
  },
)

const gapClass = computed(() => {
  const map: Record<string, string> = {
    '0': 'gap-0',
    '2': 'gap-2',
    '4': 'gap-4',
    '6': 'gap-6',
    '8': 'gap-8',
  }
  return map[props.gap] || 'gap-6'
})

const paddingClass = computed(() => {
  const map: Record<string, string> = {
    '0': 'p-0',
    '2': 'p-2',
    '4': 'p-4',
    '6': 'p-6',
    '8': 'p-8',
  }
  return map[props.padding] || 'p-4'
})

const heightClass = computed(() => {
  const map: Record<string, string> = {
    full: 'h-full',
    auto: 'h-auto',
    screen: 'min-h-screen',
  }
  return map[props.height] || 'h-full'
})
</script>

<template>
  <div
    class="flex flex-col w-full relative outline-none"
    :class="[
      gapClass,
      paddingClass,
      heightClass,
      scrollable ? 'overflow-y-auto custom-scrollbar' : '',
    ]"
  >
    <Loading :active="loading" :type="loadingType" :text="loadingText" />
    <slot />
  </div>
</template>
