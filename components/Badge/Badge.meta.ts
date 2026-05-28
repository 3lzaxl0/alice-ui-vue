import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'
import { Info, CheckCircle, AlertTriangle } from 'lucide-vue-next'

export const badgeMeta: ComponentDoc = {
  name: 'AliceBadge',
  description: 'Indicador visual compacto utilizado para destacar estados, etiquetas semánticas, contadores o clasificaciones en la interfaz.',
  category: 'Presentación',
  props: [
    { name: 'label', type: 'string (Requerido)', default: '""', description: 'El texto descriptivo a mostrar dentro de la etiqueta.' },
    { name: 'variant', type: 'success | warning | error | info | primary | default | indigo | purple | pink | cyan | emerald | amber | blue | violet | teal', default: 'default', description: 'Color semántico predefinido para el badge.' },
    { name: 'type', type: 'soft | filled | normal', default: 'soft', description: 'Estilo de fondo y borde del indicador.' },
    { name: 'icon', type: 'Component', default: 'undefined', description: 'Icono opcional de Lucide a renderizar a la izquierda del texto.' },
    { name: 'color', type: 'string (Hex)', default: 'undefined', description: 'Color hexadecimal personalizado. Sobrescribe la variante elegida.' },
  ],
  demoOptions: [
    { key: 'slotContent', label: 'Texto de la Etiqueta (label)', type: 'text', value: 'En Proceso' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'primary', 'success', 'warning', 'error', 'info', 'indigo', 'purple', 'pink', 'cyan', 'emerald', 'amber', 'blue', 'violet', 'teal'], value: 'primary' },
    { key: 'type', label: 'Type', type: 'select', options: ['soft', 'filled', 'normal'], value: 'soft' },
    { key: 'hasIcon', label: 'Mostrar Icono (icon)', type: 'boolean', value: false },
    { key: 'color', label: 'Color Hex Personalizado (color)', type: 'text', value: '' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []

    // Label is required, output first
    attrs.push(`  label="${opts.slotContent ?? 'En Proceso'}"`)

    if (opts.variant !== 'default') attrs.push(`  variant="${opts.variant}"`)
    if (opts.type !== 'soft') attrs.push(`  type="${opts.type}"`)
    if (opts.hasIcon === true) attrs.push('  :icon="Sparkles"')
    if (opts.color) attrs.push(`  color="${opts.color}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceBadge${attrsStr}/>`
  },
  showcaseSections: [
    {
      title: 'Variantes de Color Semánticas (variant)',
      wrapInCard: false,
      items: [
        { label: 'Default', props: { variant: 'default', label: 'Default / Neutro' } },
        { label: 'Primary', props: { variant: 'primary', label: 'Primary / Marca' } },
        { label: 'Success', props: { variant: 'success', label: 'Success / Exitoso', icon: CheckCircle } },
        { label: 'Warning', props: { variant: 'warning', label: 'Warning / Alerta', icon: AlertTriangle } },
        { label: 'Error', props: { variant: 'error', label: 'Error / Fallido' } },
        { label: 'Info', props: { variant: 'info', label: 'Info / Detalle', icon: Info } },
      ],
    },
    {
      title: 'Variantes de Color Secundarias y Estéticas (variant)',
      wrapInCard: false,
      items: [
        { label: 'Indigo', props: { variant: 'indigo', label: 'Indigo' } },
        { label: 'Purple', props: { variant: 'purple', label: 'Purple' } },
        { label: 'Pink', props: { variant: 'pink', label: 'Pink' } },
        { label: 'Cyan', props: { variant: 'cyan', label: 'Cyan' } },
        { label: 'Emerald', props: { variant: 'emerald', label: 'Emerald' } },
        { label: 'Amber', props: { variant: 'amber', label: 'Amber' } },
        { label: 'Blue', props: { variant: 'blue', label: 'Blue' } },
        { label: 'Violet', props: { variant: 'violet', label: 'Violet' } },
        { label: 'Teal', props: { variant: 'teal', label: 'Teal' } },
      ],
    },
    {
      title: 'Estilos de Presentación (type)',
      wrapInCard: false,
      items: [
        { label: 'Soft (Sutil - Por defecto)', props: { variant: 'primary', type: 'soft', label: 'Soft Badge' } },
        { label: 'Filled (Relleno)', props: { variant: 'primary', type: 'filled', label: 'Filled Badge' } },
        { label: 'Normal (Línea sin fondo)', props: { variant: 'primary', type: 'normal', label: 'Normal Badge' } },
      ],
    },
    {
      title: 'Colores Personalizados Dinámicos (color)',
      wrapInCard: false,
      items: [
        { label: 'Color Hex #FF5500', props: { color: '#FF5500', type: 'soft', label: 'Hex Soft' } },
        { label: 'Color Hex #8B5CF6', props: { color: '#8B5CF6', type: 'filled', label: 'Hex Filled' } },
        { label: 'Color Hex #EC4899', props: { color: '#EC4899', type: 'normal', label: 'Hex Normal' } },
      ],
    },
  ],
}
