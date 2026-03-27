import { ref, computed } from 'vue'

interface Option {
  label: string
  value: string | number
}

export function useSelect(
  props: {
    modelValue: string | number | null
    options: Option[]
    placeholder?: string
    disabled?: boolean
  },
  emit: {
    (e: 'update:modelValue', value: string | number | null): void
    (e: 'change', value: string | number | null): void
  },
) {
  const isOpen = ref(false)
  const containerRef = ref<HTMLElement | null>(null)
  const buttonRef = ref<HTMLElement | null>(null)
  const listboxRef = ref<HTMLElement | null>(null)
  const activeIndex = ref(-1)

  // Find selected option object
  const selectedOption = computed(() => {
    return props.options.find((opt) => opt.value === props.modelValue)
  })

  const displayLabel = computed(() => {
    if (selectedOption.value) return selectedOption.value.label
    return props.placeholder || 'Seleccionar...'
  })

  function selectOption(option: Option) {
    if (props.disabled) return
    emit('update:modelValue', option.value)
    emit('change', option.value)
    close()
  }

  function toggleOpen() {
    if (props.disabled) return
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      // Set active index to currently selected
      const currentIdx = props.options.findIndex((opt) => opt.value === props.modelValue)
      activeIndex.value = currentIdx >= 0 ? currentIdx : -1
    } else {
      buttonRef.value?.focus()
    }
  }

  function close() {
    isOpen.value = false
    activeIndex.value = -1
    buttonRef.value?.focus()
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      isOpen.value = false
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
    if (props.disabled) return

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
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex.value >= 0 && activeIndex.value <= maxIndex) {
          const option = props.options[activeIndex.value]
          if (option) selectOption(option)
        }
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
    }
  }

  function clearValue() {
    if (props.disabled) return
    emit('update:modelValue', null)
    emit('change', null)
  }

  return {
    isOpen,
    containerRef,
    buttonRef,
    listboxRef,
    activeIndex,
    selectedOption,
    displayLabel,
    selectOption,
    clearValue,
    toggleOpen,
    handleClickOutside,
    handleKeydown,
  }
}
