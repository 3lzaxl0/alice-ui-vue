<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({ name: 'AliceLayout' })

/**
 * AliceLayout — Layout de zonas con CSS Grid nativo.
 *
 * Zonas disponibles (slots):
 *   #top     → Cabecera superior (ancho completo)
 *   #left    → Panel lateral izquierdo (ancho fijo)
 *   #center  → Contenido central (default slot)
 *   #right   → Panel lateral derecho (ancho fijo)
 *   #bottom  → Footer inferior (ancho completo)
 *
 * Regla de oro: cero clases inline en el template.
 * Todo el control visual se maneja por props.
 */
interface Props {
  /** Ancho del panel izquierdo (CSS value) */
  leftWidth?: string
  /** Ancho del panel derecho (CSS value) */
  rightWidth?: string
  /** Alto de la cabecera top (CSS value) */
  topHeight?: string
  /** Alto del footer bottom (CSS value) */
  bottomHeight?: string
  /** Gap entre zonas (CSS value) */
  gap?: string
  /** Padding interno del contenedor principal */
  padding?: string
  /** Si el contenido central tiene scroll independiente */
  scrollableCenter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  leftWidth: '260px',
  rightWidth: '260px',
  topHeight: 'auto',
  bottomHeight: 'auto',
  gap: '1rem',
  padding: '0',
  scrollableCenter: true,
})

const slots = useSlots()

const hasTop = computed(() => !!slots.top)
const hasLeft = computed(() => !!slots.left)
const hasRight = computed(() => !!slots.right)
const hasBottom = computed(() => !!slots.bottom)

/**
 * Construye el grid-template-columns dinámicamente.
 * Solo incluye columnas de las zonas que tienen contenido (slots activos).
 */
const gridColumns = computed(() => {
  const parts: string[] = []
  if (hasLeft.value) parts.push(props.leftWidth)
  parts.push('1fr') // Centro siempre presente
  if (hasRight.value) parts.push(props.rightWidth)
  return parts.join(' ')
})

/**
 * Construye el grid-template-rows.
 * top + center + bottom (solo las que existen)
 */
const gridRows = computed(() => {
  const parts: string[] = []
  if (hasTop.value) parts.push(props.topHeight)
  parts.push('1fr') // Centro ocupa el espacio restante
  if (hasBottom.value) parts.push(props.bottomHeight)
  return parts.join(' ')
})

/**
 * Construye las grid-template-areas dinámicamente
 * según qué slots existen.
 *
 * Ejemplo con todos los slots:
 *   "top    top    top"
 *   "left   center right"
 *   "bottom bottom bottom"
 */
const gridAreas = computed(() => {
  const areas: string[] = []

  const buildRow = (zone: string) => {
    const parts: string[] = []
    if (hasLeft.value) parts.push(zone === 'left-row' ? 'left' : zone)
    parts.push(zone === 'left-row' ? 'center' : zone)
    if (hasRight.value) parts.push(zone === 'left-row' ? 'right' : zone)
    return `"${parts.join(' ')}"`
  }

  if (hasTop.value) areas.push(buildRow('top'))

  // Fila central: left | center | right
  const centerRow: string[] = []
  if (hasLeft.value) centerRow.push('left')
  centerRow.push('center')
  if (hasRight.value) centerRow.push('right')
  areas.push(`"${centerRow.join(' ')}"`)

  if (hasBottom.value) areas.push(buildRow('bottom'))

  return areas.join(' ')
})

const containerStyle = computed(() => ({
  display: 'grid',
  width: '100%',
  flex: '1 1 0',         // Crece dentro de AliceView (flex-col)
  minHeight: '0',        // Necesario para que grid no desborde en flex
  gridTemplateColumns: gridColumns.value,
  gridTemplateRows: gridRows.value,
  gridTemplateAreas: gridAreas.value,
  gap: props.gap,
  padding: props.padding,
}))

const centerStyle = computed(() => ({
  gridArea: 'center',
  minWidth: 0,    // Evita overflow en flex/grid children
  minHeight: 0,
  overflow: props.scrollableCenter ? 'auto' : 'visible',
}))
</script>

<template>
  <div :style="containerStyle">
    <!-- TOP ZONE -->
    <div v-if="hasTop" style="grid-area: top; min-width: 0;">
      <slot name="top" />
    </div>

    <!-- LEFT ZONE -->
    <div v-if="hasLeft" style="grid-area: left; min-width: 0; overflow: auto;">
      <slot name="left" />
    </div>

    <!-- CENTER ZONE (default slot) -->
    <div :style="centerStyle">
      <slot />
    </div>

    <!-- RIGHT ZONE -->
    <div v-if="hasRight" style="grid-area: right; min-width: 0; overflow: auto;">
      <slot name="right" />
    </div>

    <!-- BOTTOM ZONE -->
    <div v-if="hasBottom" style="grid-area: bottom; min-width: 0;">
      <slot name="bottom" />
    </div>
  </div>
</template>
