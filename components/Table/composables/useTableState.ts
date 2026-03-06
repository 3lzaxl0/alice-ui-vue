import { ref, watch, onMounted, computed, type Ref } from 'vue'
import type { TableVariant, TableState, Column } from '../../../types'

export function useTableState<T>(
  tableId: Ref<string | undefined>,
  columnWidths: Ref<Record<string, string>>,
  orderedColumnKeys: Ref<string[]>,
  hiddenColumns: Ref<Set<string>>,
  footerOperations: Ref<Record<string, string>>,
  variants: Ref<TableVariant[]> = ref([]),
  columns: Ref<Column<T>[]>, // New dependency
) {
  const isReady = ref(false)
  const userVariants = ref<TableVariant[]>([])
  const activeVariantName = ref<string | null>(null)

  // Computed list of all available variants (Presets + User Saved)
  const allVariants = computed(() => {
    // Presets first, then user variants
    const presets = variants.value.map((v) => ({ ...v, isPreset: true }))
    return [...presets, ...userVariants.value]
  })

  // Reset to default (Props-based)
  function resetToDefault() {
    // Restore directly from current columns prop (handles async loaded columns)
    const cols = columns.value

    // Reset widths
    const newWidths: Record<string, string> = {}
    cols.forEach((c) => {
      if (c.width) newWidths[String(c.key)] = c.width
    })
    columnWidths.value = newWidths

    // Reset order
    orderedColumnKeys.value = cols.map((c) => String(c.key))

    // Reset hidden
    hiddenColumns.value = new Set(cols.filter((c) => c.hidden).map((c) => String(c.key)))

    // Reset footers
    const newFooters: Record<string, string> = {}
    cols.forEach((c) => {
      if (c.footer) newFooters[String(c.key)] = c.footer
    })
    footerOperations.value = newFooters

    activeVariantName.value = null
    saveState()
  }

  // Load state from local storage
  function loadState() {
    if (!tableId.value) return

    // 1. Load Last Valid State (Current View)
    const key = `alice-table-state-${tableId.value}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const state = JSON.parse(saved) as TableState
        restoreState(state)
      } catch (e) {
        console.error('AliceTable: Failed to load state', e)
      }
    }

    // 2. Load User Saved Variants
    const variantsKey = `alice-table-variants-${tableId.value}`
    const savedVariants = localStorage.getItem(variantsKey)
    if (savedVariants) {
      try {
        userVariants.value = JSON.parse(savedVariants)
      } catch (e) {
        console.error('AliceTable: Failed to load variants', e)
      }
    }
  }

  function restoreState(state: TableState) {
    // Restore widths
    if (state.columnWidths) {
      columnWidths.value = { ...state.columnWidths }
    }

    // Restore order
    if (state.orderedColumnKeys && Array.isArray(state.orderedColumnKeys)) {
      orderedColumnKeys.value = [...state.orderedColumnKeys]
    }

    // Restore hidden
    if (state.hiddenColumns && Array.isArray(state.hiddenColumns)) {
      hiddenColumns.value = new Set(state.hiddenColumns)
    }

    // Restore footers
    const newFooters: Record<string, string> = {}
    columns.value.forEach((c) => {
      if (c.footer) newFooters[String(c.key)] = c.footer
    })

    if (state.footerOperations) {
      Object.assign(newFooters, state.footerOperations)
    }
    footerOperations.value = newFooters

    // Restore active variant
    if (state.activeVariantName !== undefined) {
      activeVariantName.value = state.activeVariantName
    }
  }

  // Save state to local storage (Current View)
  function saveState() {
    if (!tableId.value) return

    const state: TableState = {
      columnWidths: columnWidths.value,
      orderedColumnKeys: orderedColumnKeys.value,
      hiddenColumns: Array.from(hiddenColumns.value),
      footerOperations: { ...footerOperations.value },
      activeVariantName: activeVariantName.value,
    }

    const key = `alice-table-state-${tableId.value}`
    localStorage.setItem(key, JSON.stringify(state))
  }

  // Save current state as a new variant
  function saveVariant(name: string) {
    if (!tableId.value) return

    const currentState: TableState = {
      columnWidths: { ...columnWidths.value },
      orderedColumnKeys: [...orderedColumnKeys.value],
      hiddenColumns: Array.from(hiddenColumns.value),
      footerOperations: { ...footerOperations.value },
    }

    const variantName = name.toLowerCase().replace(/\s+/g, '-')
    const newVariant: TableVariant = {
      name: variantName,
      label: name,
      state: currentState,
      isPreset: false,
    }

    // Update or Add
    const docIndex = userVariants.value.findIndex((v) => v.name === variantName)
    if (docIndex >= 0) {
      userVariants.value[docIndex] = newVariant
    } else {
      userVariants.value.push(newVariant)
    }

    activeVariantName.value = variantName
    persistVariants()
  }

  function persistVariants() {
    if (!tableId.value) return
    const variantsKey = `alice-table-variants-${tableId.value}`
    localStorage.setItem(variantsKey, JSON.stringify(userVariants.value))
  }

  function deleteVariant(variantName: string) {
    if (!tableId.value) return

    userVariants.value = userVariants.value.filter((v) => v.name !== variantName)
    if (activeVariantName.value === variantName) {
      activeVariantName.value = null
    }

    persistVariants()
  }

  // Auto-save watcher? Or manual save?
  watch(
    [columnWidths, orderedColumnKeys, hiddenColumns, footerOperations, activeVariantName],
    () => {
      // Debounce could be good, but for now direct save
      if (isReady.value) {
        saveState()
      }
    },
    { deep: true },
  )

  onMounted(() => {
    if (tableId.value) {
      loadState()
      isReady.value = true
    }
  })

  // Method to apply a specific variant
  function applyVariant(variant: TableVariant) {
    if (!variant.state) return
    restoreState(variant.state)
    activeVariantName.value = variant.name
    // Auto-save as current state
    saveState()
  }

  return {
    saveState,
    loadState,
    applyVariant, // For Presets and User Variants
    saveVariant, // For User Variants
    deleteVariant,
    resetToDefault,
    userVariants,
    allVariants,
    activeVariantName,
  }
}
