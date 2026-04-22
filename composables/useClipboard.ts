import { useAliceToast } from '../index'

/**
 * Composable utility for clipboard operations inside the Alice UI ecosystem.
 * Includes automatic integration with the toast notification system.
 */
export function useClipboard() {
  const { add: addToast } = useAliceToast()

  /**
   * Copies text to the system clipboard and shows a toast notification.
   * @param text The string to copy
   * @param successMessage Optional custom success message
   * @returns Promise<boolean> indicating success
   */
  async function copyToClipboard(text: string | number, successMessage = 'Copiado al portapapeles') {
    const val = String(text)
    if (!val) return false

    try {
      // Use modern clipboard API
      await navigator.clipboard.writeText(val)
      
      addToast({
        title: 'Copiado',
        message: successMessage,
        type: 'success',
      })
      
      return true
    } catch (err) {
      console.error('Alice UI: Failed to copy to clipboard', err)
      
      addToast({
        title: 'Error de Copiado',
        message: 'No se pudo acceder al portapapeles o el navegador no lo soporta.',
        type: 'error',
      })
      
      return false
    }
  }

  return {
    copyToClipboard,
  }
}
