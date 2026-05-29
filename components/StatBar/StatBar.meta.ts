import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const statBarMeta: ComponentDoc = {
  name: 'AliceStatBar',
  description: 'Contenedor estructural responsivo diseñado para agrupar múltiples tarjetas estadísticas (AliceStat). Ofrece control de orientación automático, alineación flexible y líneas divisorias integradas.',
  category: 'Presentación',
  props: [
    { name: 'direction', type: 'row | col | auto', default: 'auto', description: 'Dirección del flujo de los elementos: row (horizontal), col (vertical) o auto (vertical en móviles y horizontal en pantallas sm+).' },
    { name: 'divided', type: 'boolean', default: 'true', description: 'Muestra u oculta líneas divisorias entre los elementos del contenedor.' },
    { name: 'align', type: 'start | center | end | stretch', default: 'stretch', description: 'Alineación de los elementos en el eje transversal del flujo.' },
  ],
  demoOptions: [
    { key: 'direction', label: 'Direction', type: 'select', options: ['auto', 'row', 'col'], value: 'auto' },
    { key: 'divided', label: 'Show Dividers', type: 'boolean', value: true },
    { key: 'align', label: 'Alignment', type: 'select', options: ['stretch', 'start', 'center', 'end'], value: 'stretch' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.direction !== 'auto') attrs.push(`  direction="${opts.direction}"`)
    if (opts.divided === false) attrs.push('  :divided="false"')
    if (opts.align !== 'stretch') attrs.push(`  align="${opts.align}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceStatBar${attrsStr}>\n  <AliceStat title="Ingresos" value="$12,400" />\n  <AliceStat title="Usuarios" value="1,205" />\n  <AliceStat title="Conversión" value="2.4%" />\n</AliceStatBar>`
  },
  showcaseSections: [
    {
      title: 'Flujo Responsivo Automático (direction: auto)',
      items: [
        { label: 'Auto con Divisores (Recomendado)', props: { direction: 'auto', divided: true } }
      ]
    },
    {
      title: 'Dirección y Estilos de Contenedor',
      items: [
        { label: 'Fila Horizontal (row)', props: { direction: 'row', divided: true } },
        { label: 'Columna Vertical (col)', props: { direction: 'col', divided: true } },
        { label: 'Sin Divisores (divided: false)', props: { direction: 'row', divided: false } }
      ]
    }
  ]
}
