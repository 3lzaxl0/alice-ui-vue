<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Eye, EyeOff, X, ChevronUp, ChevronDown } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import { inputVariants } from './Input.variants'
import { useInput } from './useInput'

defineOptions({
  name: 'AliceInput',
})

interface Props {
  label?: string
  id: string
  modelValue: string | number
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  icon?: Component | object // Component
  autocomplete?: string
  error?: boolean | string
  errorMessage?: string
  helperText?: string
  maxlength?: number
  showCounter?: boolean
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  pattern?: string
  step?: string | number
  min?: string | number
  max?: string | number
  onlyIntegers?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  required: false,
  disabled: false,
  placeholder: '',
  error: false,
  inputmode: 'text',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const {
  showPassword,
  currentType,
  isPassword,
  handleInput,
  togglePassword,
  clearValue,
  stepUp,
  stepDown,
} = useInput(props, emit)

const isNumber = computed(() => props.type === 'number')

const inputClass = computed(() => {
  return inputVariants({
    error: !!props.error || !!props.errorMessage,
    hasIcon: !!props.icon,
    hasTrailing: isPassword.value || isNumber.value || (props.clearable && !!props.modelValue),
  })
})
</script>

<template>
  <div class="flex flex-col w-full gap-0">
    <AliceLabel v-if="label" :for="id" :error="!!error || !!errorMessage" :disabled="disabled">
      {{ label }}
    </AliceLabel>

    <div class="relative group">
      <!-- Leading Icon -->
      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors"
      >
        <component :is="icon" :size="18" />
      </div>

      <!-- Input -->
      <input
        :id="id"
        :value="modelValue"
        :type="currentType"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :name="id"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :inputmode="inputmode"
        :pattern="pattern"
        :step="step"
        :min="min"
        :max="max"
        :class="inputClass"
        @input="handleInput"
      />

      <!-- Trailing Action Slot -->
      <div class="absolute inset-y-0 right-0 pr-1.5 flex items-center gap-1.5">
        <!-- Clear Button -->
        <button
          v-if="clearable && modelValue && !disabled"
          type="button"
          @click="clearValue"
          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-md outline-none cursor-pointer"
          title="Limpiar"
        >
          <X :size="14" />
        </button>

        <!-- Stepper (Numeric) -->
        <div v-if="isNumber && !disabled" class="flex flex-col h-full py-1.5 justify-center">
          <button
            type="button"
            @click="stepUp"
            class="flex-1 px-1 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all rounded-t-md outline-none cursor-pointer"
          >
            <ChevronUp :size="12" stroke-width="3" />
          </button>
          <button
            type="button"
            @click="stepDown"
            class="flex-1 px-1 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all rounded-b-md outline-none cursor-pointer"
          >
            <ChevronDown :size="12" stroke-width="3" />
          </button>
        </div>

        <!-- Password Toggle -->
        <button
          v-if="isPassword"
          type="button"
          @click="togglePassword"
          class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all rounded-md outline-none cursor-pointer"
        >
          <Eye v-if="!showPassword" :size="16" />
          <EyeOff v-else :size="16" />
        </button>
      </div>
    </div>

    <!-- Feedback Messages -->
    <div
      v-if="error || errorMessage || helperText || (showCounter && maxlength)"
      class="flex items-start justify-between gap-4 mt-1"
    >
      <div class="flex-1">
        <p
          v-if="error && typeof error === 'string'"
          class="text-xs text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap"
        >
          {{ error }}
        </p>
        <p
          v-else-if="errorMessage"
          class="text-xs text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap"
        >
          {{ errorMessage }}
        </p>
        <p
          v-else-if="helperText"
          class="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap"
        >
          {{ helperText }}
        </p>
      </div>
      <p
        v-if="showCounter && maxlength"
        class="text-xs text-gray-400 dark:text-gray-500 text-right whitespace-nowrap shrink-0"
      >
        {{ String(modelValue ?? '').length }} / {{ maxlength }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Hide standard spin buttons (chrome, safari, edge, firefox) */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Fix Webkit autofill overriding Alice UI dark mode text and background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: #111827; /* text-gray-900 */
  transition: background-color 5000s ease-in-out 0s;
}

:global(.dark) input:-webkit-autofill,
:global(.dark) input:-webkit-autofill:hover,
:global(.dark) input:-webkit-autofill:focus,
:global(.dark) input:-webkit-autofill:active {
  -webkit-text-fill-color: #ffffff;
  transition: background-color 5000s ease-in-out 0s;
}

/* Force placeholder colors due to Tailwind dark mode inheritance issues */
input::placeholder {
  color: #9ca3af !important; /* text-gray-400 */
  -webkit-text-fill-color: initial !important;
}

:global(.dark) input::placeholder {
  color: #6b7280 !important; /* text-gray-500 */
  -webkit-text-fill-color: initial !important;
}
</style>
