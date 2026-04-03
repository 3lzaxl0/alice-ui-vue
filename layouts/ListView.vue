<script setup lang="ts" generic="T">
import AliceView from '../components/View/View.vue'
import AliceFilterPanel from '../components/FilterPanel/FilterPanel.vue'
import AliceTable, { type Column } from '../components/Table/Table.vue'

defineOptions({
  name: 'AliceListView',
})

withDefaults(
  defineProps<{
    /** Identificador único para la persistencia de la tabla */
    tableId: string
    /** Configuración de columnas para la tabla */
    columns: Column<T>[]
    /** Datos para mostrar en la tabla */
    data: T[]
    /** Estado de carga global de la vista */
    loading?: boolean
    /** Tipo de selección (none, single, multiple) */
    selectionType?: 'none' | 'single' | 'multiple'
    /** Elementos seleccionados (v-model:selected) */
    selected?: T[]
    /** Si la tabla debe calcular su propia altura (auto) o usar altura de contenido (fixed) */
    tableMode?: 'auto' | 'fixed'
  }>(),
  {
    loading: false,
    selectionType: 'none',
    selected: () => [] as T[],
    tableMode: 'fixed',
  }
)

const emit = defineEmits<{
  (e: 'filter'): void
  (e: 'update:selected', value: T[]): void
}>()

function handleFilter() {
  emit('filter')
}
</script>

<template>
  <AliceView :loading="loading">
    <!-- Panel de Filtros Automatizado -->
    <AliceFilterPanel v-if="$slots.filters" @filter="handleFilter">
      <slot name="filters" />
    </AliceFilterPanel>

    <!-- Tabla Principal Integrada en el Layout -->
    <AliceTable
      :table-id="tableId"
      :columns="columns"
      :data="data"
      :mode="tableMode"
      :selection-type="selectionType"
      :selected="selected"
      @update:selected="emit('update:selected', $event)"
    >
      <!-- Reenvío de slots específicos de AliceTable para acciones -->
      <template #toolbar-actions>
        <slot name="table-actions" />
      </template>

      <template #selection-actions>
        <slot name="selection-actions" />
      </template>

      <!-- Reenvío dinámico de slots para columnas personalizadas -->
      <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </AliceTable>
  </AliceView>
</template>
