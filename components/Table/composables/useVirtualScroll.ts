import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

export function useVirtualScroll<T>(
  processedData: Ref<T[]>, // The data after filtering/sorting
  mode: Ref<'auto' | 'fixed'>,
  pagination: Ref<boolean>,
  rowHeight: Ref<number>,
  buffer: Ref<number>,
) {
  const scrollTop = ref(0)
  const viewportHeight = ref(600) // Default fallback
  const scrollViewport = ref<HTMLElement | null>(null)

  const isVirtual = computed(() => !pagination.value && mode.value === 'auto')

  const virtualState = computed(() => {
    if (!isVirtual.value) {
      return {
        startIndex: 0,
        endIndex: processedData.value.length,
        paddingTop: 0,
        paddingBottom: 0,
      }
    }

    const count = processedData.value.length
    const visibleCount = Math.ceil(viewportHeight.value / rowHeight.value)

    const start = Math.floor(scrollTop.value / rowHeight.value)
    const paddedStart = Math.max(0, start - buffer.value)

    const end = Math.min(count, start + visibleCount + buffer.value)

    const paddingTop = paddedStart * rowHeight.value
    const paddingBottom = (count - end) * rowHeight.value

    return {
      startIndex: paddedStart,
      endIndex: end,
      paddingTop,
      paddingBottom,
    }
  })

  const scrollRAF = ref<number | null>(null)

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement

    // Throttle updates with RAF
    if (!scrollRAF.value) {
      scrollRAF.value = requestAnimationFrame(() => {
        scrollTop.value = target.scrollTop
        scrollRAF.value = null
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
    // Initial check
    if (scrollViewport.value) {
      scrollTop.value = scrollViewport.value.scrollTop
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewport)
    if (scrollRAF.value) cancelAnimationFrame(scrollRAF.value)
  })

  const virtualData = computed(() => {
    if (!isVirtual.value) return processedData.value
    return processedData.value.slice(virtualState.value.startIndex, virtualState.value.endIndex)
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
