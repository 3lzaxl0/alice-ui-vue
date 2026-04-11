<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

interface Option {
  label: string
  value: string | number
}

defineOptions({
  name: 'AliceSegmentedControl'
})

const props = defineProps<{
  modelValue: string | number
  options: Option[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
  opacity: 0
})

const updateIndicator = () => {
  if (!containerRef.value) return

  const activeIndex = props.options.findIndex(opt => opt.value === props.modelValue)
  if (activeIndex === -1) {
    indicatorStyle.value.opacity = 0
    return
  }

  const buttons = containerRef.value.querySelectorAll('button')
  const activeButton = buttons[activeIndex]

  if (activeButton) {
    indicatorStyle.value = {
      left: `${activeButton.offsetLeft}px`,
      width: `${activeButton.offsetWidth}px`,
      opacity: 1
    }
  }
}

watch(() => props.modelValue, () => {
  nextTick(updateIndicator)
})

onMounted(() => {
  setTimeout(updateIndicator, 50) // Small delay to ensure layout is ready
  window.addEventListener('resize', updateIndicator)
})

const select = (value: string | number) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div 
    ref="containerRef"
    class="relative flex p-1 bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md rounded-alice-lg border border-slate-200/50 dark:border-white/5 w-fit"
    :class="[disabled ? 'opacity-60 cursor-not-allowed' : '']"
  >
    <!-- Background Indicator -->
    <div 
      class="absolute top-1 bottom-1 bg-white dark:bg-slate-700 shadow-alice-sm rounded-alice-md transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      :style="indicatorStyle"
    ></div>

    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      @click="select(option.value)"
      class="relative z-10 px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-alice-md transition-colors duration-300 outline-none"
      :class="[
        modelValue === option.value 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      ]"
      :disabled="disabled"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
/* Optional: Adding a subtle glow to the indicator in dark mode */
.dark .indicator-glow {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
}
</style>
