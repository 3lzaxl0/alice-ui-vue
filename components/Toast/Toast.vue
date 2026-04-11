<script setup lang="ts">
import { useToast } from './useToast'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-vue-next'

const { toasts, remove } = useToast()

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
  date: Info, // Fallback for custom types
}

const colors = {
  success:
    'bg-success-50 text-success-800 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800',
  warning:
    'bg-warning-50 text-warning-800 border-warning-200 dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800',
  error:
    'bg-error-50 text-error-800 border-error-200 dark:bg-error-900/20 dark:text-error-300 dark:border-error-800',
  info: 'bg-info-50 text-info-800 border-info-200 dark:bg-info-900/20 dark:text-info-300 dark:border-info-800',
  date: 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
}

defineOptions({
  name: 'AliceToast',
})
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 w-full max-w-sm pointer-events-none p-4 sm:p-0"
  >
    <transition-group name="alice-toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border shadow-lg relative overflow-hidden rounded-alice-md"
        :class="[colors[toast.type] || colors.info]"
      >
        <!-- Icon -->
        <component :is="icons[toast.type] || Info" class="shrink-0 mt-0.5" :size="20" />

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 v-if="toast.title" class="font-semibold text-sm mb-0.5 leading-tight">
            {{ toast.title }}
          </h4>
          <p class="text-sm opacity-90 leading-normal">{{ toast.message }}</p>
        </div>

        <!-- Close -->
        <button
          @click="remove(toast.id)"
          class="shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
        >
          <X :size="16" />
        </button>
      </div>
    </transition-group>
  </div>
</template>
