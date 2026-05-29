import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'
import { Inbox, FolderOpen, Search } from 'lucide-vue-next'

export const emptyMeta: ComponentDoc = {
  name: 'AliceEmpty',
  description: 'Componente de estado vacío (Empty State) personalizable, ideal para mostrar cuando no hay registros, resultados de búsqueda o datos disponibles. Admite títulos, descripciones, bordes discretos, versiones compactas y botones o acciones personalizadas.',
  category: 'Presentación',
  props: [
    { name: 'icon', type: 'Component', default: 'undefined', description: 'Icono de Lucide que se muestra arriba del título para dar contexto visual.' },
    { name: 'title', type: 'string', default: 'undefined', description: 'Título opcional en negrita para resumir la situación o estado.' },
    { name: 'description', type: 'string', default: '""', description: 'Descripción o texto explicativo sobre por qué está vacío o qué hacer.' },
    { name: 'showBorder', type: 'boolean', default: 'true', description: 'Controla si se muestra el contenedor con un elegante borde discontinuo y fondo suave.' },
    { name: 'compact', type: 'boolean', default: 'false', description: 'Reduce los márgenes y dimensiones físicas, ideal para espacios o paneles reducidos.' },
    { name: 'fullHeight', type: 'boolean', default: 'false', description: 'Estira el contenedor para ocupar el 100% de la altura de su contenedor padre.' },
  ],
  demoOptions: [
    { key: 'hasIcon', label: 'Mostrar Icono', type: 'boolean', value: true },
    { key: 'title', label: 'Title', type: 'text', value: 'Sin Resultados Disponibles' },
    { key: 'description', label: 'Description', type: 'text', value: 'Prueba buscando con palabras clave diferentes o crea un nuevo elemento.' },
    { key: 'showBorder', label: 'Show Border', type: 'boolean', value: true },
    { key: 'compact', label: 'Compact Mode', type: 'boolean', value: false },
    { key: 'fullHeight', label: 'Full Height', type: 'boolean', value: false },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.hasIcon) attrs.push('  :icon="Inbox"')
    if (opts.title) attrs.push(`  title="${opts.title}"`)
    attrs.push(`  description="${opts.description || 'No hay datos disponibles.'}"`)
    if (opts.showBorder === false) attrs.push('  :show-border="false"')
    if (opts.compact === true) attrs.push('  :compact="true"')
    if (opts.fullHeight === true) attrs.push('  :full-height="true"')

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceEmpty${attrsStr}>\n  <AliceButton variant="primary" size="sm">Crear Registro</AliceButton>\n</AliceEmpty>`
  },
  showcaseSections: [
    {
      title: 'Estados de Visualización Básicos',
      items: [
        { label: 'Completo con Icono y Título', props: { icon: Inbox, title: 'No hay mensajes', description: 'Tu bandeja de entrada está vacía por ahora.' } },
        { label: 'Solo Descripción (Simple)', props: { description: 'No se encontraron resultados para la búsqueda realizada.' } },
      ],
    },
    {
      title: 'Variaciones de Contenedor',
      items: [
        { label: 'Modo Compacto (compact)', props: { icon: FolderOpen, title: 'Carpeta Vacía', description: 'Sube un archivo para comenzar.', compact: true } },
        { label: 'Sin Borde (sin contenedor)', props: { icon: Search, title: 'Sin Resultados', description: 'Por favor intenta otra búsqueda.', showBorder: false } },
      ],
    },
  ],
}
