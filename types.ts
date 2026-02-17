export type FilterType = 'text' | 'number' | 'date' | 'select' | 'tags'

export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterValue {
  operator?: string
  value: unknown
}

export interface TableState {
  columnWidths: Record<string, string>
  orderedColumnKeys: string[]
  hiddenColumns: string[]
}

export interface TableVariant {
  name: string
  label: string
  state: TableState
  isPreset?: boolean
}

export interface Column<T> {
  header: string
  key: keyof T | string
  width?: string
  minWidth?: string
  maxWidth?: string
  sortable?: boolean
  filterable?: boolean
  frozen?: boolean // Sticky column
  hidden?: boolean // New: Toggle visibility
  type?: FilterType
  filterOptions?: FilterOption[] // For 'select' type
  render?: (item: T) => unknown // Optional custom render function (if not using slots)
  formatter?: (value: unknown) => string // Custom formatter
  variantMap?: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default' | string>
  badgeType?: 'normal' | 'filled' | 'soft'
  // Advanced Formatting
  unitKey?: keyof T | string // Key for unit of measure
  dateFormat?: 'iso' | 'full' | 'short' | 'raw' | 'datetime'
  align?: 'left' | 'center' | 'right'
}

export interface SortState {
  column: string | null
  direction: 'asc' | 'desc' | null
}
