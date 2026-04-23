import { ref, computed, type Ref } from 'vue'
import type { FilterValue, Column } from '../../../types'
import { getLocalDateString, formatDate as sharedFormatDate } from '../../../utils/date'
import { smartFuzzyMatch } from '../../../utils/fuzzy'

export function useTableData<T>(
  columns: Ref<Column<T>[]>,
  data: Ref<T[]>,
  pagination: Ref<boolean>,
  itemsPerPage: Ref<number>,
) {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const currentPage = ref(1)

  // Sorting
  const defaultCol = columns.value.find((c) => c.defaultSort)
  const currentSortColumn = ref<string | null>(defaultCol ? String(defaultCol.key) : null)
  const currentSortDirection = ref<'asc' | 'desc' | null>(
    defaultCol ? defaultCol.defaultSort! : null,
  )

  // Filtering
  const activeFilters = ref<Record<string, { value: unknown; operator: string }>>({})
  const openFilterColumn = ref<string | null>(null)

  /* -------------------------------------------------------------------------- */
  /*                                    LOGIC                                   */
  /* -------------------------------------------------------------------------- */

  function getSafeValue(item: T, key: string): unknown {
    if (!key.includes('.')) return (item as Record<string, unknown>)[key]
    return key.split('.').reduce<unknown>(
      (obj, part) => (obj as Record<string, unknown>)?.[part],
      item,
    )
  }

  // 1. Process Data (Filter & Sort)
  const processedData = computed(() => {
    let result = [...data.value]

    // A. Filtering
    if (Object.keys(activeFilters.value).length > 0) {
      result = result.filter((item) => {
        return Object.entries(activeFilters.value).every(([key, filter]) => {
          const rowValue = getSafeValue(item, key)
          const filterVal = filter.value

          if (filterVal === null || filterVal === undefined || filterVal === '') return true

          // Handle Array (Select)
          if (Array.isArray(filterVal)) {
            if (filterVal.length === 0) return true
            // Support both string and number comparison for select options
            return filterVal.some((v) => String(v) === String(rowValue))
          }

          const numRow = Number(rowValue)
          const numFilter = Number(filterVal)
          const isNumericComparison = !isNaN(numRow) && !isNaN(numFilter) && typeof rowValue !== 'boolean'

          const itemStr =
            rowValue !== null && rowValue !== undefined ? String(rowValue).toLowerCase() : ''
          const filterStr = String(filterVal).toLowerCase()

          switch (filter.operator) {
            case 'equals':
              if (
                filter.operator === 'equals' &&
                (rowValue instanceof Date ||
                  (typeof rowValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rowValue)))
              ) {
                return getLocalDateString(rowValue) === filterVal
              }
              if (isNumericComparison) return numRow === numFilter
              return itemStr === filterStr
            case 'startsWith':
              return itemStr.startsWith(filterStr)
            case 'endsWith':
              return itemStr.endsWith(filterStr)
            case 'gt':
              return numRow > numFilter
            case 'lt':
              return numRow < numFilter
            case 'gte':
              return numRow >= numFilter
            case 'lte':
              return numRow <= numFilter
            case 'before': {
              const rowDate = getLocalDateString(rowValue)
              return rowDate !== '' && rowDate < (filterVal as string)
            }
            case 'after': {
              const rowDate = getLocalDateString(rowValue)
              return rowDate !== '' && rowDate > (filterVal as string)
            }
            case 'contains':
            default:
              return !!smartFuzzyMatch(String(filterVal), String(rowValue ?? ''))
          }
        })
      })
    }

    // B. Sorting
    if (currentSortColumn.value && currentSortDirection.value) {
      result.sort((a, b) => {
        const colKey = currentSortColumn.value as string
        const valA = getSafeValue(a, colKey)
        const valB = getSafeValue(b, colKey)

        const numA = Number(valA)
        const numB = Number(valB)

        if (!isNaN(numA) && !isNaN(numB)) {
          return currentSortDirection.value === 'asc' ? numA - numB : numB - numA
        }

        const strA = String(valA ?? '')
        const strB = String(valB ?? '')

        if (strA > strB) return currentSortDirection.value === 'asc' ? 1 : -1
        if (strA < strB) return currentSortDirection.value === 'asc' ? -1 : 1
        return 0
      })
    }

    return result
  })

  // Pagination Helper
  const totalPages = computed(() => Math.ceil(processedData.value.length / itemsPerPage.value))

  const displayedData = computed(() => {
    const source = processedData.value

    if (pagination.value) {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return source.slice(start, end)
    }

    return source
  })

  // ACTIONS

  function handleSort(columnKey: string, sortable: boolean) {
    if (!sortable) return

    if (currentSortColumn.value !== columnKey) {
      currentSortColumn.value = columnKey
      currentSortDirection.value = 'asc'
    } else if (currentSortDirection.value === 'asc') {
      currentSortDirection.value = 'desc'
    } else {
      currentSortColumn.value = null
      currentSortDirection.value = null
    }
  }

  function setSort(column: string | null, direction: 'asc' | 'desc' | null) {
    currentSortColumn.value = column
    currentSortDirection.value = direction
  }

  function toggleFilter(columnKey: string) {
    if (openFilterColumn.value === columnKey) {
      openFilterColumn.value = null
    } else {
      openFilterColumn.value = columnKey
    }
  }

  function applyFilter(columnKey: string, filterValue: FilterValue) {
    if (filterValue.value === null || filterValue.value === undefined || filterValue.value === '') {
      const newFilters = { ...activeFilters.value }
      delete newFilters[columnKey]
      activeFilters.value = newFilters
    } else {
      activeFilters.value = {
        ...activeFilters.value,
        [columnKey]: filterValue as { value: unknown; operator: string },
      }
    }
    openFilterColumn.value = null
  }

  function clearFilter(columnKey: string) {
    const newFilters = { ...activeFilters.value }
    delete newFilters[columnKey]
    activeFilters.value = newFilters
    openFilterColumn.value = null
  }

  function prevPage() {
    if (currentPage.value > 1) currentPage.value--
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  // Format Helper
  function formatDate(value: unknown, format: string = 'iso'): string {
    return sharedFormatDate(value, format)
  }

  return {
    currentPage,
    totalPages,
    currentSortColumn,
    currentSortDirection,
    activeFilters,
    openFilterColumn,
    processedData,
    displayedData,

    // Methods
    handleSort,
    setSort,
    toggleFilter,
    applyFilter,
    clearFilter,
    prevPage,
    nextPage,
    formatDate,
  }
}
