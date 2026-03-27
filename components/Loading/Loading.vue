<script setup lang="ts">
import { computed } from 'vue'
import { RefreshCw } from 'lucide-vue-next'

defineOptions({ name: 'AliceLoading' })

const props = withDefaults(
  defineProps<{
    active?: boolean
    type?: 'spinner' | 'skeleton'
    text?: string
    blur?: boolean
    transparent?: boolean
    variant?: 'primary' | 'secondary' | 'emerald' | 'amber' | 'red' | 'indigo' | 'white'
  }>(),
  {
    active: false,
    type: 'spinner',
    text: 'Cargando...',
    blur: true,
    transparent: false,
    variant: 'primary',
  },
)

const variantClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'text-primary-500',
    secondary: 'text-gray-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    indigo: 'text-indigo-500',
    white: 'text-white',
  }
  return map[props.variant] || 'text-primary-500'
})

const bgClass = computed(() => {
  if (props.transparent) return 'bg-transparent'
  return 'bg-white/60 dark:bg-slate-900/60'
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="active"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto"
      :class="[bgClass, blur ? 'backdrop-blur-sm' : '']"
    >
      <template v-if="type === 'spinner'">
        <RefreshCw class="animate-spin mb-3" :class="variantClass" :size="32" />
        <span
          v-if="text"
          class="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200"
        >
          {{ text }}
        </span>
      </template>

      <template v-else-if="type === 'skeleton'">
        <div class="w-full h-full p-6 flex flex-col gap-4 animate-pulse">
           <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
           <div class="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl w-full"></div>
           <div class="space-y-3">
             <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
             <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
             <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6"></div>
           </div>
           <div class="mt-auto flex justify-end gap-3">
             <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
             <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
           </div>
        </div>
      </template>
    </div>
  </Transition>
</template>

<style scoped>
.pointer-events-auto {
  pointer-events: auto;
}
/* Ensure the parent is relative when AliceLoading is used */
:parentElement {
  position: relative !important;
}
</style>
