# AliceBadge

Componente visual pequeño utilizado para resaltar estados, categorías o contadores numéricos breves. Muy común dentro de las columnas "Estado" de `AliceTable` o contigua a títulos.

## Props Soportadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `label` | `string` | *(Requerido)* | El texto a mostrar (también puede usar el slot por defecto en lugar de prop en algunas versiones). |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | El color semántico del badge. |
| `type` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | El estilo visual de relleno. 'soft' es ideal para fondos claros modernos. |
| `icon` | `Component` | `undefined` | Opcional, icono de `lucide-vue-next` (tamaño fijo interno a 12px). |

## Ejemplo Teórico

```vue
<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { AliceBadge } from '@shared/alice-ui'
</script>

<template>
  <AliceBadge label="Aprobado" variant="success" type="soft" :icon="Check" />
</template>
```
