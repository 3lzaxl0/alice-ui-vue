import { ref, computed } from 'vue'

export interface DropdownOption {
  label: string
  value: string | number
}

export function useDropdownMenu(
  props: {
    modelValue: string | number | null
    options: DropdownOption[]
    disabled?: boolean
    placeholder?: string
  },
  emit: {
    (e: 'update:modelValue', value: string | number): void
    (e: 'change', value: string | number): void
  },
) {
  const isOpen = ref(false)
  const containerRef = ref<HTMLElement | null>(null)
  const triggerRef = ref<HTMLElement | null>(null)
  const listboxRef = ref<HTMLElement | null>(null)
  const activeIndex = ref(-1)

  const selectedOption = computed(() => {
    return props.options.find((opt) => opt.value === props.modelValue) ?? null
  })

  const displayLabel = computed(() => {
    return selectedOption.value?.label ?? props.placeholder ?? 'Seleccionar...'
  })

  function selectOption(option: DropdownOption) {
    if (props.disabled) return
    emit('update:modelValue', option.value)
    emit('change', option.value)
    close()
  }

  function toggleOpen() {
    if (props.disabled) return
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      const currentIdx = props.options.findIndex((opt) => opt.value === props.modelValue)
      activeIndex.value = currentIdx >= 0 ? currentIdx : -1
    } else {
      triggerRef.value?.focus()
    }
  }

  function close() {
    isOpen.value = false
    activeIndex.value = -1
    triggerRef.value?.focus()
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      isOpen.value = false
      activeIndex.value = -1
    }
  }

  // --- Keyboard navigation ---
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

  return {
    isOpen,
    containerRef,
    triggerRef,
    listboxRef,
    activeIndex,
    selectedOption,
    displayLabel,
    selectOption,
    toggleOpen,
    close,
    handleClickOutside,
    handleKeydown,
  }
}
