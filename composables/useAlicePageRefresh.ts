import { onMounted, onUnmounted, onActivated, onDeactivated, watch, type Ref } from 'vue'
import { usePageHeader } from './usePageHeader'

/**
 * Standardizes the page-level refresh boilerplate for Admin views.
 * Handles mounting/unmounting of the refresh handler and synchronizes loading state.
 * Supports KeepAlive components by using activated/deactivated hooks.
 *
 * @param refreshHandler The function to execute when the PageHeader refresh is triggered.
 * @param isLoading A ref indicating the loading state of the current view.
 */
export function useAlicePageRefresh(refreshHandler: () => void, isLoading: Ref<boolean>) {
  const { setRefreshHandler, setRefreshing, clearRefreshHandler } = usePageHeader()
  let unwatch: (() => void) | null = null

  const register = () => {
    setRefreshHandler(refreshHandler)
    if (unwatch) unwatch()
    unwatch = watch(isLoading, (loading) => {
      setRefreshing(loading)
    }, { immediate: true })
  }

  const unregister = () => {
    clearRefreshHandler()
    if (unwatch) {
      unwatch()
      unwatch = null
    }
    setRefreshing(false)
  }

  onMounted(register)
  onUnmounted(unregister)

  onActivated(register)
  onDeactivated(unregister)

  // Return trigger for manual use if needed
  return {
    trigger: refreshHandler
  }
}
