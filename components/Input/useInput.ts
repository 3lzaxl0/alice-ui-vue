import { ref, computed } from 'vue'

export function useInput(
  props: {
    type: string
    modelValue: string | number
    onlyIntegers?: boolean
    disabled?: boolean
  },
  emit: {
    (e: 'update:modelValue', value: string | number): void
  },
) {
  const showPassword = ref(false)

  const currentType = computed(() => {
    if (props.type === 'password' && showPassword.value) {
      return 'text'
    }
    return props.type
  })

  const isPassword = computed(() => props.type === 'password')

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    let value = target.value

    if (props.onlyIntegers) {
      // Remove everything that is NOT a digit
      value = value.replace(/\D/g, '')
      // Sync the input value in case someone typed a non-digit
      if (target.value !== value) {
        target.value = value
      }
    }

    if (props.type === 'number') {
      const parsed = parseFloat(value)
      emit('update:modelValue', isNaN(parsed) ? 0 : parsed)
    } else {
      emit('update:modelValue', value)
    }
  }

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  function clearValue() {
    if (props.disabled) return
    emit('update:modelValue', '')
  }

  return {
    showPassword,
    currentType,
    isPassword,
    handleInput,
    togglePassword,
    clearValue,
  }
}
