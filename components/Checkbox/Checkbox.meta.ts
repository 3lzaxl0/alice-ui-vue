import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const checkboxMeta: ComponentDoc = {
  name: 'AliceCheckbox',
  description: 'Un control de selección binaria moderno que admite estados marcados, desmarcados, indeterminados (por ejemplo, para selección parcial en listas) y deshabilitados.',
  category: 'Entradas',
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Estado actual de selección (v-model para sincronización bidireccional).' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indica si el checkbox se encuentra en un estado mixto o parcial.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción con el control y le aplica estilos visuales inactivos.' },
    { name: 'id', type: 'string', default: 'undefined', description: 'Identificador único para el elemento input y asociación con la etiqueta.' },
    { name: 'name', type: 'string', default: 'undefined', description: 'Nombre para formularios HTML del control de checkbox.' },
    { name: 'label', type: 'string', default: 'undefined', description: 'Texto que acompaña al checkbox. También se puede inyectar mediante el slot por defecto.' },
  ],
  demoOptions: [
    { key: 'label', label: 'Label', type: 'text', value: 'Aceptar términos y condiciones' },
    { key: 'modelValue', label: 'Checked', type: 'boolean', value: false },
    { key: 'indeterminate', label: 'Indeterminate', type: 'boolean', value: false },
    { key: 'disabled', label: 'Disabled', type: 'boolean', value: false },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    attrs.push(`  :model-value="${opts.modelValue ?? false}"`)
    if (opts.indeterminate) attrs.push('  :indeterminate="true"')
    if (opts.disabled) attrs.push('  :disabled="true"')
    if (opts.label) attrs.push(`  label="${opts.label}"`)

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceCheckbox${attrsStr}/>`
  },
  showcaseSections: [
    {
      title: 'Estados de Selección',
      items: [
        { label: 'Desmarcado', props: { modelValue: false, label: 'Guardar información de sesión' } },
        { label: 'Marcado', props: { modelValue: true, label: 'Acepto recibir correos promocionales' } },
        { label: 'Indeterminado', props: { indeterminate: true, label: 'Seleccionar todos los servidores' } },
      ],
    },
    {
      title: 'Estados de Interacción',
      items: [
        { label: 'Desmarcado Deshabilitado', props: { disabled: true, modelValue: false, label: 'Habilitar autenticación biométrica (No disponible)' } },
        { label: 'Marcado Deshabilitado', props: { disabled: true, modelValue: true, label: 'Términos de servicio aceptados' } },
      ],
    },
  ],
}
