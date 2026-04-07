<script setup lang="ts">
import { onMounted, onUnmounted, ref, type CSSProperties, nextTick, watch } from 'vue'
import { ChevronDown, Check, X } from 'lucide-vue-next'
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
  error?: boolean | string
  errorMessage?: string
  helperText?: string
  clearable?: boolean
  name?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', value: string | number | null): void
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
  clearValue,
  toggleOpen,
  handleClickOutside,
  handleKeydown,
} = useSelect(props, emit)

// --- Teleport / Positioning Logic ---
const dropdownStyle = ref<CSSProperties>({
  position: 'fixed',
  zIndex: 9999, // Super high to be above everything including Dialogs
  pointerEvents: 'none',
  opacity: 0,
})

function updateDropdownPosition() {
  if (!isOpen.value || !buttonRef.value) return

  const rect = buttonRef.value.getBoundingClientRect()
  
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`, // Slight gap
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 9999,
    opacity: 1,
    pointerEvents: 'auto',
  }
}

// Watch for open to trigger position update
watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    updateDropdownPosition()
    window.addEventListener('scroll', updateDropdownPosition, true) // capture to track any scrolling ancestor
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="!!error || !!errorMessage">
      {{ label }}
    </AliceLabel>

    <button
      type="button"
      :id="id"
      :name="name || id"
      ref="buttonRef"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="isOpen && id ? `${id}-listbox` : undefined"
      :disabled="disabled"
      @click="toggleOpen"
      @keydown="handleKeydown"
      class="h-alice-input-height px-3 bg-white dark:bg-white/5 border cursor-pointer flex items-center justify-between gap-2 transition-all duration-300 rounded-alice-md relative w-full outline-none"
      :class="[
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        (!!error || !!errorMessage) ? 'border-red-500 dark:border-red-400 focus-within:border-red-500 dark:focus-within:border-red-400 focus-within:ring-red-500/20' : '',
      ]"
    >
      <!-- Selected Value -->
      <span
        class="text-sm truncate select-none text-left"
        :class="[!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white font-medium']"
      >
        {{ displayLabel }}
      </span>

      <div class="flex items-center gap-1 shrink-0">
        <!-- Clear Button -->
        <button
          v-if="clearable && modelValue"
          type="button"
          class="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-red-500 transition-colors"
          @click.stop="clearValue"
        >
          <X :size="14" />
        </button>

        <!-- Chevron Icon -->
        <ChevronDown
          :size="16"
          class="text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </button>

    <!-- Dropdown (Teleported to body) -->
    <Teleport to="body">
      <transition name="alice-pop">
        <div
          v-if="isOpen"
          :id="id ? `${id}-listbox` : undefined"
          ref="listboxRef"
          role="listbox"
          :style="dropdownStyle"
          class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1 rounded-alice-md origin-top custom-scrollbar"
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
    </Teleport>

    <!-- Feedback Messages -->
    <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap">
      {{ error }}
    </p>
    <p v-else-if="errorMessage" class="mt-1 text-xs text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap">
      {{ errorMessage }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
      {{ helperText }}
    </p>
  </div>
</template>
