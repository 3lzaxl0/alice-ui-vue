# AliceSelect

Un elegante reemplazo al `<select>` estándar que permite control avanzado visual sobre el componente (renderización de menú flotante fuera de los bordes). Altamente adaptable para colecciones de datos pequeñas (<50 items). Para listados que puedan requerir interactividad como búsquedas directas dentro de la lista de opciones grandes, use en su lugar `AliceSearchInput`.

## Propiedades Clave

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `options` | `{ label: string, value: string\|number }[]` | `[]` | Opciones inyectadas para seleccionar, presentadas estructuradamente. |
| `v-model` | `string` o `number` o `null` | `null` | El valor enlazado correspondientemente escogido. |
| `placeholder` | `string` | `"Seleccionar..."` | Placeholder predeterminado. |
| `label` | `string` | `undefined` | Texto a mostrar justo arriba del recuadro. |

## Ejemplo de uso

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceSelect } from '@shared/alice-ui'

const miOpcion = ref<string | null>(null)
</script>

<template>
  <AliceSelect 
    id="estatus_selector"
    v-model="miOpcion"
    label="Defina el Estatus"
    :options="[
      { label: 'En proceso', value: 'PROC' },
      { label: 'Terminado', value: 'DONE' }
    ]"
  />
</template>
```
