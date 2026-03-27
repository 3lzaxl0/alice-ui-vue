import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

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

    const rawStart = Math.floor(scrollTop.value / rowHeight.value)
    const startIndex = Math.max(0, rawStart - buffer.value)
    const endIndex = Math.min(count, rawStart + visibleCount + buffer.value)

    const paddingTop = startIndex * rowHeight.value
    const paddingBottom = Math.max(0, (count - endIndex) * rowHeight.value)

    return { startIndex, endIndex, paddingTop, paddingBottom }
  })

  // Throttle scroll with RAF for smooth 60fps
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
