<script setup lang="ts">
import AliceButton from '../../components/Button/Button.vue'

defineOptions({
  name: 'AliceTablePagination',
})

defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'prev-page'): void
  (e: 'next-page'): void
}>()
</script>

<template>
  <div
    class="border-t border-gray-100 dark:border-slate-700 px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-800 rounded-b-xl"
  >
    <div class="text-sm text-gray-500 dark:text-gray-400">
      Página <span class="font-medium text-gray-900 dark:text-white">{{ currentPage }}</span> de
      <span class="font-medium text-gray-900 dark:text-white">{{ totalPages }}</span>
    </div>
    <div class="flex gap-2">
      <AliceButton
        variant="ghost"
        size="sm"
        :disabled="currentPage === 1"
        @click="emit('prev-page')"
      >
        Anterior
      </AliceButton>
      <AliceButton
        variant="ghost"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="emit('next-page')"
      >
        Siguiente
      </AliceButton>
    </div>
  </div>
</template>
