import { ref, computed, watch } from 'vue'
import { smartFuzzyMatch } from '../../utils/fuzzy'

interface Result {
  label: string
  value: string | number
  description?: string
  labelIndices?: number[]
  descriptionIndices?: number[]
  score?: number
  // Internal marker for recent items
  _isRecent?: boolean
}

// --- Persistence helpers (localStorage) ---

function loadRecents(key: string, max: number): Result[] {
  try {
    const raw = localStorage.getItem(`alice-search-recent:${key}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Result[]
    return Array.isArray(parsed) ? parsed.slice(0, max) : []
  } catch {
    return []
  }
}

function saveRecents(key: string, item: Result, max: number): Result[] {
  const existing = loadRecents(key, max)
  // Remove duplicates, keep the new item on top
  const filtered = existing.filter((r) => r.value !== item.value)
  const updated = [
    { label: item.label, value: item.value, description: item.description },
    ...filtered,
  ].slice(0, max)
  try {
    localStorage.setItem(`alice-search-recent:${key}`, JSON.stringify(updated))
  } catch {
    // Storage full or unavailable — fail silently
  }
  return updated
}

export function useSearchInput(
  props: {
    modelValue?: Result | null
    results: Result[]
    loading?: boolean
    localSearch?: boolean
    disabled: boolean
    persistentKey?: string
    maxRecent?: number
    minChars?: number
    debounceMs?: number
    readonly?: boolean
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

  // Recent items state
  const maxRecent = computed(() => props.maxRecent ?? 5)
  const recentItems = ref<Result[]>(
    props.persistentKey ? loadRecents(props.persistentKey, maxRecent.value) : [],
  )

  // Sync internal query with model value label
  const updateQueryFromModel = (newVal: Result | null | undefined) => {
    if (newVal) {
      searchQuery.value = newVal.label
    } else {
      if (!isOpen.value) searchQuery.value = ''
    }
  }

  watch(() => props.modelValue, (newVal) => updateQueryFromModel(newVal), { immediate: true })

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function emitSearch(query: string) {
    if ((props.minChars ?? 0) > 0 && query.length > 0 && query.length < (props.minChars ?? 0)) {
      return
    }

    if (props.debounceMs && props.debounceMs > 0) {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        emit('search', query)
      }, props.debounceMs)
    } else {
      emit('search', query)
    }
  }

  function handleInput(event: Event) {
    if (props.readonly) return
    const query = (event.target as HTMLInputElement).value
    searchQuery.value = query
    isOpen.value = true
    activeIndex.value = -1

    if (query === '') {
      emit('update:modelValue', null)
      emit('search', '')
    } else {
      emitSearch(query)
    }
  }

  function selectResult(result: Result) {
    searchQuery.value = result.label
    emit('update:modelValue', result)
    isOpen.value = false
    activeIndex.value = -1
    inputRef.value?.focus()

    // Persist recent selection
    if (props.persistentKey) {
      recentItems.value = saveRecents(props.persistentKey, result, maxRecent.value)
    }
  }

  function clear() {
    searchQuery.value = ''
    emit('update:modelValue', null)
    if (debounceTimer) clearTimeout(debounceTimer)
    emit('search', '')
    isOpen.value = false
    activeIndex.value = -1
    inputRef.value?.focus()
  }

  function handleFocus() {
    if (!props.disabled && !props.readonly) {
      isOpen.value = true
      activeIndex.value = -1
      if (searchQuery.value) emitSearch(searchQuery.value)
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

  // --- Displayed results: recents first when query is empty, filtered otherwise ---

  const displayedResults = computed(() => {
    const list = props.results || []
    const isQueryEmpty =
      !searchQuery.value || (props.modelValue && props.modelValue.label === searchQuery.value)

    // When the query is empty (or matches current selection) and we have recents,
    // show recents at the top followed by all other results (deduped)
    if (isQueryEmpty && props.persistentKey && recentItems.value.length > 0) {
      const recentValues = new Set(recentItems.value.map((r) => r.value))
      const recentMapped: Result[] = recentItems.value
        .map((r) => ({ ...r, _isRecent: true }))
        .filter((r) => list.some((l) => l.value === r.value)) // only show items still in the full list
      const rest = list.filter((r) => !recentValues.has(r.value))
      return [...recentMapped, ...rest]
    }

    if (!props.localSearch) return list
    if (!searchQuery.value) return list

    // Do not filter if query matches the currently selected label perfectly
    if (props.modelValue && props.modelValue.label === searchQuery.value && !isOpen.value) {
      return list
    }

    const q = searchQuery.value

    return list
      .map((r) => {
        const labelMatch = smartFuzzyMatch(q, r.label)
        const descMatch = r.description ? smartFuzzyMatch(q, r.description) : null
        const valueMatch = smartFuzzyMatch(q, String(r.value))

        const score = Math.max(
          labelMatch?.score || 0,
          descMatch?.score || 0,
          valueMatch?.score || 0,
        )

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

  // Whether we are currently showing a "recents" section at the top
  const showingRecents = computed(() => {
    if (!props.persistentKey || recentItems.value.length === 0) return false
    const isQueryEmpty =
      !searchQuery.value || (props.modelValue && props.modelValue.label === searchQuery.value)
    return !!isQueryEmpty
  })

  // How many items in displayedResults are "recent"
  const recentCount = computed(() =>
    showingRecents.value ? displayedResults.value.filter((r) => r._isRecent).length : 0,
  )

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
    if (props.readonly) return
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
    showingRecents,
    recentCount,
    updateQueryFromModel,
    handleInput,
    selectResult,
    clear,
    handleFocus,
    handleClickOutside,
    handleKeydown,
  }
}
