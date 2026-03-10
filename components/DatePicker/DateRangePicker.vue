<script setup lang="ts">
import { useDateRangePicker } from './useDateRangePicker'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCalendarRange from '../Calendar/CalendarRange.vue'
import AliceButton from '../Button/Button.vue'

defineOptions({
  name: 'AliceDateRangePicker',
})

interface Props {
  id?: string
  modelValue: [string, string] | null
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  displayFormat?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  displayFormat: 'DD/MM/YYYY',
  placeholder: 'DD/MM/YYYY - DD/MM/YYYY',
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: [string, string] | null): void
}>()

const {
  isOpen,
  containerRef,
  displayText,
  selectRange,
  clearRange,
  toggleCalendar,
  handleClickOutside,
} = useDateRangePicker(props, emit)

import { onMounted, onUnmounted } from 'vue'
import { useFilterValidation } from '../FilterPanel/useFilterValidation'

useFilterValidation(props)

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex flex-col gap-0 w-full relative group" ref="containerRef">
    <AliceLabel v-if="label" :for="id" :disabled="disabled" :error="error">
      {{ label }}
    </AliceLabel>

    <div
      class="h-alice-input-height px-3 bg-white dark:bg-white/5 border flex items-center gap-2 transition-all duration-300 rounded-alice-md relative w-full group/input cursor-pointer"
      :class="[
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-700 hover:border-blue-500/50',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : '',
        error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : '',
      ]"
      @click="!disabled && toggleCalendar()"
    >
      <!-- ReadOnly Text Display -->
      <div
        class="flex-1 text-sm font-mono tracking-widest truncate"
        :class="[
          !displayText ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white',
        ]"
      >
        {{ displayText || placeholder }}
      </div>

      <!-- Actions Area -->
      <div class="flex items-center gap-1">
        <!-- Clear Action -->
        <AliceButton
          v-if="modelValue && !disabled"
          variant="ghost-subtle"
          size="icon-sm"
          :icon-size="14"
          @click.stop="clearRange"
          class="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400"
          tabindex="-1"
          :icon="X"
        />

        <!-- Divider -->
        <div v-if="!disabled" class="w-px h-4 bg-gray-100 dark:bg-slate-700 mx-0.5"></div>

        <!-- Calendar Button -->
        <AliceButton
          variant="ghost-subtle"
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
        class="absolute z-alice-modal top-full right-0 md:left-0 md:right-auto mt-1 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 shadow-xl rounded-alice-lg origin-top min-w-max"
      >
        <AliceCalendarRange :model-value="modelValue" @update:model-value="selectRange" />
      </div>
    </transition>
  </div>
</template>
