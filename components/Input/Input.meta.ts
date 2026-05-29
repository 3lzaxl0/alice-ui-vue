import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const inputMeta: ComponentDoc = {
  name: 'AliceInput',
  description: 'Un control de entrada de texto moderno y versátil. Admite etiquetas nativas, iconos principales, acciones secundarias de limpieza (clearable), modo contraseña (ocultar/mostrar), modos numéricos con control de paso (stepper), validación de errores visuales y contadores de caracteres.',
  category: 'Entradas',
  props: [
    { name: 'id', type: 'string', default: 'undefined', description: 'Identificador único requerido para asociar el input con su etiqueta.' },
    { name: 'modelValue', type: 'string | number', default: '""', description: 'Valor reactivo del campo (v-model).' },
    { name: 'label', type: 'string', default: 'undefined', description: 'Texto de la etiqueta que se ubica sobre el input.' },
    { name: 'type', type: 'string', default: '"text"', description: 'Tipo de entrada nativa (text, password, number, email, tel, etc.).' },
    { name: 'placeholder', type: 'string', default: '""', description: 'Texto de ayuda temporal dentro del campo vacío.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Indica si el campo es de llenado obligatorio.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción y edición del campo.' },
    { name: 'variant', type: 'default | success | warning', default: 'default', description: 'Estado y diseño del borde del input.' },
    { name: 'icon', type: 'Component | object', default: 'undefined', description: 'Icono de Lucide para mostrar al inicio del campo.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Muestra un botón de limpieza rápida (X) cuando el campo tiene valor.' },
    { name: 'error', type: 'boolean | string', default: 'false', description: 'Indica un estado de error, alternativamente acepta un string con el mensaje.' },
    { name: 'errorMessage', type: 'string', default: 'undefined', description: 'Mensaje de error explícito debajo del campo.' },
    { name: 'helperText', type: 'string', default: 'undefined', description: 'Texto secundario de ayuda o descripción debajo del campo.' },
    { name: 'maxlength', type: 'number', default: 'undefined', description: 'Límite máximo de caracteres permitidos.' },
    { name: 'showCounter', type: 'boolean', default: 'false', description: 'Muestra la cuenta de caracteres actuales respecto al límite.' },
  ],
  demoOptions: [
    { key: 'label', label: 'Label', type: 'text', value: 'Correo Electrónico' },
    { key: 'placeholder', label: 'Placeholder', type: 'text', value: 'ejemplo@correo.com' },
    { key: 'modelValue', label: 'modelValue (Valor)', type: 'text', value: 'contacto@alice.com' },
    { key: 'type', label: 'Type', type: 'select', options: ['text', 'password', 'number', 'email'], value: 'email' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['default', 'success', 'warning'], value: 'default' },
    { key: 'hasIcon', label: 'Has Icon', type: 'boolean', value: true },
    { key: 'clearable', label: 'Clearable', type: 'boolean', value: true },
    { key: 'disabled', label: 'Disabled', type: 'boolean', value: false },
    { key: 'required', label: 'Required', type: 'boolean', value: false },
    { key: 'error', label: 'Error', type: 'boolean', value: false },
    { key: 'errorMessage', label: 'Error Message', type: 'text', value: '' },
    { key: 'helperText', label: 'Helper Text', type: 'text', value: 'Nunca compartiremos tu correo electrónico con terceros.' },
    { key: 'maxlength', label: 'Max Length', type: 'text', value: '50' },
    { key: 'showCounter', label: 'Show Counter', type: 'boolean', value: true },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    attrs.push(`  id="input-demo"`)
    attrs.push(`  v-model="email"`)
    if (opts.label) attrs.push(`  label="${opts.label}"`)
    if (opts.type !== 'text') attrs.push(`  type="${opts.type}"`)
    if (opts.placeholder) attrs.push(`  placeholder="${opts.placeholder}"`)
    if (opts.variant !== 'default') attrs.push(`  variant="${opts.variant}"`)
    if (opts.hasIcon) attrs.push('  :icon="Mail"')
    if (opts.clearable) attrs.push('  :clearable="true"')
    if (opts.disabled) attrs.push('  :disabled="true"')
    if (opts.required) attrs.push('  :required="true"')
    if (opts.error) attrs.push('  :error="true"')
    if (opts.errorMessage) attrs.push(`  error-message="${opts.errorMessage}"`)
    if (opts.helperText) attrs.push(`  helper-text="${opts.helperText}"`)
    if (opts.maxlength) attrs.push(`  :maxlength="${opts.maxlength}"`)
    if (opts.showCounter) attrs.push('  :show-counter="true"')

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    return `<AliceInput${attrsStr}/>`
  },
  showcaseSections: [
    {
      title: 'Variantes Visuales & Estados',
      wrapInCard: false,
      items: [
        { label: 'Predeterminado (Default)', props: { id: 'in-1', variant: 'default', placeholder: 'Borde sutil neutro' } },
        { label: 'Éxito (Success)', props: { id: 'in-2', variant: 'success', modelValue: 'Datos validados correctamente', placeholder: 'Borde verde' } },
        { label: 'Advertencia (Warning)', props: { id: 'in-3', variant: 'warning', modelValue: 'Contraseña poco segura', placeholder: 'Borde amarillo/naranja' } },
        { label: 'Error con Mensaje', props: { id: 'in-4', variant: 'default', error: true, errorMessage: 'El formato de correo es incorrecto.', placeholder: 'Borde rojo y mensaje de validación' } },
      ],
    },
    {
      title: 'Funcionalidades Especiales',
      wrapInCard: false,
      items: [
        { label: 'Campo Contraseña (Password Toggle)', props: { id: 'in-pwd', type: 'password', modelValue: 'SecretoAlice123', label: 'Contraseña' } },
        { label: 'Campo Numérico (Number Stepper)', props: { id: 'in-num', type: 'number', modelValue: 42, label: 'Edad', helperText: 'Usa las flechas a la derecha para incrementar/decrementar' } },
        { label: 'Con Botón Limpiador (Clearable)', props: { id: 'in-clr', modelValue: 'Borra este texto de forma rápida con un clic', clearable: true, label: 'Limpiable' } },
        { label: 'Con Límite y Contador de Caracteres', props: { id: 'in-cnt', modelValue: 'Mensaje corto', maxlength: 30, showCounter: true, label: 'Contenido del estado' } },
      ],
    },
  ],
}
