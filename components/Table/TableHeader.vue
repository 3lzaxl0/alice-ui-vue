<script setup lang="ts" generic="T">
import { ArrowUp, ArrowDown, Filter } from 'lucide-vue-next'
import AliceCheckbox from '../../components/Checkbox/Checkbox.vue'
import AliceButton from '../../components/Button/Button.vue'
import AlicePopover from '../../components/Popover/Popover.vue'
import TableFilter from './TableFilter.vue'
import { tableVariants } from './Table.variants'
import type { Column, FilterValue } from '../../types'

defineOptions({
  name: 'AliceTableHeader',
})

const props = defineProps<{
  data: T[]
  visibleColumns: Column<T>[]
  selectionType: 'none' | 'single' | 'multiple'
  isAllSelected: boolean
  isIndeterminate: boolean
  currentSortColumn: string | null
  currentSortDirection: 'asc' | 'desc' | null
  activeFilters: Record<string, FilterValue>
  openFilterColumn: string | null
  columnWidths: Record<string, string>
  stickyOffsets: Record<string, string>
  stickyRightOffsets: Record<string, string>
  draggingColumnKey: string | null
  dropIndicator: { key: string; side: 'left' | 'right' } | null
  showDividers: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-select-all', value: boolean): void
  (e: 'sort', key: string): void
  (e: 'filter-toggle', key: string): void
  (e: 'filter-apply', key: string, filter: FilterValue): void
  (e: 'filter-clear', key: string): void
  (e: 'filter-close'): void
  (e: 'resize-start', event: MouseEvent, key: string): void
  (e: 'drag-start', event: DragEvent, key: string): void
  (e: 'drag-over', event: DragEvent, key: string): void
  (e: 'drag-end', event: DragEvent): void
  (e: 'drop', event: DragEvent): void
}>()


function getOptionsForColumn(col: Column<T>) {
  if (col.filterOptions && col.filterOptions.length > 0) {
    return col.filterOptions
  }

  if (col.type === 'select' && props.data) {
    const key = col.key as keyof T
    const uniqueValues = new Set<unknown>()

    props.data.forEach((item) => {
      const val = item[key]
      if (val !== null && val !== undefined && val !== '') {
        uniqueValues.add(val)
      }
    })

    return Array.from(uniqueValues)
      .map((val) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const label = col.formatter ? col.formatter(val as any) : String(val)
        return { label: String(label), value: val as string | number }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  return []
}
</script>

<template>
  <thead :class="tableVariants.header">
    <transition-group name="alice-columns" tag="tr">
      <!-- Selection Header -->
      <th v-if="selectionType !== 'none'" key="selection-header" :class="tableVariants.selectionCell"
        class="bg-gray-50 dark:bg-slate-950">
        <AliceCheckbox v-if="selectionType === 'multiple'" :model-value="isAllSelected" :indeterminate="isIndeterminate"
          @update:model-value="emit('toggle-select-all', $event)" />
      </th>

      <th v-for="col in visibleColumns" :key="String(col.key)" :class="tableVariants.headerCell({
        sortable: !!col.sortable,
        frozen: !!col.frozen,
        frozenRight: !!col.frozenRight,
        dragging: draggingColumnKey === String(col.key),
        divided: showDividers,
      })
        " :style="{
          width: columnWidths[String(col.key)] || col.width,
          minWidth: col.minWidth,
          maxWidth: col.maxWidth,
          left: col.frozen ? stickyOffsets[String(col.key)] : undefined,
          right: col.frozenRight ? stickyRightOffsets[String(col.key)] : undefined,
        }" :draggable="openFilterColumn !== String(col.key)" @dragstart="emit('drag-start', $event, String(col.key))"
        @dragover="emit('drag-over', $event, String(col.key))" @dragend="emit('drag-end', $event)"
        @drop="emit('drop', $event)" @click="col.sortable && emit('sort', String(col.key))">
        <div class="flex items-center gap-2">

          <!-- Filter Button -->
            <AlicePopover v-if="col.filterable !== false" :model-value="openFilterColumn === String(col.key)"
              @update:model-value="(val: boolean) => !val && emit('filter-close')" 
              teleport placement="bottom-right" :offset="8"
              content-class="cursor-default alice-table-filter-popover">
              <template #trigger>
                <div class="relative">
                  <AliceButton variant="primary" design="ghost-subtle" size="icon-sm"
                    @click.stop="emit('filter-toggle', String(col.key))"
                    class="hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200">
                    <Filter :size="14" :fill="activeFilters[String(col.key)] ? 'currentColor' : 'none'"
                      :class="activeFilters[String(col.key)] ? 'text-primary-600 dark:text-primary-400' : ''" />
                  </AliceButton>

                  <!-- Indicator Dot -->
                  <div v-if="activeFilters[String(col.key)]"
                    class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary-500 rounded-full ring-2 ring-white dark:ring-slate-900 pointer-events-none" />
                </div>
              </template>

              <TableFilter :id="`filter-${String(col.key)}`" :name="`filter-${String(col.key)}`"
                :type="col.type || 'text'" :options="getOptionsForColumn(col)"
                :model-value="activeFilters[String(col.key)] || { value: null }" @update:model-value="
                  (val: FilterValue) => emit('filter-apply', String(col.key), val)
                " @close="emit('filter-close')" />
            </AlicePopover>

          <!-- Header Title -->
          <span class="font-bold" :class="[
            col.align === 'right' ? 'ml-auto' : '',
            col.align === 'center' ? 'mx-auto' : '',
          ]">
            {{ col.header }}
          </span>

          <!-- Sort Indicators -->
          <div v-if="col.sortable" class="flex flex-col text-gray-400">
            <ArrowUp v-if="currentSortColumn === String(col.key) && currentSortDirection === 'asc'" :size="14"
              class="text-primary-600" />
            <ArrowDown v-else-if="currentSortColumn === String(col.key) && currentSortDirection === 'desc'" :size="14"
              class="text-primary-600" />
            <div v-else class="h-3.5 w-3.5 relative opacity-0 group-hover:opacity-50">
              <ArrowUp :size="14" class="absolute inset-0" />
            </div>
          </div>

        </div>

        <!-- Resize Handle -->
        <div
          class="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary-400 opacity-0 hover:opacity-100 active:opacity-100 active:bg-primary-600 transition-colors z-30"
          @click.stop @mousedown.stop.prevent="emit('resize-start', $event, String(col.key))"></div>
      </th>
    </transition-group>
  </thead>
</template>
