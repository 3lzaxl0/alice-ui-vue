import { ref, computed, watch } from 'vue'
import { smartFuzzyMatch } from '../../utils/fuzzy'

interface Result {
  label: string
  value: string | number
  description?: string
  labelIndices?: number[]
  descriptionIndices?: number[]
  score?: number
}

export function useSearchInput(
  props: {
    modelValue?: Result | null
    results: Result[]
    loading?: boolean
    localSearch?: boolean
    disabled: boolean
  },
  emit: {
    (e: 'update:modelValue', value: Result | null): void
    (e: 'search', query: string): void
  },
) {
  const isOpen = ref(false)
  const searchQuery = ref('')
  const containerRef = ref<HTMLElement | null>(null)
  const inputRef = ref<HTMLInputElement | null>(null)

  // Accessibility state
  const activeIndex = ref(-1)
  const listboxRef = ref<HTMLElement | null>(null)

  // Sync internal query with model value label
  const updateQueryFromModel = (newVal: Result | null) => {
    if (newVal) {
      searchQuery.value = newVal.label
    } else {
      if (!isOpen.value) searchQuery.value = ''
    }
  }

  watch(
    () => props.modelValue,
    (newVal) => updateQueryFromModel(newVal),
    { immediate: true },
  )

  function handleInput(event: Event) {
    const query = (event.target as HTMLInputElement).value
    searchQuery.value = query
    isOpen.value = true
    activeIndex.value = -1 // Reset selection on input

    if (query === '') {
      emit('update:modelValue', null)
    }

    emit('search', query)
  }

  function selectResult(result: Result) {
    searchQuery.value = result.label
    emit('update:modelValue', result)
    isOpen.value = false
    activeIndex.value = -1
    inputRef.value?.focus() // Return focus to input after selection
  }

  function clear() {
    searchQuery.value = ''
    emit('update:modelValue', null)
    emit('search', '')
    isOpen.value = false
    activeIndex.value = -1
    inputRef.value?.focus()
  }

  function handleFocus() {
    if (!props.disabled) {
      isOpen.value = true
      activeIndex.value = -1
      if (searchQuery.value) emit('search', searchQuery.value)
    }
  }

  function close() {
    isOpen.value = false
    activeIndex.value = -1
    if (props.modelValue && searchQuery.value !== props.modelValue.label) {
      searchQuery.value = props.modelValue.label
    } else if (!props.modelValue && searchQuery.value) {
      searchQuery.value = ''
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      close()
    }
  }

  // --- Accessibility / Keyboard Handling ---

  const displayedResults = computed(() => {
    const list = props.results || []

    if (!props.localSearch) return list
    if (!searchQuery.value) return list

    // Do not filter out if they just opened the menu and their query matches the currently selected label perfectly
    if (props.modelValue && props.modelValue.label === searchQuery.value && !isOpen.value) {
      return list
    }

    const q = searchQuery.value

    return list
      .map((r) => {
        const labelMatch = smartFuzzyMatch(q, r.label)
        const descMatch = r.description ? smartFuzzyMatch(q, r.description) : null
        const valueMatch = smartFuzzyMatch(q, String(r.value))

        const score = Math.max(labelMatch?.score || 0, descMatch?.score || 0, valueMatch?.score || 0)

        if (labelMatch || descMatch || valueMatch) {
          return {
            ...r,
            labelIndices: labelMatch?.indices,
            descriptionIndices: descMatch?.indices,
            score,
          }
        }
        return null
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.score - a.score)
  })

  function scrollActiveIntoView() {
    if (!listboxRef.value || activeIndex.value < 0) return
    const items = listboxRef.value.querySelectorAll('[role="option"]')
    const activeItem = items[activeIndex.value] as HTMLElement
    if (activeItem) {
      // Basic approach to ensure the item is visible
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
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
        event.preventDefault()
        handleFocus()
      }
      return
    }

    const maxIndex = displayedResults.value.length - 1

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
        event.preventDefault()
        if (activeIndex.value >= 0 && activeIndex.value <= maxIndex) {
          const selected = displayedResults.value[activeIndex.value]
          if (selected) selectResult(selected)
        } else if (displayedResults.value.length === 0) {
          // If no results but user hits enter, maybe we close
          close()
        }
        break
      case 'Escape':
        event.preventDefault()
        close()
        inputRef.value?.focus()
        break
    }
  }

  return {
    isOpen,
    searchQuery,
    containerRef,
    inputRef,
    listboxRef,
    activeIndex,
    displayedResults,
    updateQueryFromModel,
    handleInput,
    selectResult,
    clear,
    handleFocus,
    handleClickOutside,
    handleKeydown,
  }
}
