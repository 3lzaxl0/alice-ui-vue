import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'
import { CircleCheckBig } from 'lucide-vue-next'

export const buttonMeta: ComponentDoc = {
  name: 'AliceButton',
  description: 'Componente de acción interactiva que soporta múltiples variantes visuales, estados de carga y animaciones.',
  category: 'Acción',
  props: [
    { name: 'variant', type: 'primary | success | warning | error | info | ghost', default: 'primary', description: 'Color semántico principal del botón.' },
    { name: 'design', type: 'solid | ghost | outline | ghost-subtle', default: 'solid', description: 'Apariencia visual del botón.' },
    { name: 'size', type: 'sm | md | lg | icon | icon-sm', default: 'md', description: 'Dimensiones físicas del botón.' },
    { name: 'radius', type: 'none | sm | md | lg | full', default: 'md', description: 'Radio de borde del botón.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Activa el spinner de carga y deshabilita la interacción.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción del botón.' },
    { name: 'expanded', type: 'boolean', default: 'false', description: 'Fuerza al botón a ocupar el 100% del ancho contenedor.' },
    { name: 'icon', type: 'Component | object', default: 'undefined', description: 'Componente de icono de Lucide u objeto SVG a renderizar al lado del texto.' },
    { name: 'iconSize', type: 'number', default: '20', description: 'Tamaño del icono interno del botón.' },
    { name: 'loadingAnimateIcon', type: 'boolean', default: 'false', description: 'Si es true y loading está activo, hace que el propio icono del botón gire en lugar de mostrar un spinner.' },
  ],
  demoOptions: [
    { key: 'slotContent', label: 'Texto del Botón', type: 'text', value: 'Confirmar Acción' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'success', 'warning', 'error', 'info', 'ghost'], value: 'primary' },
    { key: 'design', label: 'Design', type: 'select', options: ['solid', 'ghost', 'outline', 'ghost-subtle'], value: 'solid' },
    { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg', 'icon', 'icon-sm'], value: 'md' },
    { key: 'radius', label: 'Radius', type: 'select', options: ['none', 'sm', 'md', 'lg', 'full'], value: 'md' },
    { key: 'hasIcon', label: 'Mostrar Icono (icon)', type: 'boolean', value: false },
    { key: 'iconSize', label: 'Tamaño Icono (iconSize)', type: 'select', options: ['12', '16', '20', '24'], value: '20' },
    { key: 'loadingAnimateIcon', label: 'Animar Icono al Cargar', type: 'boolean', value: false },
    { key: 'loading', label: 'Loading', type: 'boolean', value: false },
    { key: 'disabled', label: 'Disabled', type: 'boolean', value: false },
    { key: 'expanded', label: 'Expanded', type: 'boolean', value: false },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.variant !== 'primary') attrs.push(`  variant="${opts.variant}"`)
    if (opts.design !== 'solid') attrs.push(`  design="${opts.design}"`)
    if (opts.size !== 'md') attrs.push(`  size="${opts.size}"`)
    if (opts.radius !== 'md') attrs.push(`  radius="${opts.radius}"`)
    if (opts.hasIcon === true) attrs.push('  :icon="CircleCheckBig"')
    if (opts.iconSize && opts.iconSize !== '20') attrs.push(`  :icon-size="${opts.iconSize}"`)
    if (opts.loadingAnimateIcon === true) attrs.push('  :loading-animate-icon="true"')
    if (opts.loading === true) attrs.push('  :loading="true"')
    if (opts.disabled === true) attrs.push('  :disabled="true"')
    if (opts.expanded === true) attrs.push('  :expanded="true"')

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceButton${attrsStr}>
  ${opts.slotContent ?? 'Confirmar Acción'}
</AliceButton>`
  },
  showcaseSections: [
    {
      title: 'Variantes de Color (variant)',
      wrapInCard: false,
      items: [
        { label: 'Primary', props: { variant: 'primary' } },
        { label: 'Success', props: { variant: 'success' } },
        { label: 'Warning', props: { variant: 'warning' } },
        { label: 'Error', props: { variant: 'error' } },
        { label: 'Info', props: { variant: 'info' } },
        { label: 'Ghost', props: { variant: 'ghost' } },
      ],
    },
    {
      title: 'Diseños de Apariencia (design)',
      wrapInCard: false,
      items: [
        { label: 'Solid (Por defecto)', props: { design: 'solid' } },
        { label: 'Ghost', props: { design: 'ghost' } },
        { label: 'Outline', props: { design: 'outline' } },
        { label: 'Ghost-Subtle', props: { design: 'ghost-subtle' } },
      ],
    },
    {
      title: 'Tamaños Físicos (size)',
      wrapInCard: false,
      items: [
        { label: 'Small (sm)', props: { size: 'sm' } },
        { label: 'Medium (md)', props: { size: 'md' } },
        { label: 'Large (lg)', props: { size: 'lg' } },
        { label: 'Icon (icon)', props: { size: 'icon', icon: CircleCheckBig } },
        { label: 'Icon Small (icon-sm)', props: { size: 'icon-sm', icon: CircleCheckBig } },
      ],
    },
    {
      title: 'Radios de Esquina (radius)',
      wrapInCard: false,
      items: [
        { label: 'None', props: { radius: 'none' } },
        { label: 'Small (sm)', props: { radius: 'sm' } },
        { label: 'Medium (md)', props: { radius: 'md' } },
        { label: 'Large (lg)', props: { radius: 'lg' } },
        { label: 'Full / Rounded', props: { radius: 'full' } },
      ],
    },
    {
      title: 'Estados de Control',
      wrapInCard: true,
      items: [
        { label: 'Estado de Carga (loading)', props: { loading: true }, slotContent: 'Cargando...' },
        { label: 'Estado Deshabilitado (disabled)', props: { disabled: true }, slotContent: 'Deshabilitado' },
        { label: 'Ancho Expandido (expanded)', props: { expanded: true }, slotContent: 'Expandido' },
      ],
    },
  ],
}
