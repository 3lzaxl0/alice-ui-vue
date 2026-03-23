<script setup lang="ts">
import { Construction } from 'lucide-vue-next'

interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'En Construcción',
  message: '¡Próximamente!',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[60vh] text-center p-8">
    <div
      class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6 text-blue-600 dark:text-blue-400"
    >
      <slot name="icon">
        <Construction :size="64" />
      </slot>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">{{ title }}</h1>
    <p class="text-gray-500 dark:text-gray-400 max-w-md">
      {{ message }}
    </p>
    <slot name="action"></slot>
  </div>
</template>
