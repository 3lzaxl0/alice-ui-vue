<script setup lang="ts">
import type { Component } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import AliceButton from '../Button/Button.vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
  showRefresh?: boolean
  refreshing?: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()
</script>

<template>
  <div class="px-6 py-6 pb-2 shrink-0 flex items-center justify-between gap-4">
    <div class="flex items-center gap-3 min-w-0">
      <component :is="icon" v-if="icon" :size="28" class="text-primary-600 dark:text-primary-400 shrink-0" />
      <div class="min-w-0">
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1 truncate"
        >
          {{ title }}
        </h1>
        <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 truncate">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <slot name="actions" />

      <AliceButton
        v-if="showRefresh"
        variant="primary"
        design="ghost"
        size="sm"
        :icon="RefreshCw"
        :loading="refreshing"
        loading-animate-icon
        @click="emit('refresh')"
      >
        <span class="hidden md:inline-block ml-1">Actualizar</span>
      </AliceButton>
    </div>
  </div>
</template>
