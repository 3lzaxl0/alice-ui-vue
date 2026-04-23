<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, watch, type CSSProperties } from 'vue'
import { Search, X, Loader2 } from 'lucide-vue-next'
import { useSearchInput } from './useSearchInput'

import AliceLabel from '../Label/Label.vue'
import { AliceDivider } from '../..'

// Helper to render text with highlights
const HighlightedText = ({ text, indices }: { text: string; indices?: number[] }) => {
  if (!indices || indices.length === 0) return text

  const chunks = []
  let lastIdx = 0

  const sorted = [...indices].sort((a, b) => a - b)

  for (const idx of sorted) {
    if (idx > lastIdx) {
      chunks.push(text.substring(lastIdx, idx))
    }
    chunks.push({ highlighted: true, char: text[idx] })
    lastIdx = idx + 1
  }

  if (lastIdx < text.length) {
    chunks.push(text.substring(lastIdx))
  }

  return chunks
}

interface Result {
  label: string
  value: string | number
  description?: string
  labelIndices?: number[]
  descriptionIndices?: number[]
}

interface Props {
  id: string
  label?: string
  modelValue?: Result | null
  results?: Result[]
  loading?: boolean
  localSearch?: boolean
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  errorMessage?: string
  helperText?: string
  /** Unique key to persist and restore recent selections via localStorage */
  persistentKey?: string
  /** Max number of recent items to remember (default: 5) */
  maxRecent?: number
  /** Minimum characters to trigger a search event (default: 0) */
  minChars?: number
  /** Debounce delay for the search event in milliseconds (default: 0) */
  debounceMs?: number
  readonly?: boolean
}

defineOptions({
  name: 'AliceSearchInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  results: () => [],
  loading: false,
  localSearch: true,
  placeholder: 'Buscar...',
  disabled: false,
  error: false,
  minChars: 0,
  debounceMs: 0,
  readonly: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Result | null): void
  (e: 'search', query: string): void
}>()

const {
  isOpen,
  searchQuery,
  containerRef,
  inputRef,
  listboxRef,
  activeIndex,
  displayedResults,
  showingRecents,
  recentCount,
  handleInput,
  selectResult,
  clear,
  handleFocus,
  handleClickOutside,
  handleKeydown,
} = useSearchInput(props, emit)

// --- Teleport / Positioning Logic ---
const dropdownStyle = ref<CSSProperties>({
  position: 'fixed',
  zIndex: 9999,
  pointerEvents: 'none',
  opacity: 0,
})

function updateDropdownPosition() {
  if (!isOpen.value || !inputRef.value) return

  const rect = inputRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const estimatedDropdownHeight = 240 // max-h-60 = 240px

  const style: CSSProperties = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 9999,
    opacity: 1,
    pointerEvents: 'auto',
  }

  if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
    style.bottom = `${window.innerHeight - rect.top + 4}px`
    style.transformOrigin = 'bottom'
    style.top = undefined
  } else {
    style.top = `${rect.bottom + 4}px`
    style.transformOrigin = 'top'
    style.bottom = undefined
  }

  dropdownStyle.value = style
}

watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    updateDropdownPosition()
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled || readonly" :error="!!error || !!errorMessage">
      {{ label }}
    </AliceLabel>

    <div class="relative">
      <!-- Search Icon -->
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
      >
        <Loader2 v-if="loading" :size="18" class="animate-spin text-primary-500" />
        <Search v-else :size="18" />
      </div>

      <input
        :id="id"
        ref="inputRef"
        type="text"
        role="combobox"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :aria-controls="isOpen ? `${id}-listbox` : undefined"
        :value="searchQuery"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        autocomplete="off"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
        class="w-full h-alice-input-height px-3 text-sm border shadow-alice-input transition-all outline-none rounded-alice-md pl-10"
        :class="[
          modelValue || searchQuery ? 'pr-10' : 'pr-3',
          (!!error || !!errorMessage) ? 'border-error-500 dark:border-error-400 focus:ring-2 focus:ring-error-500/20 focus:border-error-500 dark:focus:border-error-400' : 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
          (disabled || readonly) ? 'bg-gray-100 dark:bg-slate-900 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-white/5 text-gray-900 dark:text-white'
        ]"
      />

      <!-- Clear Button -->
      <button
        v-if="searchQuery && !disabled && !readonly"
        @click="clear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
      >
        <X :size="16" />
      </button>

      <!-- Dropdown Results (Teleported to body) -->
      <Teleport to="body">
        <transition name="alice-pop">
          <div
            v-if="
              isOpen &&
              (displayedResults.length > 0 ||
                loading ||
                (searchQuery && displayedResults.length === 0))
            "
            :id="`${id}-listbox`"
            ref="listboxRef"
            role="listbox"
            :style="dropdownStyle"
            class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden max-h-47 overflow-y-auto py-1 rounded-alice-md custom-scrollbar"
          >
            <div v-if="loading" class="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
              <Loader2 :size="14" class="animate-spin" /> Buscando...
            </div>

            <template v-else-if="displayedResults.length > 0">
              <!-- Recents section header -->
              <div
                v-if="showingRecents && recentCount > 0"
                class="px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-400 dark:text-primary-500 select-none"
              >
                <span class="flex-1">Recientes</span>
              </div>

              <div
                v-for="(result, index) in displayedResults"
                :key="result.value"
                role="option"
                :aria-selected="index === activeIndex"
                @mousedown.prevent="selectResult(result)"
                class="px-3 py-2 text-sm cursor-pointer transition-colors flex flex-col gap-0.5"
                :class="[
                  index === activeIndex
                    ? 'bg-primary-50 dark:bg-primary-900/30 ring-inset ring-2 ring-primary-500/50'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50',
                ]"
              >
                <!-- Separator between recents and the rest -->

                <AliceDivider
                  v-if="showingRecents && index === recentCount"
                />
                <div
                  v-if="showingRecents && index === recentCount"
                  class="px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 select-none -mx-3 mb-1 mt-1"
                >
                  <span>Todos</span>
                </div>
                <div class="font-medium text-gray-700 dark:text-gray-200">
                  <template
                    v-for="(chunk, idx) in HighlightedText({
                      text: result.label,
                      indices: result.labelIndices,
                    })"
                    :key="idx"
                  >
                    <span v-if="typeof chunk === 'string'">{{ chunk }}</span>
                    <span
                      v-else
                      class="text-primary-500 dark:text-primary-400 font-bold underline decoration-primary-500/30 underline-offset-2"
                      >{{ chunk.char }}</span
                    >
                  </template>
                </div>
                <div v-if="result.description" class="text-xs text-gray-400">
                  <template
                    v-for="(chunk, idx) in HighlightedText({
                      text: result.description,
                      indices: result.descriptionIndices,
                    })"
                    :key="idx"
                  >
                    <span v-if="typeof chunk === 'string'">{{ chunk }}</span>
                    <span v-else class="text-primary-400/80 dark:text-primary-300 font-semibold">{{
                      chunk.char
                    }}</span>
                  </template>
                </div>
              </div>
            </template>

            <div
              v-else
              class="px-3 text-sm text-gray-400 text-center flex flex-col items-center gap-2 py-6"
            >
              <Search :size="20" class="text-gray-200" />
              No se encontraron resultados
            </div>
          </div>
        </transition>
      </Teleport>
    </div>

    <!-- Feedback Messages -->
    <p v-if="error && typeof error === 'string'" class="mt-1 text-[13px] text-error-500 dark:text-error-400 font-medium whitespace-pre-wrap">
      {{ error }}
    </p>
    <p v-else-if="errorMessage" class="mt-1 text-[13px] text-error-500 dark:text-error-400 font-medium whitespace-pre-wrap">
      {{ errorMessage }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-[13px] text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
      {{ helperText }}
    </p>
  </div>
</template>
