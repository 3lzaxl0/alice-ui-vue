# AliceIconInfo

Un componente elegante y compacto para describir metadatos utilizando visualización por iconos de context-colored junto a sus respectivos valores tipográficos. Ideal para mostrar información de contactos, ubicaciones o usuarios incrustados en paneles y cards.

## Props

| Nombre | Tipo | Valor Default | Descripción |
|---|---|---|---|
| `icon` | `Component` | *(requerido)* | Icono SVG de Lucide o un componente `Vue` renderizable equivalente. |
| `label` | `string` | *(requerido)* | Subtítulo decorativo descriptivo de letras mayúsculas de pequeña escala. |
| `value` | `string` | *(requerido)* | Texto o dato principal a iluminar. |
| `variant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | El estado de color a aplicar, similar al `variant` de un AliceBadge. |
| `layout`  | `'horizontal' \| 'vertical'` | `'vertical'` | Orientación tipográfica entre el `value` y el `label`. |

## Uso Básico

```vue
<template>
  <!-- Información del usuario (Color por defecto) horizontal -->
  <AliceIconInfo
    :icon="User"
    label="Solicitado por"
    value="Pérez, Juan José"
    layout="horizontal"
  />

  <!-- Teléfono o Identificadores (Informativo - Azul) -->
  <AliceIconInfo
    :icon="Phone"
    label="Móvil Contacto"
    value="+51 987654321"
    variant="info"
  />
</template>

<script setup lang="ts">
import { AliceIconInfo } from '@shared/alice-ui'
import { User, Phone } from 'lucide-vue-next'
</script>
```
