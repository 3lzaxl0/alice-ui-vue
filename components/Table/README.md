# AliceTable

Una grilla de datos altamente dinámica, responsive y personalizable construida desde cero. Centraliza toda la interactividad estándar requerida para tablas de datos complejas sin depender de complejas librearías externas. 

## Funcionalidades Principales

- **Selección Individual o Múltiple:** Checkboxes o radio buttons integrados.
- **Búsqueda Avanzada y Filtros de Columna:** Panel filtrado superior por cada columna con atajos rápidos. 
- **Persistencia de Vistas (Variantes):** Los usuarios pueden guardar agrupaciones de columnas u ocultaciones como "Presets".
- **Responsive Integrado:** En pantallas móviles colapsa horizontalmente mediante overflow, pero integra barra de herramientas condensada.
- **Exportación Automática:** Conecta con su propio emit para manejar reportes de datos a Excel.

## Definición de Columnas

Las columnas se definen de la siguiente manera usando la interface genérica `Column<T>`:

| Propiedad | Tipo | Req. | Descripción |
| --- | --- | --- | --- |
| `key` | `keyof T \| string` | Sí | El identificador de la llave de los datos ó un nombre virtual si se renderiza personalizado. |
| `header` | `string` | Sí | Nombre de la columna en la cabecera. |
| `width` | `string` | No | Ancho expresado en flexbox, ej: `'100px'` o `'1.5fr'`. |
| `sortable` | `boolean` | No | Si se puede ordenar. |
| `hidden` | `boolean` | No | Si la columna por defecto viene oculta al cargar. |

## Slots Disponibles

`AliceTable` provee alta personalización al dejarte sobreescribir partes clave.

- `#toolbar-actions`: Componentes a renderizar en la barra principal como "Nuevo Registro".
- `#selection-actions`: Solo aparece si hay registros seleccionados, por error como "Eliminar Masivamente".
- `#[key]="{ item }"`: Sobrescribe la celda de la fila para una columna específica (e.g. `<template #estado="{ item }"> <Badge.../> </template>`)

## Ejemplo de Componente

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceTable, AliceBadge, type Column } from '@shared/alice-ui'

interface DataNode { id: number, nombre: string, status: string }

const data = ref<DataNode[]>([
  { id: 1, nombre: 'Ana', status: 'Activo' },
  { id: 2, nombre: 'Pedro', status: 'Inactivo' }
])

const columnas: Column<DataNode>[] = [
  { key: 'id', header: 'Cod.', width: '60px' },
  { key: 'nombre', header: 'Colaborador', width: '2fr' },
  { key: 'status', header: 'Estado', width: '100px' }
]

const sel = ref<DataNode[]>([])
</script>

<template>
  <AliceTable 
    table-id="ejemplo_usuario_1" 
    :columns="columnas" 
    :data="data" 
    selection-type="multiple"
    v-model:selected="sel"
    mode="auto"
  >
    <!-- Personalizando la columna Estado -->
    <template #status="{ item }">
      <AliceBadge :variant="item.status === 'Activo' ? 'success' : 'error'">
        {{ item.status }}
      </AliceBadge>
    </template>
  </AliceTable>
</template>
```
