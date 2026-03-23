# AliceBanner

Elemento de alerta estructural, usado típicamente en la parte superior de formularios o vistas completas para advertir sobre información persistente importante, errores globales, o estados de sistema.

Posee una iconografía propia que escala dependiendo del tamaño definido o reescribible vía slots, así como una sección opcional de "Call To Action" a la derecha.

## Variaciones (Props)

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | La intencionalidad del mensaje. |
| `type` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | La fuerza visual del cartel. |
| `icon` | `Component` | `undefined` | Icono que precede al texto. Si no, use slot `#icon`. |

## Uso con Slots

```vue
<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { AliceBanner, AliceButton } from '@shared/alice-ui'
</script>

<template>
  <AliceBanner variant="error" type="soft" :icon="AlertCircle">
    <div class="flex flex-col">
      <h3 class="font-bold text-red-800">Sincronización Fallida</h3>
      <p class="text-sm">Por favor presione reintentar para restaurar conectividad.</p>
    </div>
    
    <!-- Acción a la derecha -->
    <template #action>
      <AliceButton variant="error" design="outline" size="sm">
        Reintentar
      </AliceButton>
    </template>
  </AliceBanner>
</template>
```
