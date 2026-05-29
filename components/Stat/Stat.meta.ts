import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'
import { TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-vue-next'

export const statMeta: ComponentDoc = {
  name: 'AliceStat',
  description: 'Componente de tarjeta estadística (Stat Card) para cuadros de mando y paneles. Ideal para resaltar indicadores clave (KPIs), métricas de rendimiento o conteos rápidos con soporte de iconos, sufijos y footers informativos.',
  category: 'Presentación',
  props: [
    { name: 'variant', type: 'primary | success | warning | error | info | neutral', default: 'neutral', description: 'Variante semántica de color para el texto del valor y el estilo del icono.' },
    { name: 'title', type: 'string', default: '""', description: 'Etiqueta o título descriptivo del indicador.' },
    { name: 'value', type: 'string | number', default: '""', description: 'El número o dato estadístico principal a mostrar.' },
    { name: 'icon', type: 'Component', default: 'undefined', description: 'Icono contextual de Lucide para ilustrar la métrica.' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'Determina si la tarjeta responde a interacciones (efecto hover).' },
    { name: 'valueClass', type: 'string', default: '""', description: 'Clases de estilo adicionales para el texto del valor.' },
  ],
  demoOptions: [
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'], value: 'primary' },
    { key: 'title', label: 'Title', type: 'text', value: 'Ventas Mensuales' },
    { key: 'value', label: 'Value', type: 'text', value: '$12,450.00' },
    { key: 'hasIcon', label: 'Mostrar Icono', type: 'boolean', value: true },
    { key: 'interactive', label: 'Interactive', type: 'boolean', value: false },
    { key: 'hasFooter', label: 'Mostrar Pie de Página', type: 'boolean', value: true },
    { key: 'footerText', label: 'Texto del Pie', type: 'text', value: '+15% respecto al mes anterior' },
  ],
  codeTemplate: (opts) => {
    const attrs: string[] = []
    if (opts.variant !== 'neutral') attrs.push(`  variant="${opts.variant}"`)
    attrs.push(`  title="${opts.title || 'Métrica'}"`)
    attrs.push(`  value="${opts.value || '0'}"`)
    if (opts.hasIcon) attrs.push('  :icon="TrendingUp"')
    if (opts.interactive === true) attrs.push('  :interactive="true"')

    const attrsStr = attrs.length > 0 ? '\n' + attrs.join('\n') + '\n' : ' '
    const footerStr = opts.hasFooter ? `\n  <template #footer>${opts.footerText || ''}</template>` : ''
    return `<AliceStat${attrsStr}>\n  <template #suffix>USD</template>${footerStr}\n</AliceStat>`
  },
  showcaseSections: [
    {
      title: 'Variantes Semánticas',
      items: [
        { label: 'Primary (Marca)', props: { icon: TrendingUp, title: 'Conversión', value: '24.8%', variant: 'primary' } },
        { label: 'Success (Logro)', props: { icon: DollarSign, title: 'Ingresos Netos', value: '$45,210', variant: 'success' } },
        { label: 'Warning (Alerta)', props: { icon: AlertTriangle, title: 'Tareas Pendientes', value: '18', variant: 'warning' } },
        { label: 'Neutral (Estándar)', props: { icon: Users, title: 'Usuarios Activos', value: '1,204', variant: 'neutral' } },
      ],
    },
    {
      title: 'Distribución y Contenido (Slots)',
      items: [
        { label: 'Con Sufijo', props: { icon: DollarSign, title: 'Presupuesto', value: '85,000', variant: 'info' }, slotContent: 'EUR' },
      ],
    },
  ],
}
