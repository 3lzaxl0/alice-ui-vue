import { ref, watch, computed, nextTick } from 'vue'

export function useDatePicker(
  props: {
    modelValue: string | null // YYYY-MM-DD
    disabled?: boolean
  },
  emit: {
    (e: 'update:modelValue', value: string | null): void
  },
) {
  const isOpen = ref(false)
  const containerRef = ref<HTMLElement | null>(null)
  const inputRef = ref<HTMLInputElement | null>(null)

  // Mask: DD/MM/YYYY
  const MASK_BASE = '__/__/____'
  const SEPARATOR = '/'

  const inputText = ref('')

  function modelToDisplay(val: string | null): string {
    if (!val) return ''
    const parts = val.split('-')
    if (parts.length !== 3) return ''
    const [y, m, d] = parts
    return `${d}/${m}/${y}`
  }

  watch(
    () => props.modelValue,
    (val) => {
      inputText.value = modelToDisplay(val)
    },
    { immediate: true },
  )

  const maskOverlay = computed(() => {
    let result = ''
    for (let i = 0; i < MASK_BASE.length; i++) {
      if (inputText.value[i]) {
        result += ' '
      } else {
        result += MASK_BASE[i]
      }
    }
    return result
  })

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    const raw = input.value.replace(/[^0-9/]/g, '')
    const digits = raw.replace(/\//g, '')
    const trimmed = digits.slice(0, 8)

    let formatted = ''
    for (let i = 0; i < trimmed.length; i++) {
      if (i === 2 || i === 4) formatted += SEPARATOR
      formatted += trimmed[i]
    }

    inputText.value = formatted
    input.value = formatted

    if (formatted.length === 10) {
      const parsed = parseDisplayDate(formatted)
      if (parsed) {
        emit('update:modelValue', parsed)
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    // Basic navigation and editing keys
    const allowed = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ]

    // Check if user is trying to open calendar via keyboard
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      if (!isOpen.value && !props.disabled) {
        e.preventDefault()
        isOpen.value = true
        return
      }
    }

    if (allowed.includes(e.key)) return

    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return

    if (/^\d$/.test(e.key)) {
      const digits = inputText.value.replace(/\//g, '')
      if (digits.length >= 8) {
        e.preventDefault()
      }
      return
    }

    if (e.key === '/') {
      e.preventDefault()
    } else {
      e.preventDefault()
    }
  }

  function handleBlur() {
    if (inputText.value && inputText.value.length > 0 && inputText.value.length < 10) {
      inputText.value = modelToDisplay(props.modelValue)
    } else if (inputText.value.length === 10) {
      const parsed = parseDisplayDate(inputText.value)
      if (!parsed) {
        inputText.value = modelToDisplay(props.modelValue)
      }
    } else if (inputText.value === '') {
      if (props.modelValue !== null) {
        emit('update:modelValue', null)
      }
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData?.getData('text') || ''
    const digits = pasted.replace(/[^0-9]/g, '').slice(0, 8)
    let formatted = ''
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4) formatted += SEPARATOR
      formatted += digits[i]
    }
    inputText.value = formatted
    if (inputRef.value) inputRef.value.value = formatted

    if (formatted.length === 10) {
      const parsed = parseDisplayDate(formatted)
      if (parsed) emit('update:modelValue', parsed)
    }
  }

  function parseDisplayDate(display: string): string | null {
    const parts = display.split(SEPARATOR)
    if (parts.length !== 3) return null
    const [dd, mm, yyyy] = parts
    if (!dd || !mm || !yyyy || yyyy.length !== 4) return null

    const day = parseInt(dd, 10)
    const month = parseInt(mm, 10)
    const year = parseInt(yyyy, 10)

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    if (month < 1 || month > 12) return null
    if (day < 1 || day > 31) return null
    if (year < 1900 || year > 2200) return null

    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null
    }

    const m = String(month).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  const selectDate = (dateStr: string | null) => {
    emit('update:modelValue', dateStr)
    isOpen.value = false
    nextTick(() => inputRef.value?.focus())
  }

  const clearDate = (e: Event) => {
    e.stopPropagation()
    emit('update:modelValue', null)
    inputText.value = ''
    inputRef.value?.focus()
  }

  const toggleCalendar = () => {
    if (!props.disabled) {
      isOpen.value = !isOpen.value
      if (!isOpen.value) {
        nextTick(() => inputRef.value?.focus())
      }
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  }

  return {
    isOpen,
    containerRef,
    inputRef,
    inputText,
    maskOverlay,
    handleInput,
    handleKeydown,
    handleBlur,
    handlePaste,
    selectDate,
    clearDate,
    toggleCalendar,
    handleClickOutside,
  }
}
