<script setup lang="ts" generic="T">
import { Maximize2, Minimize2, Download } from 'lucide-vue-next'
import TableVariantsMenu from './TableVariantsMenu.vue'
import AliceButton from '../Button/Button.vue'
import type { Column, TableVariant } from '../../types'

defineOptions({
  name: 'AliceTableToolbar',
})

defineProps<{
  hasSelection: boolean
  selectedCount: number
  dataCount: number
  isFullscreen: boolean
  hideVariants: boolean
  hideShadow?: boolean
  tableId?: string
  columns: Column<T>[]
  hiddenColumns: Set<string>
  allVariants: TableVariant[]
  activeVariantName: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle-fullscreen'): void
  (e: 'export'): void
  (e: 'reset-to-default'): void
  (e: 'toggle-column', key: string, visible: boolean): void
  (e: 'save-variant', name: string): void
  (e: 'update-active-variant'): void
  (e: 'delete-variant', name: string): void
  (e: 'apply-variant', variant: TableVariant): void
  (e: 'save-state'): void
}>()
</script>

<template>
  <div
    class="flex border-b border-gray-100 dark:border-slate-700 shrink-0 relative rounded-t-xl"
    :class="[hasSelection ? 'bg-blue-50/80 dark:bg-blue-900/40' : 'bg-white dark:bg-transparent']"
  >
    <transition name="alice-zoom" mode="out-in">
      <!-- Selection Mode Toolbar -->
      <div
        v-if="hasSelection"
        key="selection"
        class="flex w-full items-center justify-between px-4 py-3 min-h-[60px]"
      >
        <div class="text-sm font-bold text-blue-700 dark:text-blue-300">
          {{ selectedCount }} seleccionados
        </div>

        <div class="flex items-center gap-2 min-h-9">
          <slot name="selection-actions" />
        </div>
      </div>

      <!-- Normal Mode Toolbar -->
      <div
        v-else
        key="normal"
        class="flex w-full items-center justify-between px-4 py-3 min-h-[60px]"
      >
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ dataCount }} registros
        </div>

        <div class="flex items-center gap-2">
          <!-- Custom Actions (e.g. "Nuevo Registro") -->
          <slot name="toolbar-actions" />

          <!-- Divider (only if toolbar-actions has content) -->
          <div v-if="$slots['toolbar-actions']" class="w-px h-5 bg-gray-200 dark:bg-slate-700" />

          <!-- Variants Menu (Decoupled) -->
          <TableVariantsMenu
            v-if="!hideVariants"
            :table-id="tableId"
            :columns="columns"
            :hidden-columns="hiddenColumns"
            :all-variants="allVariants"
            :active-variant-name="activeVariantName"
            @reset-to-default="emit('reset-to-default')"
            @toggle-column="(key, visible) => emit('toggle-column', key, visible)"
            @save-variant="(name) => emit('save-variant', name)"
            @update-active-variant="emit('update-active-variant')"
            @delete-variant="(name) => emit('delete-variant', name)"
            @apply-variant="(variant) => emit('apply-variant', variant)"
            @save-state="emit('save-state')"
          />

          <AliceButton
            variant="ghost-subtle"
            size="icon"
            class="hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            @click="emit('export')"
            title="Exportar a Excel"
            :icon="Download"
          />
          <AliceButton
            variant="ghost-subtle"
            size="icon"
            class="hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            @click="emit('toggle-fullscreen')"
            :title="isFullscreen ? 'Restaurar' : 'Maximizar'"
            :icon="isFullscreen ? Minimize2 : Maximize2"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
