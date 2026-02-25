import { computed, watch, type Ref } from 'vue'

import type { Column } from '../../../types'

export function useSelection<T>(
  selectionType: Ref<'none' | 'single' | 'multiple'>,
  selected: Ref<T[]>,
  processedData: Ref<T[]>,
  columns: Ref<Column<T>[]>,
  emitChange: (newSelected: T[]) => void,
) {
  const keyColumns = computed(() => columns.value.filter((c) => c.isKey).map((c) => String(c.key)))

  // Helper to extract the unique key for an item, falling back to the item itself
  const getItemKey = (item: T): unknown => {
    if (!item || typeof item !== 'object') return item

    const keys = keyColumns.value
    if (keys.length === 0) return item

    // Single key
    if (keys.length === 1) {
      const singleKey = keys[0]
      if (!singleKey) return item

      const val = (item as Record<string, unknown>)[singleKey]
      return val !== undefined && val !== null ? val : item
    }

    // Composite key
    return keys.map((k) => String((item as Record<string, unknown>)[k])).join('|')
  }

  // We use a Set for O(1) lookups based on the resolved keys
  const selectedSet = computed(() => {
    const set = new Set<unknown>()
    selected.value.forEach((item) => set.add(getItemKey(item)))
    return set
  })

  const isAllSelected = computed(() => {
    if (selectionType.value !== 'multiple') return false
    if (processedData.value.length === 0) return false
    return processedData.value.every((item) => selectedSet.value.has(getItemKey(item)))
  })

  const isIndeterminate = computed(() => {
    if (selectionType.value !== 'multiple') return false
    if (processedData.value.length === 0) return false
    if (isAllSelected.value) return false
    return processedData.value.some((item) => selectedSet.value.has(getItemKey(item)))
  })

  const pHasSelection = computed(() => selectedSet.value.size > 0)

  function toggleSelection(item: T) {
    const itemKey = getItemKey(item)

    if (selectionType.value === 'single') {
      const newSelected = selectedSet.value.has(itemKey) ? [] : [item]
      emitChange(newSelected)
      return
    }

    if (selectionType.value === 'multiple') {
      const newSelected = [...selected.value]
      // Find index by key
      const index = newSelected.findIndex((selectedItem) => getItemKey(selectedItem) === itemKey)

      if (index === -1) {
        newSelected.push(item)
      } else {
        newSelected.splice(index, 1)
      }
      emitChange(newSelected)
    }
  }

  function toggleSelectAll() {
    if (selectionType.value !== 'multiple') return

    if (isAllSelected.value) {
      // Deselect all visible/processed items
      const toRemoveKeys = new Set(processedData.value.map(getItemKey))
      const newSelected = selected.value.filter((item) => !toRemoveKeys.has(getItemKey(item)))
      emitChange(newSelected)
    } else {
      // Select all processed items that aren't already selected
      const toAdd = processedData.value.filter((item) => !selectedSet.value.has(getItemKey(item)))
      const newSelected = [...selected.value, ...toAdd]
      emitChange(newSelected)
    }
  }

  // Watch for changes in processedData (i.e. due to filtering or new data fetch)
  // If selected items are no longer in the processed data, deselect them
  watch(
    () => processedData.value,
    (newData) => {
      if (selected.value.length === 0) return

      const newDataKeys = new Set(newData.map(getItemKey))
      const validSelection = selected.value.filter((item) => newDataKeys.has(getItemKey(item)))

      if (validSelection.length !== selected.value.length) {
        emitChange(validSelection)
      }
    },
    { deep: false }, // Only check when the array reference changes (usually filtering)
  )

  return {
    selectedSet, // For backward compatibility elsewhere, though it contains keys now
    getItemKey, // Exported to be used in views
    isAllSelected,
    isIndeterminate,
    hasSelection: pHasSelection,
    toggleSelection,
    toggleSelectAll,
  }
}
