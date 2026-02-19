<script setup lang="ts">
import AliceButton from '../Button/Button.vue'
import { Filter } from 'lucide-vue-next'

defineOptions({
  name: 'AliceFilterPanel',
})

defineEmits<{
  (e: 'filter'): void
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-white/2 p-5 border border-gray-100 dark:border-white/10 flex flex-col lg:flex-row gap-5 items-end lg:items-center justify-between transition-all duration-300 rounded-alice-md shadow-alice-sm"
  >
    <!-- Filters Area -->
    <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <slot></slot>
    </div>

    <!-- Action Button -->
    <div class="shrink-0 w-full lg:w-auto">
      <AliceButton @click="$emit('filter')" :icon="Filter" class="w-full lg:w-auto min-w-[120px]">
        Filtrar
      </AliceButton>
    </div>
  </div>
</template>
