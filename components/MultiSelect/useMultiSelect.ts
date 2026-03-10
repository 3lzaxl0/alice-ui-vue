import { ref, computed } from 'vue'

interface Option {
  label: string
  value: string | number
}

export function useMultiSelect(
  props: {
    modelValue: (string | number)[]
    options: Option[]
  },
  emit: {
    (e: 'update:modelValue', value: (string | number)[]): void
  },
) {
  const isOpen = ref(false)
  const containerRef = ref<HTMLElement | null>(null)

  // Accessibility state
  const activeIndex = ref(-1)
  const listboxRef = ref<HTMLElement | null>(null)
  const buttonRef = ref<HTMLElement | null>(null)

  const selectedDisplay = computed(() => {
    if (props.modelValue.length === 0) return ''
    if (props.modelValue.length === 1) {
      const opt = props.options.find((o) => o.value === props.modelValue[0])
      return opt ? opt.label : ''
    }
    const firstOpt = props.options.find((o) => o.value === props.modelValue[0])
    const firstLabel = firstOpt ? firstOpt.label : ''
    return `${firstLabel}, +${props.modelValue.length - 1}`
  })

  const fullSelectionLabel = computed(() => {
    return props.options
      .filter((opt) => props.modelValue.includes(opt.value))
      .map((opt) => opt.label)
      .join(', ')
  })

  const someSelected = computed(() => props.modelValue.length > 0)
  const allSelected = computed(
    () => props.options.length > 0 && props.modelValue.length === props.options.length,
  )

  function toggleAll() {
    if (allSelected.value) {
      emit('update:modelValue', [])
    } else {
      emit(
        'update:modelValue',
        props.options.map((opt) => opt.value),
      )
    }
  }

  function toggleOption(value: string | number) {
    const newValue = [...props.modelValue]
    const index = newValue.indexOf(value)
    if (index === -1) {
      newValue.push(value)
    } else {
      newValue.splice(index, 1)
    }
    emit('update:modelValue', newValue)
  }

  function clearAll(event: Event) {
    event.stopPropagation()
    emit('update:modelValue', [])
    if (!isOpen.value) {
      buttonRef.value?.focus()
    }
  }

  function toggleOpen() {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      activeIndex.value = -1 // Reset focus when opening
    } else {
      buttonRef.value?.focus() // Return focus when closing manually
    }
  }

  function close() {
    isOpen.value = false
    activeIndex.value = -1
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      close()
    }
  }

  // --- Accessibility / Keyboard Handling ---

  function scrollActiveIntoView() {
    if (!listboxRef.value || activeIndex.value < 0) return
    const items = listboxRef.value.querySelectorAll('[role="option"]')
    const activeItem = items[activeIndex.value] as HTMLElement
    if (activeItem) {
      const itemTop = activeItem.offsetTop
      const itemBottom = itemTop + activeItem.offsetHeight
      const listTop = listboxRef.value.scrollTop
      const listBottom = listTop + listboxRef.value.offsetHeight

      if (itemTop < listTop) {
        listboxRef.value.scrollTop = itemTop
      } else if (itemBottom > listBottom) {
        listboxRef.value.scrollTop = itemBottom - listboxRef.value.offsetHeight
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen.value) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault()
        toggleOpen()
      }
      return
    }

    const maxIndex = props.options.length - 1

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (maxIndex >= 0) {
          activeIndex.value = activeIndex.value < maxIndex ? activeIndex.value + 1 : 0
          scrollActiveIntoView()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (maxIndex >= 0) {
          activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : maxIndex
          scrollActiveIntoView()
        }
        break
      case ' ':
        // Space to select/deselect the current active option
        event.preventDefault() // prevent page scroll
        if (activeIndex.value >= 0 && activeIndex.value <= maxIndex) {
          const option = props.options[activeIndex.value]
          if (option) toggleOption(option.value)
        }
        break
      case 'Enter':
        // Enter can close the dropdown when done selecting
        event.preventDefault()
        close()
        buttonRef.value?.focus()
        break
      case 'Escape':
        event.preventDefault()
        close()
        buttonRef.value?.focus()
        break
    }
  }

  return {
    isOpen,
    containerRef,
    listboxRef,
    buttonRef,
    activeIndex,
    selectedDisplay,
    fullSelectionLabel,
    someSelected,
    allSelected,
    toggleAll,
    toggleOption,
    clearAll,
    toggleOpen,
    handleClickOutside,
    handleKeydown,
  }
}
