# AliceDrawer

Componente tipo "Cajón Lateral" emergente ("Slide-over" o "Off-canvas" Drawer). Provee un lienzo largo anclado al margen derecho de la pantalla, perfecto para registrar entidades complejas que requieran muchos inputs y que se benefician de toda la altura del navegador sin invadir ni tapar centralmente el flujo de visualización de información subyacente (ej. de una `AliceTable`).

Se comporta conceptualmente igual que `AliceDialog` (emite y bloquea pantalla si es necesario).

## Propiedades Soportadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | Activa o desactiva la inyección del Drawer (v-model). |
| `title` | `string` | *(Requerido)* | El encabezado principal que aparece arriba junto con el botón [X]. |
| `confirmLabel` | `string` | `'Guardar'` | Texto para el botón de confirmación en su Footer inyectado. |
| `confirmVariant` | `'primary' \| 'success' \| ...` | `'primary'` | Variante visual del botón de confirmación. |
| `loading` | `boolean` | `false` | Muestra estado spinner en el guardado. |

## Eventos Empezados

- `@confirm`: Detonado al presionar explícitamente el botón guardador base interno del Drawer.
- `@update:show`: Emitido en true/false para interactuar fluidamente al cancelar acciones (clic secundario o afuera del marco lateral).

## Ejemplo Básico

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceDrawer, AliceButton, AliceInput } from '@shared/alice-ui'

const paneAbierto = ref(false)
</script>

<template>
  <AliceButton @click="paneAbierto = true">Agregar</AliceButton>

  <AliceDrawer 
    v-model:show="paneAbierto"
    title="Agregar un Nuevo Proveedor"
    confirm-label="Confirmar Registro"
    confirm-variant="success"
    @confirm="procesarYSalir"
  >
    <!-- Tu contenido/largo scrollable interno aquí -->
    <div class="flex flex-col gap-6 p-1">
      <AliceInput label="Razón Social" />
      <AliceInput label="RUC" />
    </div>
  </AliceDrawer>
</template>
```
