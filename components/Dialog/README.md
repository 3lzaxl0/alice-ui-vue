# AliceDialog

Un clásico modal de diálogo centrado en pantalla para confirmar acciones, advertir al usuario, o solicitar datos mediante pequeños formularios. En Alice, destaca por una fluida animación de entrada basada en escalado y por bloquear apropiadamente el fondo (`overflow: hidden` en `body`) cuando se abre.

## Props Destacadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | Activa y oculta el componente. Puede usarse con `v-model:show`. |
| `title` | `string` | *(Requerido)* | El título principal del panel en negritas. |
| `description` | `string` | `undefined` | Un discreto mensaje instruccional que aparece bajo el título. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'` | `'md'` | El ancho máximo asignado al modal. |
| `loading` | `boolean` | `false` | Si está procesando, pondrá estado de spinner sobre el botón `confirm`. |

## Uso Genérico o Modificado

Puedes usar `AliceDialog` en su versión base inyectando tu propio `template #footer`. O utilizar la configuración abreviada que Alice provee emitiendo un estado de cierre automático.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceDialog, AliceButton } from '@shared/alice-ui'

const modalOpen = ref(false)

function onAccept() {
  console.log('Se disparó el guardado')
  modalOpen.value = false
}
</script>

<template>
  <AliceButton @click="modalOpen = true">Nuevo Elemento</AliceButton>

  <!-- Forma rápida con Footer auto-generado -->
  <AliceDialog 
    v-model:show="modalOpen" 
    title="Agregar Ítem"
    description="Llene cuidadosamente los campos solicitados."
    confirm-label="Guardar Tarea"
    confirm-variant="primary"
    @confirm="onAccept"
  >
    <!-- Cuerpo o Slot Default -->
    <div class="p-4 grid gap-4">
      <p>Cuerpo interior de formularios u otra advertencia va aquí...</p>
    </div>
  </AliceDialog>
</template>
```
