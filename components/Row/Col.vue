<script setup lang="ts">
defineOptions({ name: 'AliceCol' })

/**
 * AliceCol — Hijo proporcional de AliceRow.
 * El :span define el peso relativo usando flex-grow.
 *
 * span=1 → flex: 1 1 0%  (una porción)
 * span=2 → flex: 2 1 0%  (el doble de espacio)
 * span=3 → flex: 3 1 0%  (el triple)
 *
 * min-w-0 es implícito para evitar desbordamientos en contenido ancho.
 */
interface Props {
  /** Peso proporcional de esta columna (relativo al total de hermanos) */
  span?: number
}

const props = withDefaults(defineProps<Props>(), {
  span: 1,
})
</script>

<template>
  <div class="min-w-0 w-full" :style="{ flex: `${props.span} 1 0%` }">
    <slot />
  </div>
</template>
