<script setup lang="ts" generic="T">
import { Loader2 } from 'lucide-vue-next'
import TableRow from './TableRow.vue'
import type { Column } from '../../types'

defineOptions({
  name: 'AliceTableBody',
})

defineProps<{
  loading: boolean
  processedData: T[]
  isVirtual: boolean
  virtualData: T[]
  displayedData: T[]
  visibleColumns: Column<T>[]
  selectionType: 'none' | 'single' | 'multiple'
  selectedSet: Set<unknown>
  striped: boolean
  rowHeight: number
  stickyOffsets: Record<string, string>
  columnWidths: Record<string, string>
  virtualState: {
    paddingTop: number
    paddingBottom: number
  }
  getGlobalIndex: (index: number) => number
  getItemKey: (item: T) => unknown
  draggingColumnKey: string | null
  showDividers: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-selection', item: T): void
  (e: 'drag-over', event: DragEvent, key: string): void
  (e: 'drop', event: DragEvent): void
}>()
</script>

<template>
  <tbody class="shadow-sm text-sm text-gray-600 dark:text-gray-300">
    <!-- Loading State -->
    <tr v-if="loading">
      <td
        :colspan="visibleColumns.length + (selectionType !== 'none' ? 1 : 0)"
        class="px-6 py-12 text-center text-gray-400"
      >
        <div class="flex flex-col items-center gap-2">
          <Loader2 class="animate-spin text-blue-500" :size="24" />
          <span>Cargando datos...</span>
        </div>
      </td>
    </tr>

    <!-- Empty State -->
    <tr v-else-if="processedData.length === 0">
      <td
        :colspan="visibleColumns.length + (selectionType !== 'none' ? 1 : 0)"
        class="px-6 py-12 text-center text-gray-400"
      >
        No se encontraron registros
      </td>
    </tr>

    <!-- Virtual Scroll: Top Spacer -->
    <tr v-else-if="virtualState.paddingTop > 0" :style="{ height: virtualState.paddingTop + 'px' }">
      <td
        :colspan="visibleColumns.length + (selectionType !== 'none' ? 1 : 0)"
        class="p-0 border-0"
      ></td>
    </tr>

    <!-- Rows Rendering -->
    <template v-if="!loading && processedData.length > 0">
      <TableRow
        v-for="(item, index) in isVirtual ? virtualData : displayedData"
        :key="String(getItemKey(item as any))"
        :item="item"
        :index="index"
        :global-index="getGlobalIndex(index)"
        :visible-columns="visibleColumns"
        :selection-type="selectionType"
        :is-selected="selectedSet.has(getItemKey(item))"
        :striped="striped"
        :row-height="rowHeight"
        :sticky-offsets="stickyOffsets"
        :column-widths="columnWidths"
        :dragging-column-key="draggingColumnKey"
        :show-dividers="showDividers"
        @toggle-selection="emit('toggle-selection', $event)"
        @drag-over="(e, key) => emit('drag-over', e, key)"
        @drop="(e) => emit('drop', e)"
      >
        <!-- Forward all slots to TableRow -->
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </TableRow>
    </template>

    <!-- Virtual Scroll: Bottom Spacer -->
    <tr
      v-if="!loading && virtualState.paddingBottom > 0"
      :style="{ height: virtualState.paddingBottom + 'px' }"
    >
      <td
        :colspan="visibleColumns.length + (selectionType !== 'none' ? 1 : 0)"
        class="p-0 border-0"
      ></td>
    </tr>
  </tbody>
</template>
