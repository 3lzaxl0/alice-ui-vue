# AliceCalendar

Un componente de calendario visual interactivo que renderiza una cuadrícula de meses donde el usuario puede navegar y seleccionar una fecha exacta. Está diseñado para ser un bloque visual interno, idealmente incrustado dentro de `AlicePopover` o en un Sidebar. Para un control de formulario que combina un Input de texto, un popover y el calendario, use `AliceDatePicker`.

## Props / V-Model

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `null` | Fecha seleccionada en formato nativo ISO (ej. `"YYYY-MM-DD"`). |

## Eventos (Emits)

| Emisor | Argumentos | Descripción |
| --- | --- | --- |
| `@update:modelValue` | `(value: string \| null)` | Disparado cuando el usuario hace clic en un día dentro de la cuadrícula o al presionar "Hoy". |

## Ejemplo de uso

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceCalendar } from '@shared/alice-ui'

// Formato compatible base (Año-Mes-Día)
const fechaElegida = ref('2024-05-15')
</script>

<template>
  <div class="border border-gray-200 rounded-lg max-w-sm inline-block bg-white pb-2">
    <AliceCalendar v-model="fechaElegida" />
    <p class="text-xs text-center">Seleccionaste: {{ fechaElegida }}</p>
  </div>
</template>
```
