<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AliceRow' })

/**
 * AliceRow — Contenedor de fila proporcional responsive.
 * Usa flex-col en mobile y flex-row en el breakpoint configurado.
 * Los hijos deben ser AliceCol con :span para definir proporciones.
 *
 * Ejemplo de 1/2 + 1/2:
 *   <AliceRow>
 *     <AliceCol :span="1">...</AliceCol>
 *     <AliceCol :span="1">...</AliceCol>
 *   </AliceRow>
 *
 * Ejemplo de 1/4 + 1/2 + 1/4:
 *   <AliceRow>
 *     <AliceCol :span="1">...</AliceCol>
 *     <AliceCol :span="2">...</AliceCol>
 *     <AliceCol :span="1">...</AliceCol>
 *   </AliceRow>
 */
interface Props {
  /** Espaciado entre columnas */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Breakpoint en el que pasa de col a row */
  collapseAt?: 'sm' | 'md' | 'lg' | 'xl'
  /** Alineación vertical de los hijos */
  align?: 'start' | 'center' | 'end' | 'stretch'
}

const props = withDefaults(defineProps<Props>(), {
  gap: 'md',
  collapseAt: 'lg',
  align: 'start',
})

const classes = computed(() => {
  const gapMap: Record<string, string> = {
    none: 'gap-0',
    xs:   'gap-1',
    sm:   'gap-2',
    md:   'gap-4',
    lg:   'gap-6',
    xl:   'gap-8',
  }

  // Estas clases son strings literales para que Tailwind las detecte en el escaneo estático
  const collapseMap: Record<string, string> = {
    sm: 'sm:flex-row',
    md: 'md:flex-row',
    lg: 'lg:flex-row',
    xl: 'xl:flex-row',
  }

  const alignMap: Record<string, string> = {
    start:   'items-start',
    center:  'items-center',
    end:     'items-end',
    stretch: 'items-stretch',
  }

  return [
    'flex flex-col w-full',
    collapseMap[props.collapseAt] ?? 'lg:flex-row',
    gapMap[props.gap] ?? 'gap-4',
    alignMap[props.align] ?? 'items-start',
  ].join(' ')
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
