import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const carouselMeta: ComponentDoc = {
  name: 'AliceCarousel',
  description: 'Contenedor responsivo con soporte para navegación por arrastre (drag-to-scroll) y flechas de dirección. Permite visualizar e iterar elementos en un carrusel horizontal con patrones de fondo y bordes personalizables.',
  category: 'Presentación',
  props: [
    { name: 'modelValue', type: 'number', default: '0', description: 'Índice del elemento seleccionado (v-model para sincronización de estado).' },
    { name: 'itemMinWidth', type: 'number', default: '280', description: 'Ancho mínimo en píxeles de cada elemento para calcular el desplazamiento.' },
    { name: 'gap', type: 'sm | md | lg', default: 'md', description: 'Espaciado entre los elementos del carrusel: sm (12px), md (16px) o lg (24px).' },
    { name: 'showArrows', type: 'boolean', default: 'true', description: 'Muestra u oculta los botones de navegación izquierda y derecha.' },
    { name: 'pattern', type: 'none | zebra | dots', default: 'none', description: 'Patrón de fondo decorativo para el contenedor del carrusel.' },
    { name: 'borderStyle', type: 'solid | dashed | dotted | none', default: 'none', description: 'Estilo de borde exterior para el contenedor.' },
    { name: 'padding', type: 'none | sm | md | lg | xl | 2xl', default: 'md', description: 'Espaciado interno (padding) dentro del contenedor.' },
  ],
  demoOptions: [
    { key: 'gap', label: 'Gap', type: 'select', options: ['sm', 'md', 'lg'], value: 'md' },
    { key: 'showArrows', label: 'Show Arrows', type: 'boolean', value: true },
    { key: 'pattern', label: 'Pattern', type: 'select', options: ['none', 'zebra', 'dots'], value: 'none' },
    { key: 'borderStyle', label: 'Border Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted'], value: 'none' },
    { key: 'padding', label: 'Padding', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'], value: 'md' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.gap !== 'md') attrs.push(`  gap="${opts.gap}"`)
    if (opts.showArrows === false) attrs.push('  :show-arrows="false"')
    if (opts.pattern !== 'none') attrs.push(`  pattern="${opts.pattern}"`)
    if (opts.borderStyle !== 'none') attrs.push(`  border-style="${opts.borderStyle}"`)
    if (opts.padding !== 'md') attrs.push(`  padding="${opts.padding}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceCarousel${attrsStr}>\n  <template #default="{ selected, selectItem }">\n    <AliceCarouselItem\n      v-for="(item, index) in items"\n      :key="index"\n    >\n      <!-- Contenido de tu tarjeta o tarjeta interactiva -->\n    </AliceCarouselItem>\n  </template>\n</AliceCarousel>`
  },
  showcaseSections: [
    {
      title: 'Carrusel Estándar',
      items: [
        { label: 'Navegación Interactiva', props: { gap: 'md', showArrows: true } }
      ]
    },
    {
      title: 'Estilos de Contenedor & Patrones',
      items: [
        { label: 'Fondo Dots con Borde Discontinuo', props: { pattern: 'dots', borderStyle: 'dashed', padding: 'lg' } },
        { label: 'Estilo Zebra con Borde Sólido', props: { pattern: 'zebra', borderStyle: 'solid', padding: 'md' } },
        { label: 'Sin Bordes ni Fondos (Limpio)', props: { pattern: 'none', borderStyle: 'none', padding: 'none' } }
      ]
    }
  ]
}
