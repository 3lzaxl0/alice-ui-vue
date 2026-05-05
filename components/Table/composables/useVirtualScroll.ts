import { ref, computed, shallowRef, watch, onMounted, onUnmounted, type Ref } from 'vue'

export function useVirtualScroll<T>(
  processedData: Ref<T[]>,
  mode: Ref<'auto' | 'fixed'>,
  pagination: Ref<boolean>,
  rowHeight: Ref<number>,
  buffer: Ref<number>,
) {
  const scrollTop = ref(0)
  const viewportHeight = ref(600)
  const scrollViewport = ref<HTMLElement | null>(null)

  // Virtual scroll is active whenever pagination is off, regardless of mode.
  // In 'fixed' mode the viewport scrolls inside its explicit-height container.
  const isVirtual = computed(() => !pagination.value)

  const virtualState = computed(() => {
    const count = processedData.value.length

    if (!isVirtual.value || count === 0) {
      return {
        startIndex: 0,
        endIndex: count,
        paddingTop: 0,
        paddingBottom: 0,
      }
    }

    const rh = rowHeight.value
    const vh = viewportHeight.value
    const st = scrollTop.value
    const buf = buffer.value

    const visibleCount = Math.ceil(vh / rh)
    const rawStart = Math.floor(st / rh)
    const startIndex = Math.max(0, rawStart - buf)
    const endIndex = Math.min(count, rawStart + visibleCount + buf)

    return {
      startIndex,
      endIndex,
      paddingTop: startIndex * rh,
      paddingBottom: Math.max(0, (count - endIndex) * rh),
    }
  })

  // Use shallowRef + manual slice to avoid deep reactive overhead on large arrays
  const virtualData = shallowRef<T[]>([])

  watch(
    virtualState,
    (state) => {
      virtualData.value = processedData.value.slice(state.startIndex, state.endIndex)
    },
    { immediate: true },
  )

  // Also recompute when data changes
  watch(processedData, () => {
    virtualData.value = processedData.value.slice(
      virtualState.value.startIndex,
      virtualState.value.endIndex,
    )
  })

  // RAF-throttled scroll with passive listener for maximum smoothness
  let ticking = false

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        scrollTop.value = target.scrollTop
        ticking = false
      })
    }
  }

  const updateViewport = () => {
    if (scrollViewport.value) {
      viewportHeight.value = scrollViewport.value.clientHeight
    }
  }

  onMounted(() => {
    updateViewport()
    window.addEventListener('resize', updateViewport)
    if (scrollViewport.value) {
      scrollTop.value = scrollViewport.value.scrollTop
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewport)
  })

  return {
    scrollViewport,
    scrollTop,
    viewportHeight,
    virtualState,
    virtualData,
    isVirtual,
    handleScroll,
    updateViewport,
  }
}
