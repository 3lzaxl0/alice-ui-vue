import { ref, computed } from 'vue'

export function useInput(
  props: {
    type: string
    modelValue: string | number
    onlyIntegers?: boolean
    disabled?: boolean
    min?: string | number
    max?: string | number
    step?: string | number
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

  /* -------------------------------------------------------------------------- */
  /*                               NUMERIC STEPPER                              */
  /* -------------------------------------------------------------------------- */
  function updateNumericValue(delta: number) {
    if (props.disabled) return

    const current = typeof props.modelValue === 'number' ? props.modelValue : parseFloat(String(props.modelValue))
    const base = isNaN(current) ? 0 : current
    const step = typeof props.step === 'number' ? props.step : parseFloat(String(props.step || 1))
    
    const getDecimals = (val: number) => String(val).split('.')[1]?.length || 0
    const maxDecimals = Math.max(getDecimals(base), getDecimals(step))
    
    let newValue = base + delta * step
    
    // Fix floating point precision artifacts (e.g., 0.060000000000000005)
    newValue = Number(newValue.toFixed(maxDecimals))

    // Check bounds
    if (props.min !== undefined) {
      const minVal = typeof props.min === 'number' ? props.min : parseFloat(String(props.min))
      if (!isNaN(minVal) && newValue < minVal) newValue = minVal
    }
    if (props.max !== undefined) {
      const maxVal = typeof props.max === 'number' ? props.max : parseFloat(String(props.max))
      if (!isNaN(maxVal) && newValue > maxVal) newValue = maxVal
    }

    emit('update:modelValue', newValue)
  }

  const stepUp = () => updateNumericValue(1)
  const stepDown = () => updateNumericValue(-1)

  return {
    showPassword,
    currentType,
    isPassword,
    handleInput,
    togglePassword,
    clearValue,
    stepUp,
    stepDown,
  }
}
