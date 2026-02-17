import { ref } from 'vue'

export type ToastType = 'success' | 'date' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
}

// Global state for toasts
const toasts = ref<Toast[]>([])

export function useToast() {
  function add(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID()
    const duration = toast.duration ?? 5000 // default 5s

    const newToast: Toast = { ...toast, id, duration }
    toasts.value.push(newToast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function remove(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    add,
    remove,
  }
}
