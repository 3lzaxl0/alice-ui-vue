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
  footerOperations?: Record<string, string>
  activeVariantName?: string | null
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
  defaultSort?: 'asc' | 'desc'
  filterable?: boolean
  frozen?: boolean // Sticky column
  hidden?: boolean // New: Toggle visibility
  hideFromMenu?: boolean // Hide from the column variants menu
  isKey?: boolean // Mark as primary key (or part of composite PK) for selection persistence
  type?: FilterType
  filterOptions?: FilterOption[] // For 'select' type
  render?: (item: T) => unknown // Optional custom render function (if not using slots)
  formatter?: (value: unknown) => string // Custom formatter
  variantMap?: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default' | string>
  badgeType?: 'normal' | 'filled' | 'soft'
  // Advanced Formatting
  unitKey?: keyof T | string // Key for unit of measure
  dateFormat?: 'iso' | 'full' | 'short' | 'raw' | 'datetime' | 'timestamp'
  align?: 'left' | 'center' | 'right'
  // Text Truncation: truncate text at this many characters and show a "Ver más" link
  maxLength?: number
  // Footer Aggregation
  footer?: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

export interface SortState {
  column: string | null
  direction: 'asc' | 'desc' | null
}
