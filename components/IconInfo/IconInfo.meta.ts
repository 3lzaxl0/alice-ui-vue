import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'
import { Mail, Phone, Calendar, ShieldCheck } from 'lucide-vue-next'

export const iconInfoMeta: ComponentDoc = {
  name: 'AliceIconInfo',
  description: 'Componente para visualización compacta de información estructurada (clave-valor) acompañada de un icono contextual, con soporte de alineación horizontal/vertical y variantes semánticas.',
  category: 'Presentación',
  props: [
    { name: 'icon', type: 'Component', default: 'undefined', description: 'Icono contextual de Lucide que se muestra en un círculo coloreado.' },
    { name: 'label', type: 'string', default: 'undefined', description: 'Etiqueta superior o descriptor del dato (ej. "CORREO ELECTRÓNICO").' },
    { name: 'value', type: 'string', default: 'undefined', description: 'El valor o dato principal que se desea mostrar.' },
    { name: 'variant', type: 'default | primary | info | success | warning | error', default: 'default', description: 'Variante de color semántico o de marca aplicada al círculo del icono y el texto del valor.' },
    { name: 'layout', type: 'horizontal | vertical', default: 'vertical', description: 'Orientación del texto: vertical (etiqueta sobre el valor) u horizontal (etiqueta al lado del valor).' },
  ],
  demoOptions: [
    { key: 'hasIcon', label: 'Mostrar Icono', type: 'boolean', value: true },
    { key: 'label', label: 'Label', type: 'text', value: 'Fecha de Registro' },
    { key: 'value', label: 'Value', type: 'text', value: '29 de Mayo, 2026' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'primary', 'info', 'success', 'warning', 'error'], value: 'default' },
    { key: 'layout', label: 'Layout', type: 'select', options: ['vertical', 'horizontal'], value: 'vertical' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.hasIcon) attrs.push('  :icon="Calendar"')
    attrs.push(`  label="${opts.label || 'FECHA'}"`)
    attrs.push(`  value="${opts.value || '29 de Mayo, 2026'}"`)
    if (opts.variant !== 'default') attrs.push(`  variant="${opts.variant}"`)
    if (opts.layout !== 'vertical') attrs.push(`  layout="${opts.layout}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceIconInfo${attrsStr}/>`
  },
  showcaseSections: [
    {
      title: 'Variantes de Color (variant)',
      items: [
        { label: 'Default (Gris)', props: { icon: Mail, label: 'Email', value: 'contacto@alice.com', variant: 'default' } },
        { label: 'Primary (Marca)', props: { icon: ShieldCheck, label: 'Marca', value: 'Alice UI', variant: 'primary' } },
        { label: 'Info (Azul)', props: { icon: Phone, label: 'Teléfono', value: '+51 987 654 321', variant: 'info' } },
        { label: 'Success (Verde)', props: { icon: ShieldCheck, label: 'Estado', value: 'Verificado', variant: 'success' } },
        { label: 'Warning (Amarillo)', props: { icon: Calendar, label: 'Vencimiento', value: 'Mañana', variant: 'warning' } },
      ],
    },
    {
      title: 'Distribución de Texto (layout)',
      items: [
        { label: 'Vertical (Apilado)', props: { icon: Mail, label: 'Usuario', value: 'admin@alice.com', layout: 'vertical' } },
        { label: 'Horizontal (En línea)', props: { icon: Mail, label: 'Usuario', value: 'admin@alice.com', layout: 'horizontal' } },
      ],
    },
  ],
}
