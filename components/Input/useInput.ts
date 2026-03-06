import { ref, computed } from 'vue'

export function useInput(
  props: {
    type: string
    modelValue: string | number
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
    emit('update:modelValue', target.value)
  }

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  return {
    showPassword,
    currentType,
    isPassword,
    handleInput,
    togglePassword,
  }
}
