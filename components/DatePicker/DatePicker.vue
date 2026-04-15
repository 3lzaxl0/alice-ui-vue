<script setup lang="ts">
import { useDatePicker } from './useDatePicker'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCalendar from '../Calendar/Calendar.vue'
import AliceButton from '../Button/Button.vue'
import AlicePopover from '../Popover/Popover.vue'

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
    name?: string
    placement?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center'
    mobileFullscreen?: boolean
  }>(),
  {
    displayFormat: 'DD/MM/YYYY',
    placement: 'bottom-left',
    mobileFullscreen: true,
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
} = useDatePicker(props, emit)
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="!!error || !!errorMessage">
      {{ label }}
    </AliceLabel>

    <AlicePopover
      v-model="isOpen"
      :placement="placement"
      :mobile-fullscreen="mobileFullscreen"
      :close-on-click="false"
      trigger-class="w-full"
    >
      <template #trigger>
        <div
          class="h-alice-input-height px-3 bg-white dark:bg-white/5 border flex items-center gap-2 transition-all duration-300 rounded-alice-md relative w-full group/input"
          :class="[
            isOpen
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : 'border-gray-200 dark:border-slate-700 hover:border-primary-500/50',
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
            (!!error || !!errorMessage) ? 'border-error-500 focus-within:border-error-500 focus-within:ring-error-500/20 text-error-900 dark:text-error-400' : '',
          ]"
        >
          <!-- Typeable input container with mask overlay -->
          <div class="flex-1 relative h-full flex items-center overflow-hidden">
            <!-- Mask Overlay -->
            <div
              v-if="!disabled"
              class="absolute inset-0 flex items-center text-sm pointer-events-none text-gray-300 dark:text-gray-600 font-mono whitespace-pre"
            >
              {{ maskOverlay }}
            </div>

            <!-- Main Input -->
            <input
              ref="inputRef"
              :id="id"
              :name="name || id"
              type="text"
              :value="inputText"
              :disabled="disabled"
              autocomplete="off"
              inputmode="numeric"
              class="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white font-mono relative z-10"
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
              @click.stop="clearDate"
              class="hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 text-gray-400"
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
              class="text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              :class="{
                'text-primary-500 bg-primary-50 dark:bg-primary-900/20': isOpen,
                'cursor-not-allowed opacity-50': disabled,
              }"
              :disabled="disabled"
              tabindex="-1"
              title="Abrir calendario"
              :icon="CalendarIcon"
            />
          </div>
        </div>
      </template>

      <template #default>
        <AliceCalendar :model-value="modelValue" @update:model-value="selectDate" />
      </template>
    </AlicePopover>

    <!-- Feedback Messages -->
    <p v-if="error && typeof error === 'string'" class="mt-1 text-xs text-error-500 font-medium whitespace-pre-wrap">
      {{ error }}
    </p>
    <p v-else-if="errorMessage" class="mt-1 text-xs text-error-500 font-medium whitespace-pre-wrap">
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
