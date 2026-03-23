# AliceDatePicker

Un input de interfaz de usuario completo y compuesto que agrupa visualmente un text-box y un botón de calendario. Al hacer clic, internamente despliega un popover anclado con un `AliceCalendar` listo para ser manipulado interactivamente y sincronizado.

Existen dos tipos disponibles y estructurados separadamente para mayor legibilidad de UX:
- **`AliceDatePicker`**: Para seleccionar UNA ÚNICA fecha y mostrarla de forma legible.
- **`AliceDateRangePicker`**: Similar, pero maneja de forma abstracta rangos compuestos (`desde`, `hasta`) y pre-configuraciones de atajos ("Los últimos 7 días", "Este mes", etc.).

## Propiedades Destacadas (AliceDatePicker.vue)

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `null` | Formato `'YYYY-MM-DD'` real guardado en la variable (ej. base de datos). |
| `label` | `string` | `undefined` | Título del campo para formularios tipo `AliceInput`. |
| `placeholder` | `string` | `'Seleccionar fecha'` | Placeholder para input de texto nativo. |

*Nota: La lectura mostrada por UX en el control de texto está procesada al español con formato local (ej. "24 Oct 2024") aunque la variable v-model siempre exporte standard técnico "2024-10-24".*

## Ejemplo Práctico

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceDatePicker } from '@shared/alice-ui'

const fechaRegistro = ref<string | null>(null)
</script>

<template>
  <AliceDatePicker 
    v-model="fechaRegistro" 
    label="Fecha de la Tarea"
    placeholder="¿Cuándo ocurrió?"
  />
</template>
```
