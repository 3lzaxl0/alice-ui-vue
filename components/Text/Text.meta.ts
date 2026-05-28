import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const textMeta: ComponentDoc = {
  name: 'AliceText',
  description: 'Componente tipográfico estandarizado para títulos, subtítulos, descripciones y leyendas.',
  category: 'Presentación',
  props: [
    { name: 'variant', type: 'h1 | h2 | h3 | title | subtitle | label | body | description | caption', default: 'body', description: 'Estilo tipográfico estandarizado.' },
    { name: 'color', type: 'default | muted | success | warning | error | primary | info | white', default: 'default', description: 'Color del texto en base a tokens.' },
    { name: 'weight', type: 'normal | medium | semibold | bold', default: 'normal', description: 'Grosor de la fuente tipográfica.' },
    { name: 'align', type: 'left | center | right | justify', default: 'left', description: 'Alineación horizontal.' },
  ],
  demoOptions: [
    { key: 'variant', label: 'Variant', type: 'select', options: ['h1', 'h2', 'h3', 'title', 'subtitle', 'label', 'body', 'description', 'caption'], value: 'body' },
    { key: 'color', label: 'Color', type: 'select', options: ['default', 'muted', 'success', 'warning', 'error', 'primary', 'info'], value: 'default' },
    { key: 'weight', label: 'Weight', type: 'select', options: ['normal', 'medium', 'semibold', 'bold'], value: 'normal' },
    { key: 'align', label: 'Align', type: 'select', options: ['left', 'center', 'right', 'justify'], value: 'left' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.variant !== 'body') attrs.push(`  variant="${opts.variant}"`)
    if (opts.color !== 'default') attrs.push(`  color="${opts.color}"`)
    if (opts.weight !== 'normal') attrs.push(`  weight="${opts.weight}"`)
    if (opts.align !== 'left') attrs.push(`  align="${opts.align}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceText${attrsStr}>
  Texto Tipográfico Estructurado
</AliceText>`
  },
  showcaseSections: [
    {
      title: 'Variantes de Estilo (variant)',
      items: [
        { label: 'H1 Header', props: { variant: 'h1' } },
        { label: 'H2 Header', props: { variant: 'h2' } },
        { label: 'H3 Header', props: { variant: 'h3' } },
        { label: 'Title', props: { variant: 'title' } },
        { label: 'Subtitle', props: { variant: 'subtitle' } },
        { label: 'Label', props: { variant: 'label' } },
        { label: 'Body (Por defecto)', props: { variant: 'body' } },
        { label: 'Description', props: { variant: 'description' } },
        { label: 'Caption', props: { variant: 'caption' } },
      ],
    },
    {
      title: 'Colores Semánticos (color)',
      items: [
        { label: 'Default', props: { variant: 'title', color: 'default' } },
        { label: 'Primary', props: { variant: 'title', color: 'primary' } },
        { label: 'Muted', props: { variant: 'title', color: 'muted' } },
        { label: 'Success', props: { variant: 'title', color: 'success' } },
        { label: 'Warning', props: { variant: 'title', color: 'warning' } },
        { label: 'Error', props: { variant: 'title', color: 'error' } },
        { label: 'Info', props: { variant: 'title', color: 'info' } },
      ],
    },
  ],
}
