<script setup lang="ts" generic="T">
import { ScrollText, X } from 'lucide-vue-next'
import { ref } from 'vue'
import AliceCheckbox from '../../components/Checkbox/Checkbox.vue'
import AliceRadio from '../../components/Radio/Radio.vue'
import AliceBadge from '../../components/Badge/Badge.vue'
import AliceTooltip from '../../components/Tooltip/Tooltip.vue'
import AlicePopover from '../../components/Popover/Popover.vue'
import AliceButton from '../../components/Button/Button.vue'
import AliceDialog from '../../components/Dialog/Dialog.vue'
import AliceImagePreview from '../../components/ImagePreview/ImagePreview.vue'
import AliceImage from '../../components/Image/Image.vue'
import AliceText from '../../components/Text/Text.vue'
import TableCellText from './TableCellText.vue'
import { tableVariants } from './Table.variants'
import type { Column } from '../../types'
import { formatDate as sharedFormatDate } from '../../utils/date'
import { formatCurrency as sharedFormatCurrency } from '../../utils/currency'

defineOptions({
  name: 'AliceTableRow',
})

defineProps<{
  item: T
  index: number
  globalIndex: number
  visibleColumns: Column<T>[]
  selectionType: 'none' | 'single' | 'multiple'
  isSelected: boolean
  striped: boolean
  rowHeight: number
  stickyOffsets: Record<string, string>
  stickyRightOffsets: Record<string, string>
  columnWidths: Record<string, string>
  draggingColumnKey: string | null
  showDividers: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-selection', item: T): void
  (e: 'selection-drag-start', item: T): void
  (e: 'selection-drag-hover', item: T): void
}>()

// Formatters
function formatDate(value: unknown, format: string) {
  return sharedFormatDate(value, format)
}

function formatCurrency(value: unknown, currencyCode?: string) {
  return sharedFormatCurrency(Number(value || 0), currencyCode)
}

function getSafeValue(item: T, key: string | number | symbol): unknown {
  if (typeof key !== 'string') return (item as Record<string | number | symbol, unknown>)[key]
  if (!key.includes('.')) return (item as Record<string, unknown>)[key]
  return key.split('.').reduce<unknown>((obj, part) => (obj as Record<string, unknown>)?.[part], item)
}

// Helpers for label and variant resolution
function resolveLabel(col: Column<T>, item: T): string {
  const rawValue = getSafeValue(item, col.key)
  if (col.formatter) return col.formatter(rawValue, item)
  return String(rawValue ?? '')
}

function resolveVariant(col: Column<T>, item: T): string {
  if (col.variant) return col.variant
  if (!col.variantMap) return 'default'

  const rawValue = getSafeValue(item, col.key)
  const strRawValue = String(rawValue)

  // 1. Try raw value match (current behavior)
  if (strRawValue in col.variantMap) {
    return col.variantMap[strRawValue] as string
  }

  // 2. Try formatted value match (new behavior for derived statuses)
  if (col.formatter) {
    const formattedValue = col.formatter(rawValue, item)
    if (formattedValue in col.variantMap) {
      return col.variantMap[formattedValue] as string
    }
  }

  return 'default'
}

// Expand dialog state for maxLength truncation
const expandDialogVisible = ref(false)
const expandDialogTitle = ref('')
const expandDialogContent = ref('')

// Image preview state
const previewImageVisible = ref(false)
const previewImageUrl = ref('')
const previewImageTitle = ref('')

function openExpandDialog(title: string, content: string) {
  expandDialogTitle.value = title
  expandDialogContent.value = content
  expandDialogVisible.value = true
}

function openImagePreview(url: string, title?: string) {
  previewImageUrl.value = url
  previewImageTitle.value = title || 'Vista Previa'
  previewImageVisible.value = true
}


</script>

