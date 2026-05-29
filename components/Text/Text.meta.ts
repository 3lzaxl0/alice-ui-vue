import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const textMeta: ComponentDoc = {
  name: 'AliceText',
  description: 'Componente tipográfico estandarizado para títulos, subtítulos, descripciones, leyendas y textos truncados con control de etiquetas HTML5 semánticas.',
  category: 'Presentación',
  props: [
    { name: 'variant', type: 'h1 | h2 | h3 | title | subtitle | label | body | description | caption | error', default: 'body', description: 'Estilo tipográfico estandarizado con clases preestablecidas.' },
    { name: 'color', type: 'default | muted | success | warning | error | primary | info | white | inherit', default: 'default (varía según variant)', description: 'Color del texto en base a tokens semánticos.' },
    { name: 'weight', type: 'normal | medium | semibold | bold | black | inherit', default: 'inherit', description: 'Grosor de la fuente tipográfica.' },
    { name: 'align', type: 'left | center | right | justify', default: 'left', description: 'Alineación horizontal del párrafo o bloque.' },
    { name: 'truncate', type: 'boolean', default: 'false', description: 'Añade puntos suspensivos automáticamente si el contenido excede el ancho.' },
    { name: 'tag', type: 'h1 | h2 | h3 | h4 | h5 | h6 | p | span | label | div', default: 'Auto-determinado', description: 'Permite forzar la etiqueta HTML semántica de forma independiente de la variante.' },
  ],
  demoOptions: [
    { key: 'slotContent', label: 'Texto / Slot', type: 'text', value: 'Diseña y genera interfaces dinámicas basadas en la librería Alice-UI.' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['h1', 'h2', 'h3', 'title', 'subtitle', 'label', 'body', 'description', 'caption', 'error'], value: 'body' },
    { key: 'color', label: 'Color', type: 'select', options: ['inherit', 'default', 'muted', 'success', 'warning', 'error', 'primary', 'info', 'white'], value: 'inherit' },
    { key: 'weight', label: 'Weight', type: 'select', options: ['inherit', 'normal', 'medium', 'semibold', 'bold', 'black'], value: 'inherit' },
    { key: 'align', label: 'Align', type: 'select', options: ['inherit', 'left', 'center', 'right', 'justify'], value: 'inherit' },
    { key: 'truncate', label: 'Truncar Texto', type: 'boolean', value: false },
    { key: 'tag', label: 'Etiqueta HTML (tag)', type: 'select', options: ['inherit', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'div'], value: 'inherit' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.variant !== 'body') attrs.push(`  variant="${opts.variant}"`)
    if (opts.color && opts.color !== 'inherit') attrs.push(`  color="${opts.color}"`)
    if (opts.weight && opts.weight !== 'inherit') attrs.push(`  weight="${opts.weight}"`)
    if (opts.align && opts.align !== 'inherit') attrs.push(`  align="${opts.align}"`)
    if (opts.truncate === true) attrs.push(`  :truncate="true"`)
    if (opts.tag && opts.tag !== 'inherit') attrs.push(`  tag="${opts.tag}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceText${attrsStr}>
  ${opts.slotContent || 'Texto Tipográfico Estructurado'}
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
        { label: 'Error', props: { variant: 'error' } },
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
    {
      title: 'Grosores y Alineaciones',
      items: [
        { label: 'Grosor Black', props: { variant: 'body', weight: 'black' } },
        { label: 'Grosor Bold', props: { variant: 'body', weight: 'bold' } },
        { label: 'Centrado', props: { variant: 'body', align: 'center' } },
        { label: 'Derecha', props: { variant: 'body', align: 'right' } },
      ],
    },
    {
      title: 'Truncado de Texto (truncate)',
      items: [
        { label: 'Truncado Activo (se corta con ... si el ancho es limitado)', props: { variant: 'body', truncate: true }, slotContent: 'Este es un texto sumamente largo que debería recortarse de forma limpia agregando puntos suspensivos al final de la línea.' },
      ],
    },
  ],
}
