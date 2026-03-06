<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useDropdownMenu } from './useDropdownMenu'
import AliceLabel from '../Label/Label.vue'

interface Option {
  label: string
  value: string | number
}

defineOptions({
  name: 'AliceDropdownMenu',
})

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue: string | number | null
    options: Option[]
    label?: string
    placeholder?: string
    disabled?: boolean
    /** Visual design: 'default' (bordered input) or 'ghost' (minimal text) */
    design?: 'default' | 'ghost'
    /** Size: 'sm' (compact) or 'md' (standard input height) */
    size?: 'sm' | 'md'
  }>(),
  {
    placeholder: 'Seleccionar...',
    disabled: false,
    design: 'default',
    size: 'md',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const {
  isOpen,
  containerRef,
  triggerRef,
  listboxRef,
  activeIndex,
  selectedOption,
  displayLabel,
  selectOption,
  toggleOpen,
  handleClickOutside,
  handleKeydown,
} = useDropdownMenu(props, emit)

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled">
      {{ label }}
    </AliceLabel>

    <!-- Trigger -->
    <div
      ref="triggerRef"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="isOpen && id ? `${id}-listbox` : undefined"
      :tabindex="disabled ? -1 : 0"
      @click="toggleOpen"
      @keydown="handleKeydown"
      :title="displayLabel"
      :class="[
        // Base
        'flex items-center justify-between gap-2 transition-all duration-300 relative w-full outline-none select-none',

        // Design: default (like AliceSelect)
        design === 'default' && [
          'bg-white dark:bg-white/5 border cursor-pointer rounded-alice-md',
          size === 'md' ? 'h-alice-input-height px-3' : 'h-7 px-2',
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        ],

        // Design: ghost (minimal)
        design === 'ghost' && [
          'cursor-pointer rounded-md',
          size === 'md' ? 'py-1.5 px-2' : 'py-0.5 px-1',
          isOpen ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ],
      ]"
    >
      <!-- Selected Value -->
      <span
        class="truncate"
        :class="[
          design === 'default'
            ? [
                !selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white font-medium',
                size === 'md' ? 'text-sm' : 'text-xs',
              ]
            : [
                !selectedOption
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-300',
                size === 'md' ? 'text-xs' : 'text-[11px]',
              ],
        ]"
      >
        {{ displayLabel }}
      </span>

      <!-- Chevron -->
      <ChevronDown
        :size="design === 'ghost' && size === 'sm' ? 12 : 16"
        class="shrink-0 transition-transform duration-200"
        :class="[
          isOpen ? 'rotate-180' : '',
          design === 'default' ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500',
        ]"
      />
    </div>

    <!-- Dropdown -->
    <transition name="alice-pop">
      <div
        v-if="isOpen"
        :id="id ? `${id}-listbox` : undefined"
        ref="listboxRef"
        role="listbox"
        class="absolute z-alice-modal top-full left-0 mt-1.5 w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1 rounded-alice-md origin-top custom-scrollbar"
        :class="[design === 'ghost' ? 'min-w-48' : '']"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          role="option"
          :aria-selected="modelValue === option.value"
          @mousedown.prevent="selectOption(option)"
          class="px-3 cursor-pointer flex items-center justify-between transition-colors"
          :class="[
            size === 'md' ? 'py-2.5 text-sm' : 'py-2 text-xs',
            modelValue === option.value
              ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
              : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-200',
            index === activeIndex
              ? 'bg-gray-100 dark:bg-slate-800 ring-2 ring-inset ring-blue-500/50'
              : '',
          ]"
        >
          <span class="truncate">{{ option.label }}</span>
          <Check
            v-if="modelValue === option.value"
            :size="14"
            class="text-blue-600 dark:text-blue-400 shrink-0"
          />
        </div>

        <div v-if="options.length === 0" class="px-4 py-6 text-sm text-gray-400 text-center italic">
          No hay opciones disponibles
        </div>
      </div>
    </transition>
  </div>
</template>
