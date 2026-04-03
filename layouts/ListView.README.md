# AliceListView

Un layout estructural que combina `AliceFilterPanel` y `AliceTable`. Es el estándar de Alice para pantallas maestras o listados que requieren filtrado dinámico y visualización tabular.

## Características

- **Hierarquía Estricta**: Mantiene la organización de contenedores necesaria para que el scroll de la tabla y los filtros funcionen correctamente.
- **Transmisión de Slots**: Reenvía automáticamente todos los slots desconocidos a la tabla interna, permitiendo formatear columnas (`#column-id`) de forma transparente.
- **Simplificación de Template**: Elimina la necesidad de anidamiento manual de 3 componentes estructurales.

## Props

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `tableId` | `string` | *(Requerido)* | ID único para persistencia de la tabla. |
| `columns` | `Column[]` | *(Requerido)* | Definición de columnas. |
| `data` | `any[]` | *(Requerido)* | Datos de la tabla. |
| `loading` | `boolean` | `false` | Estado de carga global de la vista. |
| `selectionType` | `'none' \| 'single' \| 'multiple'` | `'none'` | Tipo de selección de filas. |
| `selected` | `any[]` | `[]` | V-Model para los ítems seleccionados. |
| `tableMode` | `'auto' \| 'scroll'` | `'auto'` | Comportamiento del scroll. |

## Slots

- `filters`: Contenedor para los inputs de búsqueda (`AliceInput`, `AliceSelect`, etc.).
- `table-actions`: Botones en la parte superior derecha de la tabla (ej. "Nuevo").
- `selection-actions`: Botones que aparecen al seleccionar filas (ej. "Anular").
- `#[column-id]`: Cualquier slot de columna será retransmitido a la `AliceTable` interna.

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { AliceListView, AliceInput, AliceButton } from '@shared/alice-ui'
import { Plus } from 'lucide-vue-next'

const { columns, data, fetchData } = useMyFeature()
const selectedItems = ref([])
</script>

<template>
  <AliceListView
    table-id="my-feature-list"
    :columns="columns"
    :data="data"
    selection-type="multiple"
    v-model:selected="selectedItems"
    @filter="fetchData"
  >
    <!-- Slot de Filtros -->
    <template #filters>
      <AliceInput id="search" label="Buscador" />
    </template>

    <!-- Slot de Acciones Globales -->
    <template #table-actions>
      <AliceButton :icon="Plus" variant="success" size="sm">Nuevo</AliceButton>
    </template>
  </AliceListView>
</template>
```
