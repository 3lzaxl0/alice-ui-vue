import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const cardMeta: ComponentDoc = {
  name: 'AliceCard',
  description: 'Contenedor visual estructurado con soporte de sombras, bordes redondeados, cabeceras y pie de página.',
  category: 'Presentación',
  props: [
    { name: 'title', type: 'string', default: "''", description: 'Título principal de la cabecera.' },
    { name: 'subtitle', type: 'string', default: "''", description: 'Subtítulo o descripción corta en la cabecera.' },
    { name: 'radius', type: 'none | sm | md | lg | xl | 2xl | 3xl | full', default: 'lg', description: 'Radio de borde de las esquinas.' },
    { name: 'shadow', type: 'none | sm | md | lg | xl | 2xl', default: 'sm', description: 'Intensidad de la sombra perimetral y hover.' },
    { name: 'alignTitle', type: 'left | center | right', default: 'left', description: 'Alineación horizontal del título y subtítulo.' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'Activa animaciones de click, escala y hover pointer.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Destaca la tarjeta con un borde de marca distintivo.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Muestra una pantalla translúcida de carga encima con texto.' },
    { name: 'loadingText', type: 'string', default: "'Sincronizando...'", description: 'Texto que se muestra durante el estado de carga.' },
  ],
  demoOptions: [
    { key: 'title', label: 'Title Prop', type: 'text', value: 'Título de Tarjeta' },
    { key: 'subtitle', label: 'Subtitle Prop', type: 'text', value: 'Descripción corta del contenido' },
    { key: 'radius', label: 'Radius', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'], value: 'lg' },
    { key: 'shadow', label: 'Shadow', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'], value: 'sm' },
    { key: 'alignTitle', label: 'Align Title', type: 'select', options: ['left', 'center', 'right'], value: 'left' },
    { key: 'interactive', label: 'Interactive Click', type: 'boolean', value: false },
    { key: 'active', label: 'Active State', type: 'boolean', value: false },
    { key: 'loading', label: 'Loading State', type: 'boolean', value: false },
    { key: 'hasFooter', label: 'Show Footer Slot', type: 'boolean', value: false },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.title) attrs.push(`  title="${opts.title}"`)
    if (opts.subtitle) attrs.push(`  subtitle="${opts.subtitle}"`)
    if (opts.radius !== 'lg') attrs.push(`  radius="${opts.radius}"`)
    if (opts.shadow !== 'sm') attrs.push(`  shadow="${opts.shadow}"`)
    if (opts.alignTitle !== 'left') attrs.push(`  align-title="${opts.alignTitle}"`)
    if (opts.interactive === true) attrs.push(`  :interactive="true"`)
    if (opts.active === true) attrs.push(`  :active="true"`)
    if (opts.loading === true) attrs.push(`  :loading="true"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    const footerStr = opts.hasFooter ? `\n  <template #footer>\n    <AliceButton variant="primary" size="sm">Aceptar</AliceButton>\n  </template>\n` : ''
    return `<AliceCard${attrsStr}>
  Este es el cuerpo o contenido principal de la tarjeta.${footerStr}
</AliceCard>`
  },
  showcaseSections: [
    {
      title: 'Sombras (shadow)',
      items: [
        { label: 'None', props: { shadow: 'none', title: 'Tarjeta Plana' } },
        { label: 'Small (sm)', props: { shadow: 'sm', title: 'Sombra Ligera' } },
        { label: 'Medium (md)', props: { shadow: 'md', title: 'Sombra Media' } },
        { label: 'Large (lg)', props: { shadow: 'lg', title: 'Sombra Alta' } },
        { label: 'Extra Large (xl)', props: { shadow: 'xl', title: 'Sombra Muy Alta' } },
      ],
    },
    {
      title: 'Redondeados (radius)',
      items: [
        { label: 'None', props: { radius: 'none', title: 'Radio Cero' } },
        { label: 'Small (sm)', props: { radius: 'sm', title: 'Esquina Pequeña' } },
        { label: 'Medium (md)', props: { radius: 'md', title: 'Esquina Media' } },
        { label: 'Large (lg)', props: { radius: 'lg', title: 'Esquina Grande' } },
        { label: 'Extra Large (2xl)', props: { radius: '2xl', title: 'Esquina Muy Grande' } },
      ],
    },
    {
      title: 'Estados e Interacción',
      items: [
        { label: 'Normal', props: { title: 'Tarjeta Normal' } },
        { label: 'Destacado Activo', props: { title: 'Destacada', active: true } },
        { label: 'Cargando Datos', props: { title: 'Sincronizando', loading: true } },
        { label: 'Clic Interactiva', props: { title: 'Presióname', interactive: true } },
      ],
    },
  ],
}
