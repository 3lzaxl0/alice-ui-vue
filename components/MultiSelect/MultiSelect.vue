<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ChevronDown, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCheckbox from '../Checkbox/Checkbox.vue'
import { useMultiSelect } from './useMultiSelect'

defineOptions({
  name: 'AliceMultiSelect',
})

const props = defineProps<{
  id: string
  modelValue: (string | number)[]
  options: { label: string; value: string | number }[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  enableSelectAll?: boolean
  error?: boolean | string
  errorMessage?: string
  helperText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[]): void
}>()

const {
  isOpen,
  containerRef,
  buttonRef,
  activeIndex,
  selectedDisplay,
  fullSelectionLabel,
  someSelected,
  allSelected,
  toggleAll,
  toggleOption,
  clearAll,
  toggleOpen,
  handleClickOutside,
  handleKeydown,
} = useMultiSelect(props, emit)

import { useFilterValidation } from '../FilterPanel/useFilterValidation'

useFilterValidation(props)

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="!!error || !!errorMessage">
      {{ label }}
    </AliceLabel>

    <div
      ref="buttonRef"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="isOpen ? `${id}-listbox` : undefined"
      tabindex="0"
      @click="toggleOpen"
      @keydown="handleKeydown"
      class="h-alice-input-height px-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer flex items-center justify-between gap-2 hover:border-primary-500/50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-300 rounded-alice-md relative pr-9 outline-none"
      :class="[
        isOpen ? 'border-primary-500 ring-2 ring-primary-500/20' : '',
        (!!error || !!errorMessage) ? 'border-error-500 dark:border-error-400 focus-within:ring-error-500/20 focus-within:border-error-500 dark:focus-within:border-error-400' : ''
      ]"
      :title="modelValue.length > 1 ? fullSelectionLabel : undefined"
    >
      <!-- Selection Content -->
      <div class="flex items-center gap-2 overflow-hidden w-full">
        <span v-if="modelValue.length === 0" class="text-gray-400 text-sm truncate">
          {{ placeholder || 'Seleccionar...' }}
        </span>

        <div v-else class="flex items-center gap-2 overflow-hidden w-full">
          <!-- Main label -->
          <span class="text-sm text-gray-900 dark:text-white font-medium truncate">
            {{ selectedDisplay }}
          </span>
        </div>
      </div>

      <!-- Action Icons (Fixed on right) -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-0.5">
        <button
          v-if="modelValue.length > 0"
          @click="clearAll"
          class="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 text-gray-400 hover:text-error-600 dark:hover:text-error-400 rounded-lg transition-colors flex items-center justify-center"
          title="Limpiar todo"
        >
          <X :size="14" />
        </button>

        <ChevronDown
          :size="16"
          class="text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Dropdown -->
    <transition name="alice-pop">
      <div
        v-if="isOpen"
        :id="`${id}-listbox`"
        ref="listboxRef"
        role="listbox"
        aria-multiselectable="true"
        class="absolute z-50 top-full left-0 mt-1 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1 rounded-alice-md origin-top custom-scrollbar"
      >
        <!-- Select All Option -->
        <div
          v-if="enableSelectAll && options.length > 0"
          @click="toggleAll"
          class="px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 border-b border-gray-100 dark:border-white/10 font-bold text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <AliceCheckbox
            :model-value="allSelected"
            :indeterminate="someSelected && !allSelected"
            class="pointer-events-none"
          />
          <span>Seleccionar Todos ({{ options.length }})</span>
        </div>

        <div
          v-for="(option, index) in options"
          :key="option.value"
          role="option"
          :aria-selected="modelValue.includes(option.value)"
          @click="toggleOption(option.value)"
          class="px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors border-l-2 outline-none"
          :class="[
            modelValue.includes(option.value)
              ? 'bg-primary-50/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-600 dark:border-primary-400 font-medium'
              : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-200 border-transparent',
            index === activeIndex
              ? 'bg-gray-100 dark:bg-slate-800 ring-2 ring-inset ring-primary-500/50'
              : '',
          ]"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <AliceCheckbox
              :model-value="modelValue.includes(option.value)"
              class="pointer-events-none"
            />
            <span class="truncate">{{ option.label }}</span>
          </div>
        </div>

        <div v-if="options.length === 0" class="px-4 py-6 text-sm text-gray-400 text-center italic">
          No hay opciones disponibles
        </div>
      </div>
    </transition>

    <!-- Feedback Messages -->
    <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-error-500 dark:text-error-400 font-medium whitespace-pre-wrap">
      {{ error }}
    </p>
    <p v-else-if="errorMessage" class="mt-1 text-xs text-error-500 dark:text-error-400 font-medium whitespace-pre-wrap">
      {{ errorMessage }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
      {{ helperText }}
    </p>
  </div>
</template>
