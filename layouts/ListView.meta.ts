import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const listViewMeta: ComponentDoc = {
  name: 'AliceListView',
  description: 'Diseño estructural preconfigurado para listados de datos. Integra de forma automática un panel de filtros extensible, barra de herramientas y la tabla interactiva de Alice UI.',
  category: 'Layout',
  props: [
    { name: 'tableId', type: 'string', default: 'undefined', description: 'Identificador único para la persistencia del estado de la tabla.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Indica si la vista se encuentra en estado de carga.' },
    { name: 'selectionType', type: 'none | single | multiple', default: 'none', description: 'Define la modalidad de selección de registros en la tabla.' },
    { name: 'tableMode', type: 'auto | fixed', default: 'auto', description: 'Modalidad de altura de la tabla: auto (calculada) o fixed (fija).' },
  ],
  demoOptions: [
    { key: 'tableId', label: 'Table ID', type: 'text', value: 'users-table' },
    { key: 'loading', label: 'Loading State', type: 'boolean', value: false },
    { key: 'selectionType', label: 'Selection Mode', type: 'select', options: ['none', 'single', 'multiple'], value: 'none' },
  ],
  codeTemplate: (opts) => {
    return `<AliceListView\n  table-id="${opts.tableId || 'data-table'}"\n  :columns="columns"\n  :data="records"\n  :loading="${opts.loading || false}"\n  selection-type="${opts.selectionType || 'none'}"\n>\n  <template #filters>\n    <!-- Filtros de búsqueda -->\n  </template>\n</AliceListView>`
  },
  showcaseSections: [
    {
      title: 'Configuraciones de Tabla',
      items: [
        { label: 'Vista de Listado con Carga', props: { tableId: 'demo-list', loading: true } }
      ]
    }
  ]
}
