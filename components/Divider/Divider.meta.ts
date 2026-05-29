import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const dividerMeta: ComponentDoc = {
  name: 'AliceDivider',
  description: 'Separador visual elegante con soporte de orientación vertical u horizontal, estilos sólido/discontinuo/punteado, grosor configurable y etiquetas de texto personalizadas.',
  category: 'Presentación',
  props: [
    { name: 'vertical',   type: 'boolean', default: 'false', description: 'Cambia la orientación a vertical (útil en flujos flex horizontales).' },
    { name: 'variant',    type: 'light | normal | dashed | dotted', default: 'normal', description: 'Controla el color y el estilo del trazo.' },
    { name: 'thickness',  type: 'thin | base | thick', default: 'thin', description: 'Grosor del borde: thin (1px), base (2px), thick (3px).' },
    { name: 'label',      type: 'string', default: "''", description: 'Texto opcional en el interior del divisor horizontal.' },
    { name: 'labelAlign', type: 'left | center | right', default: 'center', description: 'Alineación horizontal de la etiqueta de texto.' },
    { name: 'margin',     type: 'string', default: 'Auto-determinado', description: 'Clases CSS de márgenes (ej. my-6, mx-2) para control de espaciado.' },
  ],
  demoOptions: [
    { key: 'vertical',   label: 'Vertical Orientation', type: 'boolean', value: false },
    { key: 'variant',    label: 'Variant', type: 'select', options: ['light', 'normal', 'dashed', 'dotted'], value: 'normal' },
    { key: 'thickness',  label: 'Thickness', type: 'select', options: ['thin', 'base', 'thick'], value: 'thin' },
    { key: 'label',      label: 'Label Text', type: 'text', value: '' },
    { key: 'labelAlign', label: 'Label Align', type: 'select', options: ['left', 'center', 'right'], value: 'center' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.vertical === true) attrs.push('  :vertical="true"')
    if (opts.variant && opts.variant !== 'normal') attrs.push(`  variant="${opts.variant}"`)
    if (opts.thickness && opts.thickness !== 'thin') attrs.push(`  thickness="${opts.thickness}"`)
    if (opts.label) attrs.push(`  label="${opts.label}"`)
    if (opts.label && opts.labelAlign !== 'center') attrs.push(`  label-align="${opts.labelAlign}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceDivider${attrsStr}/>`
  },
  showcaseSections: [
    {
      title: 'Variantes de Estilo (variant)',
      items: [
        { label: 'Normal (Línea sólida estándar)',  props: { variant: 'normal' } },
        { label: 'Light (Trazo suave de contraste bajo)', props: { variant: 'light' } },
        { label: 'Dashed (Línea discontinua)',       props: { variant: 'dashed' } },
        { label: 'Dotted (Línea punteada)',          props: { variant: 'dotted' } },
      ],
    },
    {
      title: 'Grosor del Trazo (thickness)',
      items: [
        { label: 'Thin — 1px (por defecto)', props: { thickness: 'thin' } },
        { label: 'Base — 2px',               props: { thickness: 'base' } },
        { label: 'Thick — 3px',              props: { thickness: 'thick' } },
      ],
    },
    {
      title: 'Divisores con Etiqueta (label)',
      items: [
        { label: 'Centrada',  props: { label: 'O CONTINUAR CON', labelAlign: 'center' } },
        { label: 'Izquierda', props: { label: 'SECCIÓN DE AJUSTES', labelAlign: 'left' } },
        { label: 'Derecha',   props: { label: 'SIGUIENTE PASO', labelAlign: 'right' } },
      ],
    },
    {
      title: 'Divisor Vertical (vertical)',
      items: [
        { label: 'Vertical en Flex (A | B)', props: { vertical: true } },
      ],
    },
  ],
}
