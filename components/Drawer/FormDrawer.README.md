# AliceFormDrawer

Una especialización de `AliceDrawer` diseñada específicamente para formularios de edición o creación lateral. Automatiza el espaciado interno (`gap-6`) indispensable para los campos de entrada de Alice y simplifica la estructura de botones de acción.

## Características

- **Espaciado Estandarizado**: Asegura que todos los formularios tengan el mismo ritmo vertical (`pt-2` y `gap-6`).
- **Control de Acciones**: Props directas para gestionar etiquetas, variantes de color y estados de carga de los botones.
- **Limpieza Visual**: Oculta la complejidad del contenedor interno del formulario.

## Props

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | Visibilidad. Soporta `v-model:show`. |
| `title` | `string` | *(Requerido)* | Título del encabezado. |
| `confirmLabel` | `string` | `'Guardar'` | Texto del botón principal. |
| `confirmVariant` | `'primary' \| 'success' \| ...` | `'primary'` | Estilo del botón. |
| `loading` | `boolean` | `false` | Estado de carga circular en el botón confirmar. |
| `width` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Ancho total del drawer. |
| `showCancel` | `boolean` | `true` | Si muestra botón de cancelar. |
| `cancelLabel` | `string` | `'Cancelar'` | Texto del botón secundario. |

## Eventos

- `confirm`: Se dispara al hacer clic en el botón principal.
- `cancel`: Se dispara al cancelar o cerrar el drawer.
- `update:show`: Sincronización para `v-model`.

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceFormDrawer, AliceInput, AliceSelect } from '@shared/alice-ui'

const show = ref(false)
const saving = ref(false)

async function onSave() {
  saving.value = true
  // ... lógica de guardado
  saving.value = false
  show.value = false
}
</script>

<template>
  <AliceFormDrawer
    v-model:show="show"
    title="Nuevo Registro"
    confirm-label="Registrar"
    confirm-variant="success"
    :loading="saving"
    @confirm="onSave"
  >
    <AliceInput id="name" label="Nombre" placeholder="Ej. Juan Pérez" />
    <AliceSelect id="type" label="Tipo" :options="[...] " />
  </AliceFormDrawer>
</template>
```
