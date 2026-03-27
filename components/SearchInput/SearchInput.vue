<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Search, X, Loader2 } from 'lucide-vue-next'
import { useSearchInput } from './useSearchInput'

import AliceLabel from '../Label/Label.vue'

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
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  errorMessage?: string
  helperText?: string
}

defineOptions({
  name: 'AliceSearchInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  results: () => [],
  loading: false,
  placeholder: 'Buscar...',
  disabled: false,
  error: false,
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
  handleInput,
  selectResult,
  clear,
  handleFocus,
  handleClickOutside,
  handleKeydown,
} = useSearchInput(props, emit)

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="!!error || !!errorMessage">
      {{ label }}
    </AliceLabel>

    <div class="relative">
      <!-- Search Icon -->
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
      >
        <Loader2 v-if="loading" :size="18" class="animate-spin text-blue-500" />
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
        autocomplete="off"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
        class="w-full h-alice-input-height px-3 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-alice-input focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 rounded-alice-md pl-10"
        :class="[
          modelValue || searchQuery ? 'pr-10' : 'pr-3',
          (!!error || !!errorMessage) ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-400' : ''
        ]"
      />

      <!-- Clear Button -->
      <button
        v-if="searchQuery && !disabled"
        @click="clear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
      >
        <X :size="16" />
      </button>

      <!-- Dropdown Results -->
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
          class="absolute z-50 mt-1 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1 rounded-alice-md origin-top custom-scrollbar"
        >
          <div v-if="loading" class="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
            <Loader2 :size="14" class="animate-spin" /> Buscando...
          </div>

          <template v-else-if="displayedResults.length > 0">
            <div
              v-for="(result, index) in displayedResults"
              :key="result.value"
              role="option"
              :aria-selected="index === activeIndex"
              @mousedown.prevent="selectResult(result)"
              class="px-3 py-2 text-sm cursor-pointer border-b border-gray-50 dark:border-slate-800 last:border-0 transition-colors flex flex-col gap-0.5"
              :class="[
                index === activeIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30 ring-inset ring-2 ring-blue-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/50',
              ]"
            >
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
                    class="text-blue-500 dark:text-blue-400 font-bold underline decoration-blue-500/30 underline-offset-2"
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
                  <span v-else class="text-blue-400/80 dark:text-blue-300 font-semibold">{{
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
    </div>

    <!-- Feedback Messages -->
    <p v-if="error && typeof error === 'string'" class="mt-1 text-[13px] text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap">
      {{ error }}
    </p>
    <p v-else-if="errorMessage" class="mt-1 text-[13px] text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap">
      {{ errorMessage }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-[13px] text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
      {{ helperText }}
    </p>
  </div>
</template>
