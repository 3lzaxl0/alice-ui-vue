<script setup lang="ts" generic="T">
import { toRef, ref, computed, watch, onMounted, onUnmounted } from 'vue'

import TableToolbar from './TableToolbar.vue'
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TableFooter from './TableFooter.vue'
import TablePagination from './TablePagination.vue'

// Imports from Types and Composables
import type { Column, TableVariant } from '../../types'
import { useTableColumns } from './composables/useTableColumns'
import { useTableData } from './composables/useTableData'
import { useSelection } from './composables/useSelection'
import { useTableState } from './composables/useTableState'
import { useVirtualScroll } from './composables/useVirtualScroll'
import { useTableExport } from './composables/useTableExport'
import { useAliceToast } from '../../index'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
// Re-exporting Column for usage in parent components
export type { Column }

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  mode?: 'auto' | 'fixed' // auto = fill height, fixed = height based on content
  pagination?: boolean
  itemsPerPage?: number
  // Virtual Scroll Props
  rowHeight?: number // px
  buffer?: number // number of items to render outside viewport
  // Selection Props
  selectionType?: 'none' | 'single' | 'multiple'
  selected?: T[]
  // Appearance Props
  striped?: boolean
  // Persistence & Variants
  tableId?: string
  variants?: TableVariant[]
  hideVariants?: boolean
  hideShadow?: boolean
  showDividers?: boolean
  visibleRows?: number
}

const props = withDefaults(defineProps<Props<T>>(), {
  loading: false,
  mode: 'fixed',
  itemsPerPage: 10,
  rowHeight: 40,
  buffer: 10,
  selectionType: 'none',
  selected: () => [],
  striped: true,
  variants: () => [],
  hideVariants: false,
  hideShadow: false,
  showDividers: false,
})

defineOptions({
  name: 'AliceTable',
})

const emit = defineEmits<{
  (e: 'sort-change', sort: { column: string | null; direction: 'asc' | 'desc' | null }): void
  (e: 'filter-change', filters: Record<string, { value: unknown; operator: string }>): void
  (e: 'update:selected', selected: T[]): void
  (e: 'selection-change', selected: T[]): void
}>()

/* -------------------------------------------------------------------------- */
/*                                COMPOSABLES                                 */
/* -------------------------------------------------------------------------- */

// 1. Data Logic
const {
  currentPage,
  totalPages,
  currentSortColumn,
  currentSortDirection,
  activeFilters,
  openFilterColumn,
  processedData,
  displayedData,
  handleSort,
  toggleFilter,
  applyFilter,
  clearFilter,
  prevPage,
  nextPage,
} = useTableData(
  toRef(props, 'columns'),
  toRef(props, 'data'),
  toRef(props, 'pagination'),
  toRef(props, 'itemsPerPage'),
)

// 2. Columns Logic
const {
  columnWidths,
  orderedColumnKeys,
  hiddenColumns,
  visibleColumns,
  stickyOffsets,
  stickyRightOffsets,
  startResize,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  toggleColumnVisibility,
  draggingColumnKey,
  dropIndicator,
} = useTableColumns(toRef(props, 'columns'), toRef(props, 'selectionType'))

// 3. Selection Logic
const {
  selectedSet,
  getItemKey,
  isAllSelected,
  isIndeterminate,
  hasSelection,
  toggleSelection,
  toggleSelectAll,
  setSelection,
} = useSelection(
  toRef(props, 'selectionType'),
  toRef(props, 'selected'),
  processedData,
  toRef(props, 'columns') as unknown as import('vue').Ref<Column<T>[]>,
  (newSelected) => {
    emit('update:selected', newSelected)
    emit('selection-change', newSelected)
  },
)

// 3.1 Selection Drag Logic
const selectionDragActive = ref(false)
const selectionDragMode = ref<'select' | 'deselect'>('select')

function handleSelectionDragStart(item: T) {
  if (props.selectionType === 'none') return

  if (props.selectionType === 'single') {
    toggleSelection(item)
    return
  }

  selectionDragActive.value = true
  const currentlySelected = selectedSet.value.has(getItemKey(item))
  selectionDragMode.value = currentlySelected ? 'deselect' : 'select'
  // Toggle the first item immediately
  setSelection(item, selectionDragMode.value === 'select')
}

function handleSelectionDragHover(item: T) {
  if (!selectionDragActive.value) return
  setSelection(item, selectionDragMode.value === 'select')
}

function handleSelectionDragEnd() {
  selectionDragActive.value = false
}

onMounted(() => {
  window.addEventListener('mouseup', handleSelectionDragEnd)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleSelectionDragEnd)
})

// 4. State & Persistence Logic
const footerOperations = ref<Record<string, string>>({})
const {
  saveState,
  applyVariant,
  saveVariant,
  deleteVariant,
  resetToDefault,
  allVariants,
  activeVariantName,
} = useTableState(
  toRef(props, 'tableId'),
  columnWidths,
  orderedColumnKeys,
  hiddenColumns,
  footerOperations,
  toRef(props, 'variants'),
  toRef(props, 'columns'),
)

