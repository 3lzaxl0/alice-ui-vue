/**
 * Global stack to track open dialogs and ensure only the topmost one
 * responds to the Escape key at any given time.
 */
import { ref } from 'vue'

const stack = ref<symbol[]>([])

export function useDialogStack() {
  const id = Symbol('dialog')

  function register() {
    stack.value.push(id)
  }

  function unregister() {
    const idx = stack.value.lastIndexOf(id)
    if (idx !== -1) stack.value.splice(idx, 1)
  }

  function isTop(): boolean {
    return stack.value.length > 0 && stack.value[stack.value.length - 1] === id
  }

  return { register, unregister, isTop }
}
