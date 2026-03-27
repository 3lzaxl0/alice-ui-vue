# AliceDataList

Componente de lista diseñada para leer datos de clave/valor usando un estilo limpio de tipo 'cebra' con filas intercaladas, lo cual facilita la la lectura de la data sin cansar los ojos.

## Props

| Nombre | Tipo | Valor Default | Descripción |
|---|---|---|---|
| `items` | `DataListItem[]` | `[]` | Arreglo de datos para generar dinámicamente cada fila de la lista. |

### Interfaz `DataListItem`

| Propiedad | Tipo | Descripción |
|---|---|---|
| `label` | `string` | Título del ítem. Ubicado a la izquierda. |
| `value` | `string \| number` | Valor del ítem. Ubicado a la derecha. |
| `highlight` | `boolean` (opcional) | Si es `true`, resalta el tamaño de la fuente (`text-lg`) y la vuelve blanca en el modo oscuro. |
| `highlightClass` | `string` (opcional) | Clases a inyectar directamente al envoltorio del texto `value` para estilos adhoc. |

## Slots

- `default`: Contenido personalizado, útil para cuando la prop `items` está vacía o si deseas definir toda la lista usando maquetado libre pero con la jerarquía de `AliceDataList`.

## Uso Básico

```vue
<template>
  <AliceDataList
    :items="[
      { label: 'Centro de Costos', value: '110540' },
      { label: 'Estado', value: 'Abierto' },
      { label: 'Cant. Elementos', value: 145, highlight: true }
    ]"
  />
</template>

<script setup lang="ts">
import { AliceDataList } from '@shared/alice-ui'
</script>
```
