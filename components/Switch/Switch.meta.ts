import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const switchMeta: ComponentDoc = {
  name: 'AliceSwitch',
  description: 'Componente de palanca interactiva (toggle switch) utilizado para alternar entre dos estados booleanos con transiciones animadas y soporte semántico.',
  category: 'Entradas',
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Valor reactivo del estado de la palanca (v-model).' },
    { name: 'variant', type: 'primary | status', default: 'primary', description: 'Estilo de color. primary usa el color de marca, status alterna entre rojo (inactivo) y verde (activo).' },
    { name: 'size', type: 'sm | md | lg', default: 'md', description: 'Dimensiones físicas del switch.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción con el switch.' },
    { name: 'label', type: 'string', default: '""', description: 'Texto descriptivo que se muestra junto al switch.' },
    { name: 'id', type: 'string', default: '""', description: 'Identificador único para el input interno.' },
    { name: 'name', type: 'string', default: '""', description: 'Nombre para formularios nativos.' },
  ],
  demoOptions: [
    { key: 'modelValue', label: 'modelValue (Estado)', type: 'boolean', value: true },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'status'], value: 'primary' },
    { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'], value: 'md' },
    { key: 'disabled', label: 'Disabled', type: 'boolean', value: false },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    attrs.push(`  :model-value="${opts.modelValue ?? false}"`)
    if (opts.variant !== 'primary') attrs.push(`  variant="${opts.variant}"`)
    if (opts.size !== 'md') attrs.push(`  size="${opts.size}"`)
    if (opts.disabled === true) attrs.push('  :disabled="true"')
    
    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceSwitch${attrsStr}label="Ajustes de Notificación" />`
  },
  showcaseSections: [
    {
      title: 'Variantes Visuales (variant)',
      wrapInCard: false,
      items: [
        { label: 'Primary (Activo)', props: { variant: 'primary', modelValue: true } },
        { label: 'Primary (Inactivo)', props: { variant: 'primary', modelValue: false } },
        { label: 'Status (Activo/Verde)', props: { variant: 'status', modelValue: true } },
        { label: 'Status (Inactivo/Rojo)', props: { variant: 'status', modelValue: false } },
      ],
    },
    {
      title: 'Tamaños Físicos (size)',
      wrapInCard: false,
      items: [
        { label: 'Small (sm)', props: { size: 'sm', modelValue: true } },
        { label: 'Medium (md)', props: { size: 'md', modelValue: true } },
        { label: 'Large (lg)', props: { size: 'lg', modelValue: true } },
      ],
    },
    {
      title: 'Estados de Control',
      wrapInCard: false,
      items: [
        { label: 'Deshabilitado Inactivo', props: { disabled: true, modelValue: false } },
        { label: 'Deshabilitado Activo', props: { disabled: true, modelValue: true } },
      ],
    },
  ],
}
