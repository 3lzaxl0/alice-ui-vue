<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { injectThemeScale } from '../../utils/theme'
import { useTheme } from '../../composables/useTheme'

defineOptions({
  name: 'AliceThemeProvider',
})

const props = withDefaults(
  defineProps<{
    /** Primary color in HEX format (e.g., #3b82f6) */
    primaryColor?: string
    /** Info color in HEX format */
    infoColor?: string
    /** Success color in HEX format */
    successColor?: string
    /** Warning color in HEX format */
    warningColor?: string
    /** Error color in HEX format */
    errorColor?: string
  }>(),
  {}
)

const { initTheme, setPrimaryColor } = useTheme()

// Watch for changes in colors and inject scales
watch(
  () => props.primaryColor,
  (newColor) => {
    if (newColor) setPrimaryColor(newColor)
  },
  { immediate: true }
)

// Info, Success, Warning, Error are usually static system colors, 
// so we inject them directly if provided, without useTheme global persistence for now
watch(
  () => props.infoColor,
  (newColor) => {
    if (newColor) injectThemeScale('info', newColor)
  },
  { immediate: true }
)

watch(
  () => props.successColor,
  (newColor) => {
    if (newColor) injectThemeScale('success', newColor)
  },
  { immediate: true }
)

watch(
  () => props.warningColor,
  (newColor) => {
    if (newColor) injectThemeScale('warning', newColor)
  },
  { immediate: true }
)

watch(
  () => props.errorColor,
  (newColor) => {
    if (newColor) injectThemeScale('error', newColor)
  },
  { immediate: true }
)

onMounted(() => {
  // Initialize theme (dark mode & primary color from storage)
  initTheme()
})
</script>

<template>
  <slot />
</template>
