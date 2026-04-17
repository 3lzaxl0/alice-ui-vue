<script setup lang="ts" generic="T">
import { ref, computed, watch } from 'vue'
import AlicePopover from '../../components/Popover/Popover.vue'
import type { Column } from '../../types'
import { formatCurrency } from '../../utils/currency'

defineOptions({ name: 'AliceTableFooter' })

type FooterOp = 'sum' | 'avg' | 'count' | 'min' | 'max'

const OPTIONS: { op: FooterOp; label: string; icon: string }[] = [
  { op: 'sum', label: 'Suma', icon: 'Σ' },
  { op: 'avg', label: 'Promedio', icon: 'x̄' },
  { op: 'count', label: 'Conteo', icon: '#' },
  { op: 'min', label: 'Mínimo', icon: '↓' },
  { op: 'max', label: 'Máximo', icon: '↑' },
]

const SHORT_LABELS: Record<FooterOp, string> = {
  sum: 'Σ Suma',
  avg: 'x̄ Prom',
  count: '# Total',
  min: '↓ Mín',
  max: '↑ Máx',
}

const props = defineProps<{
  visibleColumns: Column<T>[]
  processedData: T[]
  selectionType: 'none' | 'single' | 'multiple'
  stickyOffsets: Record<string, string>
  stickyRightOffsets: Record<string, string>
  columnWidths: Record<string, string>
  showDividers: boolean
}>()

const footerOperations = defineModel<Record<string, string>>('footerOperations', {
  default: () => ({}),
})

watch(
  () => props.visibleColumns,
  (cols) => {
    for (const col of cols) {
      const key = String(col.key)
      if (col.footer && !(key in footerOperations.value)) {
        footerOperations.value[key] = col.footer
      }
    }
  },
  { immediate: true },
)

const hasFooter = computed(() =>
  props.visibleColumns.some((col) => footerOperations.value[String(col.key)]),
)

const openMenu = ref<string | null>(null)

function getActiveOp(col: Column<T>): FooterOp | null {
  const key = String(col.key)
  return (footerOperations.value[key] as FooterOp) || null
}

function selectOp(col: Column<T>, op: FooterOp) {
  const next = { ...footerOperations.value }
  next[String(col.key)] = op
  footerOperations.value = next
  openMenu.value = null
}

function getNumericValues(key: string | number | symbol): number[] {
  return props.processedData
    .map((item) => Number((item as Record<string | number | symbol, unknown>)[key]))
    .filter((v) => !isNaN(v))
}

function computeAggregate(col: Column<T>): string {
  const op = getActiveOp(col)
  if (!op) return ''

  const values = getNumericValues(col.key)
  if (values.length === 0) return '—'

  let result: number
  switch (op) {
    case 'sum':
      result = values.reduce((a, b) => a + b, 0)
      break
    case 'avg':
      result = values.reduce((a, b) => a + b, 0) / values.length
      break
    case 'count':
      return String(values.length)
    case 'min':
      result = Math.min(...values)
      break
    case 'max':
      result = Math.max(...values)
      break
    default:
      return ''
  }

  if (col.type === 'currency') {
    return formatCurrency(result, col.currencyCode)
  }

  return result % 1 === 0
    ? result.toLocaleString('es-PE')
    : result.toLocaleString('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}
</script>

<template>
  <tfoot v-if="hasFooter" class="sticky bottom-0 z-40">
    <tr>
      <!-- Selection spacer -->
      <td v-if="selectionType !== 'none'"
        class="bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-t-2 border-gray-200 dark:border-slate-600 px-6 py-2.5 sticky left-0 z-50" />

      <td v-for="col in visibleColumns" :key="String(col.key)"
        class="bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-t-2 border-gray-200 dark:border-slate-600 px-6 py-2.5 relative"
        :class="[
          showDividers ? 'border-r border-gray-100 dark:border-slate-700 last:border-r-0' : '',
        ]" :style="{
          position: col.frozen || col.frozenRight ? 'sticky' : undefined,
          left: col.frozen ? stickyOffsets[String(col.key)] : undefined,
          right: col.frozenRight ? stickyRightOffsets[String(col.key)] : undefined,
          zIndex: col.frozen || col.frozenRight ? 50 : undefined,
          width: columnWidths[String(col.key)] || col.width,
          minWidth: col.minWidth,
          maxWidth: col.maxWidth,
          overflow: 'hidden',
        }">
        <!-- Clickable footer cell with Popover -->
        <AlicePopover v-if="getActiveOp(col)" :model-value="openMenu === String(col.key)"
          @update:model-value="(val: boolean) => openMenu = val ? String(col.key) : null" 
          teleport placement="top-center" :offset="4"
          content-class="mb-1 py-1 min-w-[140px] origin-bottom">
          <template #trigger>
            <div class="flex items-center gap-2 cursor-pointer select-none group/footer" :class="{
              'justify-center': col.align === 'center',
              'justify-end': col.align === 'right',
            }">
              <!-- Operation badge -->
              <span class="text-[9px] leading-none font-bold px-1.5 py-0.5 rounded border transition-colors whitespace-nowrap"
                :class="openMenu === String(col.key)
                  ? 'border-primary-400 dark:border-primary-500 bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-300'
                  : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 group-hover/footer:border-primary-300 group-hover/footer:text-primary-500'
                ">
                {{ SHORT_LABELS[getActiveOp(col)!] }}
              </span>

              <!-- Value -->
              <span class="text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-200">
                {{ computeAggregate(col) }}
              </span>
            </div>
          </template>

          <button v-for="opt in OPTIONS" :key="opt.op"
            class="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 transition-colors" :class="getActiveOp(col) === opt.op
              ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 font-semibold'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            " @click.stop="selectOp(col, opt.op)">
            <span class="w-4 text-center font-bold text-[11px]">{{ opt.icon }}</span>
            <span>{{ opt.label }}</span>
          </button>
        </AlicePopover>
      </td>
    </tr>
  </tfoot>
</template>
