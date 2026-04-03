# AliceEntityCard

Un componente de alto nivel diseñado para mostrar resúmenes de entidades (Solicitudes, Lotes, Bidones) en rejillas o listas. Automatiza la disposición premium de Alice, incluyendo cabeceras con badges, metadatos en listas y secciones de información con iconos.

## Características

- **Diseño Estandarizado**: Los badges, divisores y footers están perfectamente alineados según el sistema de diseño.
- **Filtrado Inteligente**: Oculta automáticamente filas de metadatos o ítems de información que tengan valores `null` o `undefined`.
- **Slot de Flexibilidad**: Permite inyectar contenido personalizado en el centro de la tarjeta.

## Props

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `title` | `string` | *(Requerido)* | Identificador principal (ej: Folio o ID). |
| `subtitle` | `string` | `undefined` | Subtítulo descriptivo o fecha. |
| `badgeLabel` | `string` | `undefined` | Texto para el estado visual. |
| `badgeVariant` | `string` | `'neutral'` | Variante del badge (`warning`, `success`, etc.). |
| `metadata` | `MetadataItem[]` | `[]` | Array de `{ label, value }` para la lista superior. |
| `infoItems` | `InfoItem[]` | `[]` | Array de `{ icon, label, value, variant }` para la lista inferior. |

## Slots

- `header-action`: Para inyectar botones o múltiples badges en la esquina superior derecha.
- `default`: Espacio entre la lista de metadatos y la lista con iconos.
- `footer`: Sección inferior reservada para los botones de acción (`AliceButton`).

## Ejemplo de Uso

```vue
<script setup lang="ts">
import { AliceEntityCard, AliceButton } from '@shared/alice-ui'
import { User, Phone } from 'lucide-vue-next'

const acta = { id: 101, fecha: '2026-04-01', ceco: 'PROD-01' }
</script>

<template>
  <AliceEntityCard
    :title="`Acta #${acta.id}`"
    :subtitle="acta.fecha"
    badge-label="Pendiente"
    badge-variant="warning"
    :metadata="[
      { label: 'CECO', value: acta.ceco },
      { label: 'Responsable', value: 'Juan Pérez' }
    ]"
    :info-items="[
      { icon: User, label: 'Solicitado por', value: 'Admin' },
      { icon: Phone, label: 'Contacto', value: '999888777' }
    ]"
  >
    <template #footer>
      <AliceButton variant="error" size="sm" design="ghost">Rechazar</AliceButton>
      <AliceButton variant="success" size="sm">Aprobar</AliceButton>
    </template>
  </AliceEntityCard>
</template>
```
