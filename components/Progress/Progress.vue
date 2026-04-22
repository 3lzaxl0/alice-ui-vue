<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AliceProgress' })

const props = withDefaults(
  defineProps<{
    /** Progress value from 0 to 100 */
    value?: number
    /** Maximum value (default 100) */
    max?: number
    /** Label to show alongside the progress */
    label?: string
    /** Whether to show the percentage text */
    showPercentage?: boolean
    /** Size variant */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /** Visual variant */
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
    /** Whether the progress is indeterminate */
    indeterminate?: boolean
    /** Whether to animate the progress change */
    animated?: boolean
  }>(),
  {
    value: 0,
    max: 100,
    label: '',
    showPercentage: false,
    size: 'md',
    variant: 'primary',
    indeterminate: false,
    animated: true,
  }
)

const percentage = computed(() => {
  if (props.indeterminate) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const barHeightClass = computed(() => {
  const map = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-5',
  }
  return map[props.size]
})

const variantClass = computed(() => {
  const map = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
  }
  return map[props.variant]
})

const trackClass = computed(() => {
  return 'bg-gray-100 dark:bg-slate-800'
})
</script>

<template>
  <div class="alice-progress w-full flex flex-col gap-1.5">
    <!-- Header with Label and Percentage -->
    <div v-if="label || showPercentage" class="flex justify-between items-center px-0.5">
      <span v-if="label" class="text-xs font-medium text-gray-600 dark:text-gray-400">
        {{ label }}
      </span>
      <span v-if="showPercentage && !indeterminate" class="text-xs font-bold font-mono text-gray-700 dark:text-gray-200">
        {{ Math.round(percentage) }}%
      </span>
    </div>

    <!-- Progress Track -->
    <div 
      class="relative overflow-hidden rounded-full transition-all duration-300 shadow-sm"
      :class="[barHeightClass, trackClass]"
    >
      <!-- Progress Bar (The actually indicator) -->
      <div
        class="h-full rounded-full transition-all duration-500 ease-out relative"
        :class="[
          variantClass, 
          animated && !indeterminate ? 'alice-progress-shine' : '',
          indeterminate ? 'alice-indeterminate-anim' : ''
        ]"
        :style="{ width: indeterminate ? '100%' : `${percentage}%` }"
      >
        <!-- Optional Inner Shine/Pulse -->
        <div v-if="animated && !indeterminate" class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alice-progress-shine {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: shine 1s linear infinite;
}

@keyframes shine {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}

.alice-indeterminate-anim {
  width: 50% !important;
  animation: indeterminate 2s infinite ease-in-out;
  transform-origin: left center;
}

@keyframes indeterminate {
  0% { transform: translateX(-100%) scaleX(0.2); }
  50% { transform: translateX(25%) scaleX(0.5); }
  100% { transform: translateX(200%) scaleX(0.2); }
}

/* Glassmorphism subtle effect */
.alice-progress .shadow-sm {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
</style>
