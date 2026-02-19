<script setup lang="ts" generic="T">
import { Package, Eye, X } from 'lucide-vue-next'
import AliceCheckbox from '../../components/Checkbox/Checkbox.vue'
import AliceRadio from '../../components/Radio/Radio.vue'
import AliceBadge from '../../components/Badge/Badge.vue'
import AliceTooltip from '../../components/Tooltip/Tooltip.vue'
import { tableVariants } from './Table.variants'
import type { Column } from '../../types'
import { formatDate as sharedFormatDate } from '../../utils/date'

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
  columnWidths: Record<string, string>
  draggingColumnKey: string | null
  showDividers: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-selection', item: T): void
  (e: 'drag-over', event: DragEvent, key: string): void
  (e: 'drop', event: DragEvent): void
}>()

// Formatters
function formatDate(value: unknown, format: string) {
  return sharedFormatDate(value, format)
}

function getSafeValue(item: T, key: string | number | symbol): unknown {
  return (item as Record<string | number | symbol, unknown>)[key]
}
</script>

<template>
  <transition-group
    name="alice-columns"
    tag="tr"
    :class="
      tableVariants.row({
        selected: isSelected,
        striped: striped,
      })
    "
    :style="{ height: rowHeight + 'px' }"
  >
    <!-- Selection Cell -->
    <td
      v-if="selectionType !== 'none'"
      key="selection-cell"
      :class="[
        tableVariants.cell({
          frozen: true,
          selected: isSelected,
        }),
        // Explicit bg needed: frozen cells use bg-inherit but dark rows are transparent
        isSelected
          ? ''
          : striped
            ? 'odd:dark:bg-slate-950 even:dark:bg-slate-900/50'
            : 'dark:bg-slate-950',
      ]"
      class="text-center left-0 p-0"
      :style="{ height: rowHeight + 'px' }"
      @click.stop="emit('toggle-selection', item)"
    >
      <div class="px-6 flex items-center justify-center h-full">
        <AliceCheckbox
          v-if="selectionType === 'multiple'"
          :model-value="isSelected"
          @update:model-value="emit('toggle-selection', item)"
        />
        <AliceRadio
          v-else-if="selectionType === 'single'"
          :model-value="isSelected"
          @update:model-value="emit('toggle-selection', item)"
        />
      </div>
    </td>

    <td
      v-for="col in visibleColumns"
      :key="String(col.key)"
      :class="
        tableVariants.cell({
          frozen: !!col.frozen,
          selected: isSelected,
          dragging: draggingColumnKey === String(col.key),
          divided: showDividers,
        })
      "
      class="p-0"
      :style="{
        left: col.frozen ? stickyOffsets[String(col.key)] : undefined,
        width: columnWidths[String(col.key)] || col.width,
        minWidth: col.minWidth,
        maxWidth: col.maxWidth,
        height: rowHeight + 'px',
      }"
      @dragover="emit('drag-over', $event, String(col.key))"
      @drop="emit('drop', $event)"
    >
      <div
        class="px-6 flex items-center h-full"
        :class="{
          'justify-center': col.align === 'center',
          'justify-end': col.align === 'right',
        }"
      >
        <slot :name="`cell-${String(col.key)}`" :item="item" :col="col">
          <!-- Status/Variant Logic -->
          <AliceBadge
            v-if="col.variantMap"
            :label="
              col.formatter
                ? col.formatter(getSafeValue(item, col.key))
                : String(getSafeValue(item, col.key))
            "
            :variant="
              (col.variantMap[String(getSafeValue(item, col.key))] as
                | 'default'
                | 'info'
                | 'success'
                | 'warning'
                | 'error') || 'default'
            "
            :type="col.badgeType || 'soft'"
          />

          <!-- Date Formatting -->
          <span v-else-if="col.dateFormat" class="whitespace-nowrap">
            {{ formatDate(getSafeValue(item, col.key), col.dateFormat) }}
          </span>

          <!-- Numeric + Unit -->
          <div v-else-if="col.unitKey" class="flex items-center gap-1.5 w-full">
            <span class="tabular-nums">
              {{ getSafeValue(item, col.key) }}
            </span>
            <span
              class="text-[9px] leading-none font-bold px-1 py-0.5 rounded border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-400 dark:text-gray-500 uppercase tracking-tight"
            >
              {{ getSafeValue(item, col.unitKey) }}
            </span>
          </div>

          <!-- Special Type: Tags (Portable/Mobile friendly) -->
          <div v-else-if="(col.type as any) === 'tags'" class="flex w-full">
            <AliceTooltip trigger="click" max-width="320px">
              <template #trigger>
                <div
                  class="inline-flex items-center gap-2 cursor-pointer group/tags py-1.5 px-3 rounded-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 active:scale-95"
                >
                  <div
                    class="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-extrabold"
                  >
                    <Package :size="14" class="group-hover/tags:rotate-12 transition-transform" />
                    <span class="tabular-nums text-sm">
                      {{
                        Array.isArray(getSafeValue(item, col.key))
                          ? (getSafeValue(item, col.key) as unknown[]).length
                          : 0
                      }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 text-blue-500 dark:text-blue-400/70">
                    <Eye
                      :size="14"
                      class="opacity-70 group-hover/tags:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </template>

              <template #default="{ close }">
                <div class="flex flex-col gap-3 min-w-[200px]">
                  <div
                    class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700"
                  >
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest"
                      >Contenido Detallado</span
                    >
                    <button
                      @click="close"
                      class="p-1 -mr-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X :size="14" />
                    </button>
                  </div>
                  <div
                    class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar"
                  >
                    <AliceBadge
                      v-for="(tag, idx) in getSafeValue(item, col.key) as unknown[]"
                      :key="idx"
                      :label="String(tag)"
                      variant="info"
                      type="soft"
                      class="text-[10px]"
                    />
                  </div>
                </div>
              </template>
            </AliceTooltip>
          </div>

          <!-- Default Text -->
          <span v-else :class="col.align === 'center' || col.align === 'right' ? '' : 'w-full'">
            {{
              col.formatter
                ? col.formatter(getSafeValue(item, col.key))
                : getSafeValue(item, col.key)
            }}
          </span>
        </slot>
      </div>
    </td>
  </transition-group>
</template>
