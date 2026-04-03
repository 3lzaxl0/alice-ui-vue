# AliceActionDialog

Un componente especializado que combina `AliceDialog` con un campo de observación (`AliceInput`) integrado. Es ideal para flujos de trabajo donde una acción requiere una confirmación y una justificación textual (ej. Rechazar una solicitud, Anular un registro, etc.).

## Características

- **Gestión de Estado**: El campo de texto se limpia automáticamente cada vez que el diálogo se vuelve a abrir.
- **Validación Integrada**: Botón de confirmación deshabilitado si el campo es requerido y está vacío.
- **Contador de Caracteres**: Muestra el progreso del límite de caracteres en tiempo real.

## Props

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | Controla la visibilidad. Soporta `v-model:show`. |
| `title` | `string` | *(Requerido)* | Título del diálogo. |
| `description` | `string` | `undefined` | Texto de ayuda o instrucción. |
| `confirmLabel` | `string` | `'Confirmar'` | Etiqueta del botón de acción. |
| `confirmVariant` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Estilo del botón de confirmación. |
| `loading` | `boolean` | `false` | Muestra un estado de carga en el botón. |
| `label` | `string` | `'Observación'` | Etiqueta del campo de texto interior. |
| `placeholder` | `string` | `'Escriba una observación...'` | Texto de ayuda del campo. |
| `required` | `boolean` | `true` | Si es obligatorio antes de confirmar. |
| `maxlength` | `number` | `200` | Límite de caracteres. |

## Eventos

- `confirm`: Se emite cuando el usuario hace clic en el botón de confirmación. Devuelve el `string` ingresado en el campo.
- `update:show`: Sincronización para `v-model`.

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceActionDialog } from '@shared/alice-ui'

const showModal = ref(false)
const loading = ref(false)

async function onConfirm(motivo: string) {
  loading.value = true
  // API Call logic
  loading.value = false
  showModal.value = false
}
</script>

<template>
  <AliceActionDialog
    v-model:show="showModal"
    title="Rechazar Registro"
    description="Indique la razón para el rechazo."
    confirm-label="Confirmar Rechazo"
    confirm-variant="error"
    label="Motivo del Rechazo"
    :loading="loading"
    @confirm="onConfirm"
  />
</template>
```
