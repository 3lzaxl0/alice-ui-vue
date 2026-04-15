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

export function addAliceToast(toast: Omit<Toast, 'id'>) {
  const id = crypto.randomUUID()
  const duration = toast.duration ?? 5000 // default 5s

  const newToast: Toast = { ...toast, id, duration }
  toasts.value.push(newToast)

  if (duration > 0) {
    setTimeout(() => {
      removeAliceToast(id)
    }, duration)
  }
}

export function removeAliceToast(id: string) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

export function useToast() {
  return {
    toasts,
    add: addAliceToast,
    remove: removeAliceToast,
  }
}
