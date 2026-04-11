import { ref, watch } from 'vue'
import { injectThemeScale } from '../utils/theme'

const THEME_STORAGE_KEY = 'alice-theme'
const PRIMARY_COLOR_STORAGE_KEY = 'alice-primary-color'
const DEFAULT_PRIMARY_COLOR = '#3b82f6'

// Shared state
const isDark = ref(localStorage.getItem(THEME_STORAGE_KEY) === 'dark')
const primaryColor = ref(localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY) || DEFAULT_PRIMARY_COLOR)

/**
 * Alice UI Theme Composable
 * Centralizes theme (light/dark) and semantic color customization logic.
 */
export function useTheme() {
  /**
   * Toggles between light and dark mode with a transition lock to prevent lag.
   */
  function toggleTheme() {
    const isDarkTheme = !isDark.value
    
    // Lock transitions to prevent lag spike when changing many elements at once
    document.documentElement.classList.add('theme-transitioning')
    
    isDark.value = isDarkTheme
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
      localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem(THEME_STORAGE_KEY, 'light')
    }
    
    // Release transition lock
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transitioning')
      })
    })
  }

  /**
   * Updates the primary semantic color globally.
   */
  function setPrimaryColor(hex: string) {
    primaryColor.value = hex
    localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, hex)
    injectThemeScale('primary', hex)
  }

  /**
   * Resets the primary color to system default.
   */
  function resetPrimaryColor() {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR)
  }

  /**
   * Initializes theme and colors from localStorage or defaults.
   */
  function initTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Always inject the primary color on init
    injectThemeScale('primary', primaryColor.value)
  }

  return {
    isDark,
    primaryColor,
    toggleTheme,
    setPrimaryColor,
    resetPrimaryColor,
    initTheme,
  }
}