// 5. Virtual Scroll
const { scrollViewport, virtualState, virtualData, isVirtual, handleScroll } = useVirtualScroll(
  processedData,
  toRef(props, 'mode'),
  toRef(props, 'pagination'),
  toRef(props, 'rowHeight'),
  toRef(props, 'buffer'),
)

// 6. Export Logic
const { add: addToast } = useAliceToast()

const { exportToExcel } = useTableExport(
  displayedData, // We export only what is currently filtered & sorted visually
  visibleColumns, // We export only the columns visible to the user and in their current order
  toRef(props, 'tableId'),
)

const isExporting = ref(false)

const handleExport = async () => {
  if (isExporting.value) return
  isExporting.value = true

  try {
    const success = await exportToExcel()
    if (success) {
      addToast({
        title: 'Exportación completada',
        message: 'El archivo Excel se ha descargado exitosamente.',
        type: 'success',
      })
    } else {
      throw new Error('Export returned false')
    }
  } catch (error) {
    // Assert error as Error object to access message safely
    const errorMessage =
      error instanceof Error ? error.message : 'Hubo un problema al generar el archivo Excel.'
    addToast({
      title: 'Error de Exportación',
      message: errorMessage,
      type: 'error',
    })
  } finally {
    isExporting.value = false
  }
}

/* -------------------------------------------------------------------------- */
/*                                    STATE                                   */
/* -------------------------------------------------------------------------- */
const tableContainer = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

// View Transition Helper
const transitionId = computed(() =>
  props.tableId ? `alice-table-${props.tableId}` : 'alice-table-default',
)

// Computed viewport style for strict fixed heights
const viewportStyle = computed(() => {
  const style: Record<string, string> = { overflowAnchor: 'none' }
  // Only apply fixed height if we are NOT in fullscreen mode
  if (props.visibleRows && !isFullscreen.value) {
    const pxHeight = props.visibleRows * props.rowHeight
    style.height = `${pxHeight}px`
    style.minHeight = `${pxHeight}px`
    style.maxHeight = `${pxHeight}px`
    style.flex = 'none'
  }
  return style
})

// Calculate position for the vertical drop indicator using DOM coordinates for 100% accuracy
const dropIndicatorOffset = ref<number | null>(null)
const dropIndicatorHeight = ref<number>(0)

function onDragOver(e: DragEvent, key: string) {
  handleDragOver(e, key)

  if (dropIndicator.value) {
    const target = e.currentTarget as HTMLElement
    if (target && target.getBoundingClientRect) {
      const rect = target.getBoundingClientRect()
      const viewport = scrollViewport.value
      if (viewport) {
        const viewportRect = viewport.getBoundingClientRect()
        const scrollLeft = viewport.scrollLeft
        const relativeLeft = rect.left - viewportRect.left + scrollLeft

        dropIndicatorOffset.value =
          dropIndicator.value.side === 'left' ? relativeLeft : relativeLeft + rect.width

        // Ensure the line covers the entire scrollable area
        dropIndicatorHeight.value = viewport.scrollHeight
      }
    }
  } else {
    dropIndicatorOffset.value = null
  }
}

function onDrop(e: DragEvent) {
  handleDrop(e)
  dropIndicatorOffset.value = null
}

function onDragEnd() {
  handleDragEnd()
  dropIndicatorOffset.value = null
}

// UI Helpers
function toggleFullscreen() {
  const doc = document as unknown as { startViewTransition?: (cb: () => void) => void }
  if (doc.startViewTransition) {
    doc.startViewTransition(() => {
      isFullscreen.value = !isFullscreen.value
    })
  } else {
    isFullscreen.value = !isFullscreen.value
  }
}

// Global Index Helper for Stripe calculation
const getGlobalIndex = (localIndex: number) => {
  if (props.pagination) {
    return (currentPage.value - 1) * props.itemsPerPage + localIndex
  }
  if (isVirtual.value) {
    return virtualState.value.startIndex + localIndex
  }
  return localIndex
}

// Save Variant Helper
const handleSaveVariant = (name: string) => {
  saveVariant(name)
}

const handleUpdateActiveVariant = () => {
  const active = allVariants.value.find((v) => v.name === activeVariantName.value)
  if (active && !active.isPreset) {
    saveVariant(active.label)
  }
}

// Emit filter change for external use
watch(
  activeFilters,
  (newFilters) => {
    emit('filter-change', newFilters as Record<string, { value: unknown; operator: string }>)
  },
  { deep: true },
)

// Expose Variant Methods for external usage or UI component
defineExpose({
  saveState,
  applyVariant,
  clearFilter,
  saveVariant,
})
</script>

