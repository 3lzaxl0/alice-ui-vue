<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCalendar from './Calendar.vue'
import { formatDate } from '../../utils/date'

defineOptions({
  name: 'AliceDatePicker',
})

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue: string | null // YYYY-MM-DD
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: boolean
    displayFormat?: string // 'iso' | 'full' | 'short' | 'raw' or 'DD/MM/YYYY' etc.
  }>(),
  {
    displayFormat: 'DD/MM/YYYY',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// State
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// Display formatting
const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder || 'Seleccionar fecha...'
  return formatDate(props.modelValue, props.displayFormat)
})

// Selection
const selectDate = (dateStr: string | null) => {
  emit('update:modelValue', dateStr)
  isOpen.value = false
}

const clearDate = (e: Event) => {
  e.stopPropagation()
  emit('update:modelValue', null)
}

// Click Outside
function close(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', close))
onUnmounted(() => document.removeEventListener('click', close))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="error">
      {{ label }}
    </AliceLabel>

    <!-- Visual Input Trigger -->
    <div
      @click="!disabled && (isOpen = !isOpen)"
      class="h-alice-input-height px-3 bg-white dark:bg-slate-800 border cursor-pointer flex items-center justify-between gap-2 transition-all duration-300 rounded-alice-md relative w-full group/input"
      :class="[
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : '',
      ]"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <CalendarIcon
          :size="16"
          class="text-gray-400 group-focus-within/input:text-blue-500 transition-colors"
        />
        <span
          class="text-sm truncate select-none"
          :class="[modelValue ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400']"
        >
          {{ displayValue }}
        </span>
      </div>

      <!-- Clear Action -->
      <div
        v-if="modelValue && !disabled"
        @click="clearDate"
        class="p-1 -mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors z-10"
      >
        <X :size="14" />
      </div>
    </div>

    <!-- Calendar Dropdown -->
    <transition name="alice-pop">
      <div
        v-if="isOpen"
        class="absolute z-alice-modal top-full left-0 mt-1 p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl rounded-alice-lg origin-top"
      >
        <AliceCalendar :model-value="modelValue" @update:model-value="selectDate" />
      </div>
    </transition>
  </div>
</template>
