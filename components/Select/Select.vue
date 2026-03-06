<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import { useSelect } from './useSelect'

interface Option {
  label: string
  value: string | number
}

defineOptions({
  name: 'AliceSelect',
})

const props = defineProps<{
  id?: string
  modelValue: string | number | null
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const {
  isOpen,
  containerRef,
  buttonRef,
  listboxRef,
  activeIndex,
  selectedOption,
  displayLabel,
  selectOption,
  toggleOpen,
  handleClickOutside,
  handleKeydown,
} = useSelect(props, emit)

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="error">
      {{ label }}
    </AliceLabel>

    <div
      ref="buttonRef"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="isOpen && id ? `${id}-listbox` : undefined"
      :tabindex="disabled ? -1 : 0"
      @click="toggleOpen"
      @keydown="handleKeydown"
      class="h-alice-input-height px-3 bg-white dark:bg-white/5 border cursor-pointer flex items-center justify-between gap-2 transition-all duration-300 rounded-alice-md relative w-full outline-none"
      :class="[
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : '',
      ]"
    >
      <!-- Selected Value -->
      <span
        class="text-sm truncate select-none"
        :class="[!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white font-medium']"
      >
        {{ displayLabel }}
      </span>

      <!-- Icon -->
      <ChevronDown
        :size="16"
        class="text-gray-400 transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <!-- Dropdown -->
    <transition name="alice-pop">
      <div
        v-if="isOpen"
        :id="id ? `${id}-listbox` : undefined"
        ref="listboxRef"
        role="listbox"
        class="absolute z-alice-modal top-full left-0 mt-1 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1 rounded-alice-md origin-top custom-scrollbar"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          role="option"
          :aria-selected="modelValue === option.value"
          @click="selectOption(option)"
          class="px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors border-l-2"
          :class="[
            modelValue === option.value
              ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-600 dark:border-blue-400 font-medium'
              : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-200 border-transparent',
            index === activeIndex
              ? 'bg-gray-100 dark:bg-slate-800 ring-2 ring-inset ring-blue-500/50'
              : '',
          ]"
        >
          <span class="truncate">{{ option.label }}</span>
          <Check
            v-if="modelValue === option.value"
            :size="14"
            class="text-blue-600 dark:text-blue-400"
          />
        </div>

        <div v-if="options.length === 0" class="px-4 py-6 text-sm text-gray-400 text-center italic">
          No hay opciones disponibles
        </div>
      </div>
    </transition>
  </div>
</template>