<template>
  <div
    ref="tableContainer"
    class="flex flex-col border border-gray-100 dark:border-white/10 alice-table-container rounded-alice-md"
    :style="{ 'view-transition-name': transitionId }"
    :class="[
      isFullscreen
        ? 'fixed inset-0 z-50 m-0 h-screen w-screen p-2 md:p-4 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden'
        : ['relative', !hideShadow ? 'shadow-alice-panel' : '', 'bg-white dark:bg-transparent'],
      (mode === 'auto' && !visibleRows) || isFullscreen ? 'flex-1 min-h-0' : 'h-fit',
    ]"
  >
    <!-- Toolbar -->
    <TableToolbar
      :has-selection="hasSelection"
      :selected-count="selectedSet.size"
      :data-count="processedData.length"
      :is-fullscreen="isFullscreen"
      :hide-variants="hideVariants"
      :table-id="tableId"
      :columns="columns as Column<T>[]"
      :hidden-columns="hiddenColumns"
      :all-variants="allVariants"
      :active-variant-name="activeVariantName"
      :is-exporting="isExporting"
      @toggle-fullscreen="toggleFullscreen"
      @export="handleExport"
      @reset-to-default="resetToDefault"
      @toggle-column="toggleColumnVisibility"
      @save-variant="handleSaveVariant"
      @update-active-variant="handleUpdateActiveVariant"
      @delete-variant="deleteVariant"
      @apply-variant="applyVariant"
      @save-state="saveState"
    >
      <template #selection-actions>
        <slot name="selection-actions" :selected="Array.from(selectedSet)" />
      </template>
      <template #toolbar-actions>
        <slot name="toolbar-actions" />
      </template>
    </TableToolbar>

    <!-- Table Content -->
    <div
      ref="scrollViewport"
      class="overflow-auto custom-scrollbar relative alice-smooth-scroll"
      :class="[!pagination ? 'rounded-b-xl' : '', !visibleRows ? 'flex-1 min-h-0' : '']"
      :style="viewportStyle"
      @scroll="handleScroll"
    >
      <!-- Modern Vertical Drop Indicator -->
      <transition name="alice-fade">
        <div
          v-if="dropIndicatorOffset !== null"
          class="absolute top-0 w-0.5 bg-blue-500 z-alice-popover pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out"
          :style="{
            left: dropIndicatorOffset + 'px',
            height: dropIndicatorHeight + 'px',
          }"
        >
          <!-- Top Ornament -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10"
          >
            <div class="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
          </div>

          <!-- Decorative Line Gradient -->
          <div
            class="absolute inset-0 bg-linear-to-b from-blue-400 via-blue-500 to-blue-400 opacity-80"
          ></div>

          <!-- Bottom Ornament -->
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10"
          >
            <div class="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
          </div>
        </div>
      </transition>

      <table class="w-full text-left border-separate border-spacing-0">
        <TableHeader
          :data="data"
          :visible-columns="visibleColumns as Column<T>[]"
          :selection-type="selectionType"
          :is-all-selected="isAllSelected"
          :is-indeterminate="isIndeterminate"
          :current-sort-column="currentSortColumn"
          :current-sort-direction="currentSortDirection"
          :active-filters="activeFilters"
          :open-filter-column="openFilterColumn"
          :column-widths="columnWidths"
          :sticky-offsets="stickyOffsets"
          :sticky-right-offsets="stickyRightOffsets"
          :dragging-column-key="draggingColumnKey"
          :drop-indicator="dropIndicator"
          :show-dividers="showDividers"
          @toggle-select-all="toggleSelectAll"
          @sort="(key) => handleSort(key, true)"
          @filter-toggle="toggleFilter"
          @filter-apply="applyFilter"
          @filter-clear="clearFilter"
          @filter-close="openFilterColumn = null"
          @resize-start="startResize"
          @drag-start="handleDragStart"
          @drag-over="onDragOver"
          @drop="onDrop"
          @drag-end="onDragEnd"
        />

        <TableBody
          :loading="loading"
          :processed-data="processedData as any"
          :is-virtual="isVirtual"
          :virtual-data="virtualData as any"
          :displayed-data="displayedData as any"
          :visible-columns="visibleColumns as any"
          :selection-type="selectionType"
          :selected-set="selectedSet as any"
          :striped="striped"
          :row-height="rowHeight"
          :sticky-offsets="stickyOffsets"
          :sticky-right-offsets="stickyRightOffsets"
          :column-widths="columnWidths"
          :virtual-state="virtualState"
          :get-global-index="getGlobalIndex"
          :get-item-key="getItemKey"
          :dragging-column-key="draggingColumnKey"
          :show-dividers="showDividers"
          @toggle-selection="toggleSelection as any"
          @selection-drag-start="handleSelectionDragStart"
          @selection-drag-hover="handleSelectionDragHover"
          @drag-over="onDragOver"
          @drop="onDrop"
        >
          <!-- Forward all slots to TableBody -->
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </TableBody>

        <TableFooter
          :visible-columns="visibleColumns as Column<T>[]"
          :processed-data="processedData as T[]"
          :selection-type="selectionType"
          :sticky-offsets="stickyOffsets"
          :sticky-right-offsets="stickyRightOffsets"
          :column-widths="columnWidths"
          :show-dividers="showDividers"
          v-model:footer-operations="footerOperations"
        />
      </table>
    </div>

    <!-- Pagination -->
    <TablePagination
      v-if="pagination"
      :current-page="currentPage"
      :total-pages="totalPages"
      @prev-page="prevPage"
      @next-page="nextPage"
    />
  </div>
</template>
