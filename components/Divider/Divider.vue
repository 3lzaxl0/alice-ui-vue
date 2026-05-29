<script setup lang="ts">
import { computed } from 'vue'
import { dividerLineVariants } from './Divider.variants'
import type { VariantProps } from 'class-variance-authority'

defineOptions({ name: 'AliceDivider' })

type DividerVariantProps = VariantProps<typeof dividerLineVariants>

interface Props {
  vertical?:   boolean
  variant?:    DividerVariantProps['variant']
  thickness?:  'thin' | 'base' | 'thick'
  label?:      string
  labelAlign?: 'left' | 'center' | 'right'
  margin?:     string
}

const props = withDefaults(defineProps<Props>(), {
  vertical:   false,
  variant:    'normal',
  thickness:  'thin',
  labelAlign: 'center',
})

/**
 * Deriva el estilo del trazo CSS según la variante:
 * - dashed → border-dashed
 * - dotted → border-dotted
 * - light/normal → border-solid
 */
const derivedStyle = computed((): DividerVariantProps['style'] => {
  if (props.variant === 'dashed') return 'dashed'
  if (props.variant === 'dotted') return 'dotted'
  return 'solid'
})

/** Clases de color + estilo (sin grosor) */
const styleClass = computed(() =>
  dividerLineVariants({ variant: props.variant, style: derivedStyle.value })
)

/**
 * Clase del borde DIRECCIONAL con grosor correcto.
 *
 * Usamos border-t-* (horizontal) o border-l-* (vertical) para que
 * el grosor no colisione con border-t / border-l que Tailwind
 * aplica de forma independiente.
 *
 * thin  → border-t / border-l        (1px, clase base de Tailwind)
 * base  → border-t-2 / border-l-2    (2px)
 * thick → border-t-[3px] / border-l-[3px] (3px)
 */
const borderDirectionClass = computed(() => {
  const map: Record<string, { h: string; v: string }> = {
    thin:  { h: 'border-t',       v: 'border-l' },
    base:  { h: 'border-t-2',     v: 'border-l-2' },
    thick: { h: 'border-t-[3px]', v: 'border-l-[3px]' },
  }
  const t = map[props.thickness || 'thin']
  return props.vertical ? t.v : t.h
})

/** Clase del contenedor externo */
const containerClass = computed(() => {
  if (props.vertical) {
    return `inline-flex h-full ${borderDirectionClass.value} ${styleClass.value} ${props.margin || 'mx-4'}`
  }
  return `flex w-full items-center ${props.margin || 'my-2'}`
})

/** Clase completa para las líneas horizontales */
const lineClass = computed(() =>
  `${borderDirectionClass.value} ${styleClass.value}`
)
</script>

<template>
  <div :class="containerClass" role="separator">
    <!-- Divisor horizontal con etiqueta -->
    <template v-if="!vertical && label">
      <div
        v-if="labelAlign === 'center' || labelAlign === 'right'"
        class="flex-1"
        :class="lineClass"
      />
      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 whitespace-nowrap">
        {{ label }}
      </span>
      <div
        v-if="labelAlign === 'center' || labelAlign === 'left'"
        class="flex-1"
        :class="lineClass"
      />
    </template>

    <!-- Divisor horizontal simple (sin etiqueta) -->
    <div v-else-if="!vertical" class="w-full" :class="lineClass" />
  </div>
</template>
