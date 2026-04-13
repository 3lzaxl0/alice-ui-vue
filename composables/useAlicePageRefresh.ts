import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { usePageHeader } from './usePageHeader'

/**
 * Standardizes the page-level refresh boilerplate for Admin views.
 * Handles mounting/unmounting of the refresh handler and synchronizes loading state.
 * 
 * @param refreshHandler The function to execute when the PageHeader refresh is triggered.
 * @param isLoading A ref indicating the loading state of the current view.
 */
export function useAlicePageRefresh(refreshHandler: () => void, isLoading: Ref<boolean>) {
  const { setRefreshHandler, setRefreshing, clearRefreshHandler } = usePageHeader()

  onMounted(() => {
    setRefreshHandler(refreshHandler)
  })

  onUnmounted(() => {
    clearRefreshHandler()
  })

  watch(isLoading, (loading) => {
    setRefreshing(loading)
  }, { immediate: true })

  // Return trigger for manual use if needed
  return {
    trigger: refreshHandler
  }
}
