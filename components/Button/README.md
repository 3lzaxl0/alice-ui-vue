# AliceButton

Un botón versátil e interactivo con soporte para iconos, estados de carga (loading) y una amplia variedad de variantes de color y diseños estructurales visuales. Internamente utiliza la utilidad `cva` para aplicar dinámicamente las clases de Tailwind.

## Props Destacadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'ghost'` | `'primary'` | El color temático principal del botón. |
| `design` | `'solid' \| 'ghost' \| 'outline' \| 'ghost-subtle'` | `'solid'` | El estilo visual o relleno. Usar `ghost-subtle` para acciones secundarias en barras de herramientas. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon' \| 'icon-sm'` | `'md'` | El tamaño y padding del botón. |
| `icon` | `Component` | `undefined` | Icono de `lucide-vue-next` para renderizar al lado del texto o de forma aislada. |
| `loading` | `boolean` | `false` | Muestra un spinner interno y deshabilita interacciones. |

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { Play, Download } from 'lucide-vue-next'
import { AliceButton } from '@shared/alice-ui'
</script>

<template>
  <!-- Botón Primario Sólido con Icono -->
  <AliceButton variant="primary" design="solid" :icon="Play">
    Iniciar
  </AliceButton>

  <!-- Botón de Acción Sutil (para Toolbars) -->
  <AliceButton variant="success" design="ghost-subtle" size="icon" :icon="Download" />
</template>
```
