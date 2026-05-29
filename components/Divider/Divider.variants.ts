import { cva } from 'class-variance-authority'

/**
 * Variantes del trazo (borde) para AliceDivider.
 * Solo controla color y estilo CSS. El grosor se gestiona
 * de forma direccional en el componente para evitar colisión
 * entre border-t / border-l y border-{n}.
 */
export const dividerLineVariants = cva('', {
  variants: {
    /**
     * Estilo visual del trazo:
     * - light:  Línea suave, para separaciones de bajo contraste (ej. interior de cards)
     * - normal: Línea estándar, visible y legible en ambos modos
     * - dashed: Trazo discontinuo, ideal para separadores de sección
     * - dotted: Trazo punteado, estilo más decorativo
     */
    variant: {
      light:  'border-gray-200 dark:border-white/5',
      normal: 'border-gray-300 dark:border-white/10',
      dashed: 'border-gray-300 dark:border-white/15',
      dotted: 'border-gray-300 dark:border-white/15',
    },
    /**
     * Estilo del trazo CSS:
     * - solid:  Línea continua (default para light y normal)
     * - dashed: Trazos discontinuos amplios
     * - dotted: Puntos
     */
    style: {
      solid:  'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    },
  },
  defaultVariants: {
    variant: 'normal',
    style:   'solid',
  },
})
