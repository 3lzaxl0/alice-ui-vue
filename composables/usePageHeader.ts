import { ref } from 'vue'

const isRefreshing = ref(false)
const onRefreshCallback = ref<(() => void) | null>(null)

/**
 * Composable to manage global page header state and actions.
 * Allows child views to register refresh handlers that are triggered by the layout.
 */
export function usePageHeader() {
  function setRefreshHandler(handler: () => void) {
    onRefreshCallback.value = handler
  }

  function clearRefreshHandler() {
    onRefreshCallback.value = null
  }

  function triggerRefresh() {
    if (onRefreshCallback.value) {
      onRefreshCallback.value()
    }
  }

  function setRefreshing(state: boolean) {
    isRefreshing.value = state
  }

  return {
    isRefreshing,
    setRefreshing,
    setRefreshHandler,
    clearRefreshHandler,
    triggerRefresh,
  }
}