<template>
  <tr :class="tableVariants.row({
    selected: isSelected,
    striped: striped,
    isEvenIndex: globalIndex % 2 === 0,
  })
    " :style="{ height: rowHeight + 'px' }">
    <!-- Selection Cell -->
    <td v-if="selectionType !== 'none'" key="selection-cell" :class="tableVariants.cell({
      frozen: true,
      selected: isSelected,
      striped: striped,
      isEvenIndex: globalIndex % 2 === 0,
    })
      " class="text-center left-0 p-0" :style="{ height: rowHeight + 'px' }"
      @mousedown.prevent="emit('selection-drag-start', item)" @mouseenter="emit('selection-drag-hover', item)">
      <div class="px-3 flex items-center justify-center h-full">
        <AliceCheckbox v-if="selectionType === 'multiple'" :model-value="isSelected" class="pointer-events-none" />
        <AliceRadio v-else-if="selectionType === 'single'" :model-value="isSelected" class="pointer-events-none" />
      </div>
    </td>

    <td v-for="col in visibleColumns" :key="String(col.key)" :class="tableVariants.cell({
      frozen: !!col.frozen,
      frozenRight: !!col.frozenRight,
      selected: isSelected,
      striped: striped,
      isEvenIndex: globalIndex % 2 === 0,
      dragging: draggingColumnKey === String(col.key),
      divided: showDividers,
    })
      " class="p-0" :style="{
        left: col.frozen ? stickyOffsets[String(col.key)] : undefined,
        right: col.frozenRight ? stickyRightOffsets[String(col.key)] : undefined,
        width: columnWidths[String(col.key)] || col.width,
        minWidth: col.minWidth,
        maxWidth: col.maxWidth,
        height: rowHeight + 'px',
        overflow: 'hidden',
      }" :data-col-key="String(col.key)">
      <div class="px-3 flex items-center h-full" :class="{
        'justify-center': col.align === 'center',
        'justify-end': col.align === 'right',
      }">
        <slot :name="`cell-${String(col.key)}`" :item="item" :col="col">
          <div class="flex items-center gap-2.5 w-full min-w-0" :class="{
            'justify-center': col.align === 'center',
            'justify-end': col.align === 'right',
          }">
            <!-- Native Image Support -->
            <div v-if="col.imageKey"
              class="shrink-0 border border-slate-200 dark:border-white/10 shadow-xs bg-slate-100 dark:bg-slate-800 overflow-hidden"
              :class="[
                col.imageConfig?.rounded === 'full' ? 'rounded-full' :
                  col.imageConfig?.rounded === 'sm' ? 'rounded-sm' :
                    col.imageConfig?.rounded === 'lg' ? 'rounded-xl' : 'rounded-lg',
                col.imageConfig?.preview !== false ? 'cursor-zoom-in' : ''
              ]" :style="{
                width: (col.imageConfig?.size || 40) + 'px',
                height: (col.imageConfig?.size || 40) + 'px',
              }"
              @click.stop="col.imageConfig?.preview !== false && getSafeValue(item, col.imageKey) ? openImagePreview(String(getSafeValue(item, col.imageKey)), col.header) : null">
              <AliceImage :src="String(getSafeValue(item, col.imageKey) || '')"
                :object-fit="col.imageConfig?.objectFit || 'cover'" />
            </div>

            <!-- Content Container (Text logic) -->
            <div class="flex-1 min-w-0 flex flex-col justify-center" :class="{
              'items-center text-center': col.align === 'center',
              'items-end text-right': col.align === 'right',
              'items-start text-left': col.align === 'left' || !col.align
            }">
              <!-- Hide Zero Logic -->
              <template
                v-if="col.hideZero && (getSafeValue(item, col.key) === 0 || getSafeValue(item, col.key) === '0')">
                <span></span>
              </template>

              <!-- Status/Variant Logic -->
              <template v-else-if="col.variant || col.variantMap">
                <AliceTooltip v-if="col.tooltipFormatter && col.tooltipFormatter(getSafeValue(item, col.key), item)"
                  :content="col.tooltipFormatter(getSafeValue(item, col.key), item)" position="top">
                  <AliceBadge :label="resolveLabel(col, item)" :variant="resolveVariant(col, item) as any"
                    :type="col.badgeType || 'soft'" />
                </AliceTooltip>

                <AliceBadge v-else :label="resolveLabel(col, item)" :variant="resolveVariant(col, item) as any"
                  :type="col.badgeType || 'soft'" />
              </template>

              <!-- Date Formatting -->
              <span v-else-if="col.dateFormat" class="whitespace-nowrap">
                {{ formatDate(getSafeValue(item, col.key), col.dateFormat) }}
              </span>

              <!-- Currency Formatting -->
              <span v-else-if="col.type === 'currency'" class="font-mono whitespace-nowrap">
                {{ formatCurrency(getSafeValue(item, col.key), col.currencyCode) }}
              </span>

              <!-- Numeric + Unit -->
              <div v-else-if="col.unitKey" class="flex items-center gap-1.5" :class="{
                'justify-center': col.align === 'center',
                'justify-end': col.align === 'right',
              }">
                <AliceText variant="caption" weight="bold" class="tabular-nums">
                  {{ getSafeValue(item, col.key) }}
                </AliceText>
                <AliceBadge :label="String(getSafeValue(item, col.unitKey))" type="soft" />
              </div>

              <!-- Special Type: Tags -->
              <div v-else-if="(col.type as any) === 'tags'" class="flex" :class="{
                'justify-center': col.align === 'center',
                'justify-end': col.align === 'right',
              }">
                <AlicePopover placement="bottom-left" :close-on-click="false">
                  <template #trigger>
                    <AliceButton variant="primary" size="sm" :icon="ScrollText" :icon-size="12">
                      {{ Array.isArray(getSafeValue(item, col.key)) ? (getSafeValue(item, col.key) as unknown[]).length
                      : 0 }}
                    </AliceButton>
                  </template>
                  <template #default="{ close }">
                    <div class="flex flex-col gap-3 min-w-[220px] max-w-xs p-3">
                      <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700">
                        <AliceText variant="label" color="muted">Detalle</AliceText>
                        <AliceButton variant="error" design="ghost-subtle" size="icon-sm" :icon="X" :icon-size="14" @click="close" />
                      </div>
                      <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        <AliceBadge v-for="(tag, idx) in getSafeValue(item, col.key) as unknown[]" :key="idx"
                          :label="String(tag)" variant="info" type="soft" />
                      </div>
                    </div>
                  </template>
                </AlicePopover>
              </div>
              <TableCellText v-else :text="String(resolveLabel(col, item))" :header="col.header"
                @expand="openExpandDialog" />
            </div>
          </div>
        </slot>
      </div>
    </td>
  </tr>

  <!-- Expand Dialog -->
  <AliceDialog v-model:show="expandDialogVisible" :title="expandDialogTitle" hide-footer>
    <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap wrap-break-word">
      {{ expandDialogContent }}
    </p>
  </AliceDialog>

  <!-- Image Preview Dialog -->
  <AliceImagePreview v-model:show="previewImageVisible" :src="previewImageUrl" :title="previewImageTitle" />
</template>
