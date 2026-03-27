# AliceCard

Contenedor principal con diseño al estilo **Alice UI**. Ideal para enmarcar elementos en grillas, mostrando un área estructurada con encabezado, contenido dinámico, y zona de pie de página para botones de acción.

## Props

| Nombre | Tipo | Valor Default | Descripción |
|---|---|---|---|
| `title` | `string` | `''` | Título que se renderiza automáticamente en la esquina superior izquierda. |
| `subtitle` | `string` | `''` | Texto secundario o descriptivo que acompaña al título. |

## Slots

| Nombre | Descripción |
|---|---|
| `header` | Renderiza un encabezado completamente personalizado. Reemplaza el uso de las props `title` y `subtitle` si se decide usar este slot. |
| `action` | Slot pensado para alinear elementos a la derecha del título (por ejemplo, `AliceBadge` con el estado de un registro). |
| `default`| Contenido principal del componente, el cual incluye un espaciado intermedio (`gap-3`) y relleno (`p-4`). |
| `footer` | Sección anclada al fondo de la tarjeta sobre un fondo gris tenue donde comúnmente se incrustan componentes `AliceButton`. |

## Uso Básico

```vue
<template>
  <AliceCard title="Acta #123456" subtitle="10/10/2026">
    <template #action>
      <AliceBadge variant="warning" label="Pendiente" />
    </template>
    
    <div>Contenido principal de tu Card...</div>

    <template #footer>
      <AliceButton variant="primary">Aprobar</AliceButton>
    </template>
  </AliceCard>
</template>

<script setup lang="ts">
import { AliceCard, AliceBadge, AliceButton } from '@shared/alice-ui'
</script>
```
