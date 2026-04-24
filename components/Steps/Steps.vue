<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

export interface StepItem {
  label: string
  description?: string
}

interface Props {
  steps: StepItem[]
  modelValue: number // current step index (0-based)
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

defineOptions({ name: 'AliceSteps' })

const variantClasses = {
  primary: {
    active: 'bg-primary-600 border-primary-600 text-white dark:bg-primary-500 dark:border-primary-500',
    done: 'bg-primary-600 border-primary-600 text-white dark:bg-primary-500 dark:border-primary-500',
    connector: 'bg-primary-600 dark:bg-primary-500',
    labelActive: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    active: 'bg-success-600 border-success-600 text-white dark:bg-success-500 dark:border-success-500',
    done: 'bg-success-600 border-success-600 text-white dark:bg-success-500 dark:border-success-500',
    connector: 'bg-success-600 dark:bg-success-500',
    labelActive: 'text-success-600 dark:text-success-400',
  },
  warning: {
    active: 'bg-warning-500 border-warning-500 text-white dark:bg-warning-400 dark:border-warning-400',
    done: 'bg-warning-500 border-warning-500 text-white dark:bg-warning-400 dark:border-warning-400',
    connector: 'bg-warning-500 dark:bg-warning-400',
    labelActive: 'text-warning-600 dark:text-warning-400',
  },
  error: {
    active: 'bg-error-600 border-error-600 text-white dark:bg-error-500 dark:border-error-500',
    done: 'bg-error-600 border-error-600 text-white dark:bg-error-500 dark:border-error-500',
    connector: 'bg-error-600 dark:bg-error-500',
    labelActive: 'text-error-600 dark:text-error-400',
  },
  info: {
    active: 'bg-info-600 border-info-600 text-white dark:bg-info-500 dark:border-info-500',
    done: 'bg-info-600 border-info-600 text-white dark:bg-info-500 dark:border-info-500',
    connector: 'bg-info-600 dark:bg-info-500',
    labelActive: 'text-info-600 dark:text-info-400',
  },
}

const vc = computed(() => variantClasses[props.variant])

function stepState(index: number): 'pending' | 'active' | 'done' {
  if (index < props.modelValue) return 'done'
  if (index === props.modelValue) return 'active'
  return 'pending'
}
</script>

<template>
  <div class="flex items-start w-full">
    <template v-for="(step, index) in steps" :key="index">
      <!-- Step Item -->
      <div class="flex flex-col items-center flex-1 relative">
        <!-- Bubble + Connector line row -->
        <div class="flex items-center w-full">
          <!-- Left connector line -->
          <div
            v-if="index > 0"
            class="flex-1 h-0.5 transition-colors duration-500"
            :class="stepState(index) !== 'pending' ? vc.connector : 'bg-slate-200 dark:bg-slate-700'"
          />
          <!-- Bubble -->
          <div
            class="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 text-sm font-bold"
            :class="[
              stepState(index) === 'active' ? vc.active + ' shadow-md scale-110' : '',
              stepState(index) === 'done' ? vc.done : '',
              stepState(index) === 'pending' ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400' : '',
            ]"
          >
            <Check v-if="stepState(index) === 'done'" :size="14" stroke-width="3" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <!-- Right connector line -->
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 transition-colors duration-500"
            :class="stepState(index) === 'done' ? vc.connector : 'bg-slate-200 dark:bg-slate-700'"
          />
        </div>

        <!-- Labels -->
        <div class="mt-2 text-center px-1">
          <p
            class="text-xs font-semibold transition-colors duration-300"
            :class="[
              stepState(index) === 'active' ? vc.labelActive : '',
              stepState(index) === 'done' ? 'text-slate-500 dark:text-slate-400' : '',
              stepState(index) === 'pending' ? 'text-slate-400 dark:text-slate-600' : '',
            ]"
          >
            {{ step.label }}
          </p>
          <p
            v-if="step.description"
            class="text-xs text-slate-400 dark:text-slate-600 mt-0.5 leading-tight"
          >
            {{ step.description }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
