# AliceFilterPanel

Marco controlador visual usado encima de `AliceTable`s para agrupar visualmente controles de campos cruzados. Su valor principal no es sólo estético (dispone la grilla CSS de inputs y ubica el botón de Filtro al final), sino que tiene una arquitectura abstracta para correr dependencias (A través de `provide/inject` con sus hijos genéricos como `AliceInput`).

Si los inputs hijos son configurados como "Requeridos" o enlazados a sus validaciones internas, al presionar "Filtrar" en el botón, el Panel verificará a los hijos, mostrará `Toast` informándote en caso de fallas y cancelará el trigger. Emitiendo finalmente `@filter` si los niños son válidos.

## Código Base

```vue
<script setup lang="ts">
import { AliceFilterPanel, AliceInput, AliceSelect } from '@shared/alice-ui'

function ejecutarFiltro() {
  console.log('Se mandó un Request a BD gracias al botón o Enter exitoso')
}
</script>

<template>
  <AliceFilterPanel @filter="ejecutarFiltro">
    <!-- Componentes internos -->
    <AliceInput id="dni" label="Búsqueda por DNI" />
    <AliceSelect id="sucursal" label="Filial local" :options="[...]" />
  </AliceFilterPanel>
</template>
```
