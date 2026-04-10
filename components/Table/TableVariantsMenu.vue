<script setup lang="ts" generic="T">
import { ref } from 'vue'
import { Layout, Trash2, Save, RotateCcw, RefreshCw, X } from 'lucide-vue-next'
import AlicePopover from '../../components/Popover/Popover.vue'
import AliceCheckbox from '../../components/Checkbox/Checkbox.vue'
import AliceInput from '../../components/Input/Input.vue'
import AliceButton from '../../components/Button/Button.vue'
import type { Column, TableVariant } from '../../types'

defineOptions({
  name: 'AliceTableVariantsMenu',
})

defineProps<{
  tableId?: string
  columns: Column<T>[]
  hiddenColumns: Set<string>
  allVariants: TableVariant[]
  activeVariantName: string | null
}>()

const emit = defineEmits<{
  (e: 'reset-to-default'): void
  (e: 'toggle-column', key: string, visible: boolean): void
  (e: 'save-variant', name: string): void
  (e: 'update-active-variant'): void
  (e: 'delete-variant', name: string): void
  (e: 'apply-variant', variant: TableVariant): void
  (e: 'save-state'): void
}>()

const popoverRef = ref<InstanceType<typeof AlicePopover> | null>(null)
const newVariantName = ref('')

const handleSaveVariant = () => {
  if (!newVariantName.value.trim()) return
  emit('save-variant', newVariantName.value)
  newVariantName.value = ''
}
</script>

<template>
  <AlicePopover ref="popoverRef" placement="bottom-right" :close-onClick="false" mobile-fullscreen teleport>
    <template #trigger>
      <AliceButton
        variant="primary" design="ghost-subtle"
        size="icon"
        class="hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        title="Vistas y Configuración"
        :icon="Layout"
      />
    </template>

    <div class="w-full md:w-72 p-4 flex flex-col gap-4 text-left origin-top-right">
      <!-- Header -->
      <div
        class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700"
      >
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-200"
          >Vistas y Configuración</span
        >

        <AliceButton
          variant="primary" design="ghost-subtle"
          size="icon-sm"
          :icon-size="16"
          @click="popoverRef?.close()"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
          :icon="X"
        />
      </div>

      <!-- Column Visibility Toggles -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
          Mostrar/Ocultar Columnas
        </span>
        <div class="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar p-1">
          <div
            v-for="col in columns.filter((c) => !c.hideFromMenu)"
            :key="String(col.key)"
            class="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
            @click.stop="emit('toggle-column', String(col.key), hiddenColumns.has(String(col.key)))"
          >
            <AliceCheckbox
              :model-value="!hiddenColumns.has(String(col.key))"
              @update:model-value="emit('toggle-column', String(col.key), $event)"
            />
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ col.header }}</span>
          </div>
        </div>
      </div>

      <!-- Views Section -->
      <div
        v-if="tableId || allVariants.length > 0"
        class="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-slate-700"
      >
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Vistas Guardadas
          </span>
          <button
            @click="emit('reset-to-default')"
            class="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter flex items-center gap-1 transition-colors cursor-pointer outline-none"
            title="Restablecer a la configuración original"
          >
            <RotateCcw :size="10" />
            Restablecer
          </button>
        </div>

        <!-- New / Update Variant Input -->
        <div v-if="tableId" class="flex gap-2">
          <AliceInput
            id="new-variant-name"
            v-model="newVariantName"
            placeholder="Nueva vista..."
            class="flex-1"
            size="sm"
            @keyup.enter="handleSaveVariant"
          />
          <div class="flex gap-1">
            <AliceButton
              @click="handleSaveVariant"
              :disabled="!newVariantName"
              variant="primary"
              size="sm"
              class="px-2"
              title="Guardar como nueva vista"
            >
              <Save :size="14" />
            </AliceButton>
            <AliceButton
              v-if="
                activeVariantName &&
                allVariants.find((v) => v.name === activeVariantName && !v.isPreset)
              "
              @click="emit('update-active-variant')"
              variant="primary" design="ghost-subtle"
              size="sm"
              class="px-2"
              title="Actualizar vista actual"
            >
              <RefreshCw :size="14" />
            </AliceButton>
          </div>
        </div>

        <!-- Variants List -->
        <div class="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar p-1">
          <div v-if="allVariants.length === 0" class="text-xs text-gray-400 italic px-1">
            No hay vistas guardadas.
          </div>
          <div
            v-for="(variant, idx) in allVariants"
            :key="idx"
            class="flex items-center justify-between group p-2 rounded-lg cursor-pointer transition-colors border"
            :class="[
              activeVariantName === variant.name
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-transparent',
            ]"
            @click="emit('apply-variant', variant)"
          >
            <div class="flex items-center gap-2 truncate">
              <div
                v-if="activeVariantName === variant.name"
                class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
              ></div>
              <span
                class="text-sm truncate"
                :class="
                  activeVariantName === variant.name
                    ? 'text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                "
                >{{ variant.label }}</span
              >
            </div>
            <AliceButton
              v-if="!variant.isPreset"
              variant="primary" design="ghost-subtle"
              size="icon-sm"
              :icon-size="14"
              @click.stop="emit('delete-variant', variant.name)"
              class="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              :icon="Trash2"
            />
          </div>
        </div>
      </div>
    </div>
  </AlicePopover>
</template>
