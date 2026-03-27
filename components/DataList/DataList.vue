<script setup lang="ts">
defineOptions({ name: 'AliceDataList' })

export interface DataListItem {
  label: string
  value: string | number
  highlight?: boolean
  highlightClass?: string
}

withDefaults(
  defineProps<{
    items?: DataListItem[]
  }>(),
  {
    items: () => [],
  },
)
</script>

<template>
  <div class="flex flex-col gap-1.5 text-sm text-gray-600 dark:text-gray-300">
    <template v-if="items && items.length > 0">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 p-2.5 sm:p-2 rounded"
        :class="index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-800/50' : ''"
      >
        <span class="font-medium text-gray-500 dark:text-gray-400 shrink-0">{{ item.label }}</span>
        <span
          class="font-bold sm:text-right wrap-break-word"
          :class="[
            item.highlight ? 'text-lg text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200',
            item.highlightClass || '',
          ]"
        >
          {{ item.value }}
        </span>
      </div>
    </template>
    <slot v-else />
  </div>
</template>
