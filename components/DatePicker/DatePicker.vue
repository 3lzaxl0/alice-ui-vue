<script setup lang="ts">
import { useDatePicker } from './useDatePicker'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCalendar from '../Calendar/Calendar.vue'
import AliceButton from '../Button/Button.vue'

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
    error?: boolean | string
    errorMessage?: string
    helperText?: string
    displayFormat?: string
  }>(),
  {
    displayFormat: 'DD/MM/YYYY',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const {
  isOpen,
  containerRef,
  inputRef,
  inputText,
  maskOverlay,
  handleInput,
  handleKeydown,
  handleBlur,
  handlePaste,
  selectDate,
  clearDate,
  toggleCalendar,
  handleClickOutside,
} = useDatePicker(props, emit)

import { onMounted, onUnmounted } from 'vue'
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="!!error || !!errorMessage">
      {{ label }}
    </AliceLabel>

    <div
      class="h-alice-input-height px-3 bg-white dark:bg-white/5 border flex items-center gap-2 transition-all duration-300 rounded-alice-md relative w-full group/input"
      :class="[
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        (!!error || !!errorMessage) ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20 text-red-900 dark:text-red-400' : '',
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
        <AliceButton
          v-if="modelValue && !disabled"
          variant="primary" design="ghost-subtle"
          size="icon-sm"
          :icon-size="14"
          @click="clearDate"
          class="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400"
          tabindex="-1"
          :icon="X"
        />

        <!-- Divider -->
        <div v-if="!disabled" class="w-px h-4 bg-gray-100 dark:bg-slate-700 mx-0.5"></div>

        <!-- Calendar Button -->
        <AliceButton
          variant="primary" design="ghost-subtle"
          size="icon-sm"
          :icon-size="16"
          @click.stop="toggleCalendar"
          class="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          :class="{
            'text-blue-500 bg-blue-50 dark:bg-blue-900/20': isOpen,
            'cursor-not-allowed opacity-50': disabled,
          }"
          :disabled="disabled"
          tabindex="-1"
          title="Abrir calendario"
          :icon="CalendarIcon"
        />
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

    <!-- Feedback Messages -->
    <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-red-500 font-medium whitespace-pre-wrap">
      {{ error }}
    </p>
    <p v-else-if="errorMessage" class="mt-1 text-xs text-red-500 font-medium whitespace-pre-wrap">
      {{ errorMessage }}
    </p>
    <p v-else-if="helperText" class="mt-1 text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
      {{ helperText }}
    </p>
  </div>
</template>

<style scoped>
/* Ensure mono digits are consistent widths in different browsers */
input {
  font-variant-numeric: tabular-nums;
}
</style>
