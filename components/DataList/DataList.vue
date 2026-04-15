<script setup lang="ts">
import { type Component } from 'vue'

defineOptions({ name: 'AliceDataList' })

export interface DataListItem {
  label: string
  value?: string | number
  icon?: Component
  iconClass?: string
  highlight?: boolean
  highlightClass?: string
}

export type DataListShrinkSide = 'label' | 'value' | 'none'

withDefaults(
  defineProps<{
    items?: DataListItem[]
    alternateRows?: boolean
    shrinkSide?: DataListShrinkSide
  }>(),
  {
    items: () => [],
    alternateRows: true,
    shrinkSide: 'value',
  },
)
</script>

<template>
  <div class="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
    <template v-if="items && items.length > 0">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-4 px-3 py-2 rounded-alice-sm transition-colors duration-200"
        :class="[
          alternateRows && index % 2 === 0 ? 'bg-gray-50/70 dark:bg-slate-800/20' : '',
          'hover:bg-gray-100/30 dark:hover:bg-slate-800/40',
        ]"
      >
        <!-- Label Area -->
        <div 
          class="flex items-center gap-2.5 min-w-0"
          :class="[
            shrinkSide === 'label' ? 'flex-1 min-w-0' : 'shrink-0'
          ]"
        >
          <slot name="item-label" :item="item" :index="index">
            <component
              :is="item.icon"
              v-if="item.icon"
              :size="14"
              class="shrink-0"
              :class="item.iconClass || 'text-gray-400'"
            />
            <span class="text-gray-600 dark:text-gray-400 truncate" :title="item.label">
              {{ item.label }}
            </span>
          </slot>
        </div>

        <!-- Value Area -->
        <div
          class="min-w-0 sm:text-right"
          :class="[
            shrinkSide === 'value' ? 'flex-1 min-w-0' : 'shrink-0',
            item.highlight ? 'text-lg font-bold text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200',
            item.highlightClass || ''
          ]"
        >
          <slot name="item-value" :item="item" :index="index">
            <span class="font-semibold block truncate" :title="String(item.value)">
              {{ item.value }}
            </span>
          </slot>
        </div>
      </div>
    </template>
    <slot v-else />
  </div>
</template>
