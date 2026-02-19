<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCalendar from './Calendar.vue'

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
    displayFormat?: string
  }>(),
  {
    displayFormat: 'DD/MM/YYYY',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// ── State ──
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Mask: DD/MM/YYYY
const MASK_BASE = '__/__/____'
const SEPARATOR = '/'

// ── Typed text ──
const inputText = ref('')

// Sync inputText ← modelValue
function modelToDisplay(val: string | null): string {
  if (!val) return ''
  const parts = val.split('-')
  if (parts.length !== 3) return ''
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

watch(
  () => props.modelValue,
  (val) => {
    inputText.value = modelToDisplay(val)
  },
  { immediate: true },
)

// ── Mask Overlay Logic ──
const maskOverlay = computed(() => {
  let result = ''
  for (let i = 0; i < MASK_BASE.length; i++) {
    // If we have a character at this position in inputText, show a space in the overlay
    if (inputText.value[i]) {
      result += ' '
    } else {
      result += MASK_BASE[i]
    }
  }
  return result
})

// ── Input handling with auto-separators ──
function handleInput(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/[^0-9/]/g, '')

  // Remove extra separators
  const digits = raw.replace(/\//g, '')

  // Limit to 8 digits
  const trimmed = digits.slice(0, 8)

  // Re-build with separators
  let formatted = ''
  for (let i = 0; i < trimmed.length; i++) {
    if (i === 2 || i === 4) formatted += SEPARATOR
    formatted += trimmed[i]
  }

  inputText.value = formatted
  input.value = formatted

  // If complete (DD/MM/YYYY = 10 chars), try to parse
  if (formatted.length === 10) {
    const parsed = parseDisplayDate(formatted)
    if (parsed) {
      emit('update:modelValue', parsed)
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowed.includes(e.key)) return

  if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return

  if (/^\d$/.test(e.key)) {
    const digits = inputText.value.replace(/\//g, '')
    if (digits.length >= 8) {
      e.preventDefault()
    }
    return
  }

  if (e.key === '/') {
    e.preventDefault()
    return
  }

  e.preventDefault()
}

function handleBlur() {
  if (inputText.value && inputText.value.length > 0 && inputText.value.length < 10) {
    inputText.value = modelToDisplay(props.modelValue)
  } else if (inputText.value.length === 10) {
    const parsed = parseDisplayDate(inputText.value)
    if (!parsed) {
      inputText.value = modelToDisplay(props.modelValue)
    }
  } else if (inputText.value === '') {
    if (props.modelValue !== null) {
      emit('update:modelValue', null)
    }
  }
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const digits = pasted.replace(/[^0-9]/g, '').slice(0, 8)
  let formatted = ''
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) formatted += SEPARATOR
    formatted += digits[i]
  }
  inputText.value = formatted
  if (inputRef.value) inputRef.value.value = formatted

  if (formatted.length === 10) {
    const parsed = parseDisplayDate(formatted)
    if (parsed) emit('update:modelValue', parsed)
  }
}

function parseDisplayDate(display: string): string | null {
  const parts = display.split(SEPARATOR)
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return null

  const day = parseInt(dd, 10)
  const month = parseInt(mm, 10)
  const year = parseInt(yyyy, 10)

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null
  if (year < 1900 || year > 2200) return null

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

const selectDate = (dateStr: string | null) => {
  emit('update:modelValue', dateStr)
  isOpen.value = false
}

const clearDate = (e: Event) => {
  e.stopPropagation()
  emit('update:modelValue', null)
  inputText.value = ''
}

const toggleCalendar = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (!isOpen.value) {
      nextTick(() => inputRef.value?.focus())
    }
  }
}

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

    <div
      class="h-alice-input-height px-3 bg-white dark:bg-white/5 border flex items-center gap-2 transition-all duration-300 rounded-alice-md relative w-full group/input"
      :class="[
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : '',
      ]"
    >
      <!-- Typeable input container with mask overlay -->
      <div class="flex-1 relative h-full flex items-center overflow-hidden">
        <!-- Mask Overlay -->
        <div
          v-if="!disabled"
          class="absolute inset-0 flex items-center text-sm pointer-events-none text-gray-300 dark:text-gray-600 font-mono tracking-widest whitespace-pre"
        >
          {{ maskOverlay }}
        </div>

        <!-- Main Input -->
        <input
          ref="inputRef"
          :id="id"
          type="text"
          :value="inputText"
          :disabled="disabled"
          autocomplete="off"
          inputmode="numeric"
          class="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white font-mono tracking-widest relative z-10"
          @input="handleInput"
          @keydown="handleKeydown"
          @blur="handleBlur"
          @paste="handlePaste"
          @focus="isOpen = false"
        />
      </div>

      <!-- Actions Area -->
      <div class="flex items-center gap-1">
        <!-- Clear Action -->
        <button
          type="button"
          v-if="modelValue && !disabled"
          @click="clearDate"
          class="shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
          tabindex="-1"
        >
          <X :size="14" />
        </button>

        <!-- Divider -->
        <div v-if="!disabled" class="w-px h-4 bg-gray-100 dark:bg-slate-700 mx-0.5"></div>

        <!-- Calendar Button -->
        <button
          type="button"
          @click.stop="toggleCalendar"
          class="shrink-0 p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-md cursor-pointer flex items-center justify-center"
          :class="{
            'text-blue-500 bg-blue-50 dark:bg-blue-900/20': isOpen,
            'cursor-not-allowed opacity-50': disabled,
          }"
          :disabled="disabled"
          tabindex="-1"
          title="Abrir calendario"
        >
          <CalendarIcon :size="16" />
        </button>
      </div>
    </div>

    <!-- Calendar Dropdown -->
    <transition name="alice-pop">
      <div
        v-if="isOpen"
        class="absolute z-alice-modal top-full right-0 mt-1 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl rounded-alice-lg origin-top-right min-w-[280px]"
      >
        <AliceCalendar :model-value="modelValue" @update:model-value="selectDate" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Ensure mono digits are consistent widths in different browsers */
input {
  font-variant-numeric: tabular-nums;
}
</style>
