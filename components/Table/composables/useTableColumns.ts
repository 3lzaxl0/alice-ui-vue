import { ref, computed, watch, onUnmounted, type Ref } from 'vue'
import type { Column } from '../../../types'

export function useTableColumns<T>(
  columns: Ref<Column<T>[]>,
  selectionType: Ref<'none' | 'single' | 'multiple'>,
) {
  /* -------------------------------------------------------------------------- */
  /*                               resize LOGIC                                 */
  /* -------------------------------------------------------------------------- */
  const columnWidths = ref<Record<string, string>>({})
  const resizingColumn = ref<string | null>(null)
  const startX = ref(0)
  const startWidth = ref(0)

  // Initialize widths
  watch(
    columns,
    (cols) => {
      cols.forEach((col) => {
        if (col.width && !columnWidths.value[String(col.key)]) {
          columnWidths.value[String(col.key)] = col.width
        }
      })
    },
    { immediate: true },
  )

  function startResize(e: MouseEvent, columnKey: string) {
    resizingColumn.value = columnKey
    startX.value = e.pageX
    // Get current width in pixels
    const currentWidth = columnWidths.value[columnKey] || '150px' // fallback
    // Handle px or % (simple implementation assumes px mostly)
    startWidth.value = parseInt(currentWidth, 10) || 150

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function handleResize(e: MouseEvent) {
    if (!resizingColumn.value) return

    // Find the column object to check for minWidth/maxWidth constraints
    const col = columns.value.find((c) => String(c.key) === resizingColumn.value)
    const minW = col?.minWidth ? parseInt(col.minWidth, 10) : 40 // Lower default to 40px
    const maxW = col?.maxWidth ? parseInt(col.maxWidth, 10) : Infinity

    const diff = e.pageX - startX.value
    let newWidth = startWidth.value + diff

    // Apply constraints
    newWidth = Math.max(minW, Math.min(newWidth, maxW))

    columnWidths.value[resizingColumn.value] = `${newWidth}px`
  }

  function stopResize() {
    resizingColumn.value = null
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  // Cleanup just in case
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  })

  /* -------------------------------------------------------------------------- */
  /*                                REORDER LOGIC                               */
  /* -------------------------------------------------------------------------- */
  const orderedColumnKeys = ref<string[]>([])
  const draggingColumnKey = ref<string | null>(null)
  const dropIndicator = ref<{ key: string; side: 'left' | 'right' } | null>(null)

  watch(
    columns,
    (newCols) => {
      const newKeys = new Set(newCols.map((c) => String(c.key)))
      // Keep existing keys that are still present
      const currentKeys = orderedColumnKeys.value.filter((k) => newKeys.has(k))

      // Add new keys that weren't there before
      newCols.forEach((c) => {
        const k = String(c.key)
        if (!orderedColumnKeys.value.includes(k)) {
          currentKeys.push(k)
        }
      })
      orderedColumnKeys.value = currentKeys
    },
    { immediate: true },
  )

  const visibleColumns = computed(() => {
    const colMap = new Map(columns.value.map((c) => [String(c.key), c]))
    return orderedColumnKeys.value
      .map((key) => colMap.get(key))
      .filter((c): c is Column<T> => !!c && !c.hidden) // Filter out hidden columns
  })

  function handleDragStart(e: DragEvent, columnKey: string) {
    draggingColumnKey.value = columnKey
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('text/plain', columnKey)
    }
  }

  function handleDragOver(e: DragEvent, targetKey: string, cellElement: HTMLElement) {
    e.preventDefault() // Allow dropping
    if (!draggingColumnKey.value || draggingColumnKey.value === targetKey) {
      dropIndicator.value = null
      return
    }

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }

    const rect = cellElement.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const isRightHalf = offsetX > rect.width / 2

    const newSide = isRightHalf ? 'right' : 'left'
    
    // Only trigger reactivity if the indicator location changed
    if (
      !dropIndicator.value ||
      dropIndicator.value.key !== targetKey ||
      dropIndicator.value.side !== newSide
    ) {
      dropIndicator.value = {
        key: targetKey,
        side: newSide,
      }
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    const sourceKey = draggingColumnKey.value
    const indicator = dropIndicator.value

    if (!sourceKey || !indicator) {
      clearDragState()
      return
    }

    const keys = [...orderedColumnKeys.value]
    const fromIndex = keys.indexOf(sourceKey)
    const toIndex = keys.indexOf(indicator.key)

    if (fromIndex !== -1 && toIndex !== -1) {
      keys.splice(fromIndex, 1)
      const adjustedTargetIndex = keys.indexOf(indicator.key)
      let insertIndex = adjustedTargetIndex
      if (indicator.side === 'right') {
        insertIndex += 1
      }
      keys.splice(insertIndex, 0, sourceKey)
      orderedColumnKeys.value = keys
    }

    clearDragState()
  }

  function handleDragEnd() {
    clearDragState()
  }

  function clearDragState() {
    draggingColumnKey.value = null
    dropIndicator.value = null
  }

  /* -------------------------------------------------------------------------- */
  /*                               STICKY COMPUTED                              */
  /* -------------------------------------------------------------------------- */
  const stickyOffsets = computed(() => {
    const offsets: Record<string, string> = {}
    let currentOffset = 0

    if (selectionType.value !== 'none') {
      currentOffset += 48 // Hardcoded width of selection column
    }

    for (const col of visibleColumns.value) {
      if (col.frozen) {
        offsets[String(col.key)] = `${currentOffset}px`
        const wStr = columnWidths.value[String(col.key)] || col.width || '150px'
        const w = parseInt(wStr, 10) || 150
        currentOffset += w
      }
    }
    return offsets
  })

  const stickyRightOffsets = computed(() => {
    const offsets: Record<string, string> = {}
    let currentOffset = 0 // px from the right edge

    // Iterate backwards through visible columns
    for (let i = visibleColumns.value.length - 1; i >= 0; i--) {
      const col = visibleColumns.value[i]
      if (!col) continue
      
      if (col.frozenRight) {
        offsets[String(col.key)] = `${currentOffset}px`
        const wStr = columnWidths.value[String(col.key)] || col.width || '150px'
        const w = parseInt(wStr, 10) || 150
        currentOffset += w
      }
    }
    return offsets
  })

  const hiddenColumns = ref<Set<string>>(new Set())

  // Initialize hidden columns from props
  watch(
    columns,
    (cols) => {
      cols.forEach((c) => {
        if (c.hidden) hiddenColumns.value.add(String(c.key))
      })
    },
    { immediate: true },
  )

  // Override visibleColumns logic to use hiddenColumns set
  const finalVisibleColumns = computed(() => {
    const colMap = new Map(columns.value.map((c) => [String(c.key), c]))
    return orderedColumnKeys.value
      .map((key) => colMap.get(key))
      .filter((c): c is Column<T> => !!c && !hiddenColumns.value.has(String(c.key)))
  })

  function toggleColumnVisibility(key: string, visible: boolean) {
    if (visible) {
      hiddenColumns.value.delete(key)
    } else {
      hiddenColumns.value.add(key)
    }
  }

  return {
    // State
    columnWidths,
    orderedColumnKeys, // Exposed for external saving/loading
    hiddenColumns, // Exposed for external saving/loading

    // Computed
    visibleColumns: finalVisibleColumns,
    stickyOffsets,
    stickyRightOffsets,

    // Methods
    startResize,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    toggleColumnVisibility,

    // UI Helpers (Drag State)
    draggingColumnKey,
    dropIndicator,
  }
}
