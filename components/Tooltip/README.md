# AliceTooltip

Un componente de tooltip moderno de uso exclusivo para **texto simple**. Detecta si el texto está truncado o cortado en el layout y muestra un pequeño globo negro sobre el elemento al pasar el cursor para poder leer el contenido completo.

> **Importante:** Para elementos interactivos o contenido estructurado (como menús, calendarios, o formularios pequeños), utilice `AlicePopover` en su lugar.

## Props Destacadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `content` | `string` | *(Requerido)* | El texto simple a mostrar en el globo hover. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Ubicación del tooltip en relación al elemento detonador. |

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { AliceTooltip } from '@shared/alice-ui'
</script>

<template>
  <AliceTooltip content="Este es el texto completo que explica para qué sirve este estado">
    <div class="truncate w-32">
      Texto posiblemente muy largo que se va a cortar
    </div>
  </AliceTooltip>
</template>
```
