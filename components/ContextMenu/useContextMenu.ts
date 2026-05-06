import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useContextMenu() {
  const isOpen = ref(false)
  const x = ref(0)
  const y = ref(0)
  const menuRef = ref<HTMLElement | null>(null)

  const closeMenu = () => {
    isOpen.value = false
  }

  const handleContextMenu = async (event: MouseEvent) => {
    isOpen.value = true
    
    // Set coordinates immediately, wait for nextTick to adjust based on menu size
    x.value = event.clientX
    y.value = event.clientY
    
    await nextTick()
    
    if (menuRef.value) {
      const rect = menuRef.value.getBoundingClientRect()
      
      // Keep within right edge
      if (x.value + rect.width > window.innerWidth) {
        x.value = window.innerWidth - rect.width - 8
      }
      
      // Keep within bottom edge
      if (y.value + rect.height > window.innerHeight) {
        y.value = window.innerHeight - rect.height - 8
      }
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
      closeMenu()
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeMenu()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    // Important: close when triggering native contextmenu elsewhere
    document.addEventListener('contextmenu', (e) => {
      if (isOpen.value && menuRef.value && !menuRef.value.contains(e.target as Node)) {
        closeMenu()
      }
    })
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    isOpen,
    x,
    y,
    menuRef,
    handleContextMenu,
    closeMenu
  }
}
