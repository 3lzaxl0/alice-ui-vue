<script setup lang="ts" generic="T">
import { ref } from 'vue'
import { Maximize2, Minimize2, Download, MoreVertical } from 'lucide-vue-next'
import TableVariantsMenu from './TableVariantsMenu.vue'
import AliceButton from '../Button/Button.vue'
import AlicePopover from '../Popover/Popover.vue'
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
  isExporting?: boolean
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

const mobileMenuOpen = ref(false)
</script>

<template>
  <div
    class="flex border-b border-gray-100 dark:border-slate-700 shrink-0 relative rounded-t-xl"
    :class="[hasSelection ? 'bg-primary-50/80 dark:bg-primary-900/40' : 'bg-white dark:bg-transparent']"
  >
    <transition name="alice-zoom" mode="out-in">
      <!-- Selection Mode Toolbar -->
      <div
        v-if="hasSelection"
        key="selection"
        class="flex w-full items-center justify-between px-4 py-3 min-h-[60px]"
      >
        <div class="text-sm font-bold text-primary-700 dark:text-primary-300">
          {{ selectedCount }} seleccionados
        </div>

        <div class="flex items-center gap-2 min-h-9">
          <slot name="selection-actions" />

          <div class="w-px h-5 bg-primary-200/50 dark:bg-primary-800/50 mx-1"></div>

          <AliceButton
            variant="primary" design="ghost-subtle"
            size="icon"
            class="hover:text-primary-600 hover:bg-white/50 dark:hover:bg-black/20"
            @click="emit('toggle-fullscreen')"
            :title="isFullscreen ? 'Restaurar' : 'Maximizar'"
            :icon="isFullscreen ? Minimize2 : Maximize2"
          />
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

        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Custom Actions (e.g. "Nuevo Registro") on Desktop -->
          <div class="hidden sm:flex items-center gap-2">
            <slot name="toolbar-actions" />
          </div>

          <!-- Divider (Desktop only, if toolbar-actions has content) -->
          <div v-if="$slots['toolbar-actions']" class="hidden sm:block w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1" />

          <!-- Mobile Custom Actions Overflow -->
          <div v-if="$slots['toolbar-actions']" class="sm:hidden flex items-center">
            <AlicePopover v-model="mobileMenuOpen" placement="bottom-right">
              <template #trigger>
                <AliceButton
                  variant="primary" design="ghost-subtle"
                  size="icon"
                  class="hover:bg-gray-100 dark:hover:bg-slate-800"
                  :icon="MoreVertical"
                />
              </template>
              <template #default>
                <div class="flex flex-col min-w-[200px] p-1 gap-1">
                  <!-- Injected custom actions in mobile -->
                  <div class="flex flex-col gap-1 px-2 py-1" @click="mobileMenuOpen = false">
                    <slot name="toolbar-actions" />
                  </div>
                </div>
              </template>
            </AlicePopover>
            
            <!-- Mobile Divider -->
            <div class="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1" />
          </div>

          <!-- Variants Menu (Always Visible) -->
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
            variant="primary" design="ghost-subtle"
            size="icon"
            class="hover:text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20"
            @click="emit('export')"
            title="Exportar a Excel"
            :icon="Download"
            :loading="isExporting"
            :disabled="isExporting"
          />

          <AliceButton
            variant="primary" design="ghost-subtle"
            size="icon"
            class="hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            @click="emit('toggle-fullscreen')"
            :title="isFullscreen ? 'Restaurar' : 'Maximizar'"
            :icon="isFullscreen ? Minimize2 : Maximize2"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
