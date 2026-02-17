import { computed, type Ref } from 'vue'

export function useSelection<T>(
  selectionType: Ref<'none' | 'single' | 'multiple'>,
  selected: Ref<T[]>,
  processedData: Ref<T[]>,
  emitChange: (newSelected: T[]) => void,
) {
  // We use a Set for O(1) lookups
  const selectedSet = computed(() => new Set(selected.value))

  const isAllSelected = computed(() => {
    if (selectionType.value !== 'multiple') return false
    if (processedData.value.length === 0) return false
    return processedData.value.every((item) => selectedSet.value.has(item))
  })

  const isIndeterminate = computed(() => {
    if (selectionType.value !== 'multiple') return false
    if (processedData.value.length === 0) return false
    if (isAllSelected.value) return false
    return processedData.value.some((item) => selectedSet.value.has(item))
  })

  const pHasSelection = computed(() => selectedSet.value.size > 0)

  function toggleSelection(item: T) {
    if (selectionType.value === 'single') {
      const newSelected = selectedSet.value.has(item) ? [] : [item]
      emitChange(newSelected)
      return
    }

    if (selectionType.value === 'multiple') {
      const newSelected = [...selected.value]
      const index = newSelected.indexOf(item) // Note: simple reference check

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
      const toRemove = new Set(processedData.value)
      const newSelected = selected.value.filter((item) => !toRemove.has(item))
      emitChange(newSelected)
    } else {
      // Select all processed items that aren't already selected
      const toAdd = processedData.value.filter((item) => !selectedSet.value.has(item))
      const newSelected = [...selected.value, ...toAdd]
      emitChange(newSelected)
    }
  }

  return {
    selectedSet,
    isAllSelected,
    isIndeterminate,
    hasSelection: pHasSelection,
    toggleSelection,
    toggleSelectAll,
  }
}
