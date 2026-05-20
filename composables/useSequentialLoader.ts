import { ref } from 'vue'

export interface LoaderStep {
  /** Texto descriptivo que se muestra mientras se ejecuta este paso. */
  name: string
  /** Función asíncrona a ejecutar. */
  action: () => Promise<unknown>
  /**
   * Peso del paso en porcentaje (0-100).
   * La suma de todos los pesos debería ser 100.
   * Si no se especifica, el peso restante se distribuye equitativamente.
   */
  weight?: number
}

export interface SequentialLoaderOptions {
  /** Texto principal mientras se ejecutan los pasos. */
  defaultText?: string
  /** Milisegundos de pausa al completar antes de cerrar el overlay. Por defecto: 500ms. */
  completionDelay?: number
}

/**
 * Composable para ejecutar una serie de pasos de carga secuenciales,
 * actualizando el progreso y la descripción en tiempo real.
 *
 * Diseñado para usarse junto con `<AliceLoading type="master">`.
 *
 * @example
 * ```ts
 * const loader = useSequentialLoader({ defaultText: 'Iniciando...' })
 *
 * await loader.execute([
 *   { name: 'Cargando constantes...', action: () => constantes.loadIfNeeded(), weight: 50 },
 *   { name: 'Cargando materiales...', action: () => materiales.loadMateriales(), weight: 50 },
 * ])
 * ```
 */
export function useSequentialLoader(options: SequentialLoaderOptions = {}) {
  const active = ref(false)
  const progress = ref(0)
  const text = ref(options.defaultText || 'Cargando...')
  const description = ref('')

  /**
   * Ejecuta secuencialmente los pasos especificados, actualizando el
   * progreso y la descripción visible en el overlay de carga.
   */
  async function execute(steps: LoaderStep[], customText?: string): Promise<void> {
    if (active.value) return // Evitar ejecuciones simultáneas

    active.value = true
    progress.value = 0
    text.value = customText || options.defaultText || 'Cargando...'
    description.value = 'Iniciando carga...'

    // Calcular pesos: los pasos sin peso explícito se reparten el restante
    const stepsWithWeight = steps.filter((s) => s.weight !== undefined)
    const fixedWeightSum = stepsWithWeight.reduce((sum, s) => sum + (s.weight || 0), 0)

    if (fixedWeightSum > 100) {
      console.warn('[useSequentialLoader]: La suma de pesos excede el 100%.')
    }

    const unweightedCount = steps.length - stepsWithWeight.length
    const remainingWeight = Math.max(0, 100 - fixedWeightSum)
    const defaultWeight = unweightedCount > 0 ? remainingWeight / unweightedCount : 0

    try {
      let accumulated = 0

      for (const step of steps) {
        description.value = step.name
        await step.action()

        const stepWeight = step.weight !== undefined ? step.weight : defaultWeight
        accumulated = Math.min(100, accumulated + stepWeight)
        progress.value = Math.round(accumulated)
      }

      // Asegurar el 100% final
      progress.value = 100
      description.value = 'Listo'

      // Pausa suave para que el usuario vea el 100%
      await new Promise<void>((resolve) =>
        setTimeout(resolve, options.completionDelay ?? 500),
      )
    } catch (error) {
      description.value = 'Ocurrió un error al cargar los datos'
      console.error('[useSequentialLoader] Error durante el flujo de carga:', error)
      throw error // Re-propagar para manejo externo
    } finally {
      active.value = false
    }
  }

  return {
    active,
    progress,
    text,
    description,
    execute,
  }
}
