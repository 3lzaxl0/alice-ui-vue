# AlicePopover

Contenedor flotante que se despliega al hacer click sobre un elemento `trigger`. Utiliza Portales (si es necesario) o posicionamiento absoluto, y es perfecto para contener menús secundarios, calendarios, formularios rápidos desplegables y otras interacciones complejas.

En pantallas pequeñas (móviles), puede utilizar la prop `mobileFullscreen` para convertirse automáticamente en un Modal a pantalla completa tipo *Bottom Sheet*, facilitando la usabilidad.

## Props y Atributos

| Prop / Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `v-model` | `boolean` | `undefined` | Controla la visibilidad manualmente si es necesario abrir o cerrarlo desde código. |
| `placement` | `'bottom-left' \| 'bottom-right'` | `'bottom-right'` | En qué dirección se anclará la caja flotante. |
| `closeOnClick` | `boolean` | `true` | Si el popover debe cerrarse automáticamente al intentar hacer clic en cualquier elemento interno. |
| `mobileFullscreen` | `boolean` | `false` | Activa un comportamiento donde en móviles (<768px) aparece atracado abajo con fondo semitransparente oscuro. |

## Slots Disponibles

- `#trigger`: Lo que el usuario presiona para abrirlo. Recibe `{ open }` como estado.
- `#default`: El contenido principal de la caja flotante. Recibe `{ close }` para cerrarlo explícitamente desde un botón cancelar interno.

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from 'lucide-vue-next'
import { AlicePopover, AliceButton, AliceCalendar } from '@shared/alice-ui'

const isOpen = ref(false)
const fecha = ref('2024-10-12')
</script>

<template>
  <AlicePopover v-model="isOpen" placement="bottom-left">
    <!-- El elemento detonador -->
    <template #trigger>
      <AliceButton :icon="Calendar" variant="primary" design="ghost">
        Elegir Fecha
      </AliceButton>
    </template>
    
    <!-- El contenido interactivo interno -->
    <template #default>
      <div class="px-2 py-2 min-w-[280px]">
        <AliceCalendar 
          :model-value="fecha" 
          @update:model-value="(val) => { fecha = val; isOpen = false; }" 
        />
      </div>
    </template>
  </AlicePopover>
</template>
```
