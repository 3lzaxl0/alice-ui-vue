<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>

<template>
  <div class="px-6 py-6 pb-2 shrink-0">
    <div class="flex items-center gap-3">
      <component :is="icon" v-if="icon" :size="28" class="text-blue-600 dark:text-blue-400" />
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1"
        >
          {{ title }}
        </h1>
        <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
