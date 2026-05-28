import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const cardMeta: ComponentDoc = {
  name: 'AliceCard',
  description: 'Contenedor visual estructurado con soporte de sombras, bordes redondeados, cabeceras y pie de página.',
  category: 'Presentación',
  props: [
    { name: 'radius', type: 'none | sm | md | lg | xl | 2xl | 3xl | full', default: 'lg', description: 'Radio de borde de las esquinas.' },
    { name: 'shadow', type: 'none | sm | md | lg | xl | 2xl', default: 'sm', description: 'Intensidad de sombra perimetral.' },
    { name: 'alignTitle', type: 'left | center | right', default: 'left', description: 'Alineación de la cabecera y título.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Activa un borde distintivo sobre la tarjeta (útil para selección).' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Renderiza una máscara de carga translúcida encima.' },
  ],
  demoOptions: [
    { key: 'radius', label: 'Radius', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'], value: 'lg' },
    { key: 'shadow', label: 'Shadow', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'], value: 'sm' },
    { key: 'alignTitle', label: 'Align Title', type: 'select', options: ['left', 'center', 'right'], value: 'left' },
    { key: 'active', label: 'Active Highlight', type: 'boolean', value: false },
    { key: 'loading', label: 'Loading Overlay', type: 'boolean', value: false },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.radius !== 'lg') attrs.push(`  radius="${opts.radius}"`)
    if (opts.shadow !== 'sm') attrs.push(`  shadow="${opts.shadow}"`)
    if (opts.alignTitle !== 'left') attrs.push(`  align-title="${opts.alignTitle}"`)
    if (opts.active === true) attrs.push(`  :active="true"`)
    if (opts.loading === true) attrs.push(`  :loading="true"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceCard${attrsStr}>
  <template #header>Título de la Tarjeta</template>
  Contenido Principal del Bloque.
</AliceCard>`
  },
  showcaseSections: [
    {
      title: 'Sombras (shadow)',
      items: [
        { label: 'None', props: { shadow: 'none' } },
        { label: 'Small (sm)', props: { shadow: 'sm' } },
        { label: 'Medium (md)', props: { shadow: 'md' } },
        { label: 'Large (lg)', props: { shadow: 'lg' } },
        { label: 'Extra Large (xl)', props: { shadow: 'xl' } },
      ],
    },
    {
      title: 'Estados de Tarjeta',
      items: [
        { label: 'Normal', props: {} },
        { label: 'Destacado Activo', props: { active: true } },
        { label: 'Cargando Datos', props: { loading: true } },
      ],
    },
  ],
}
