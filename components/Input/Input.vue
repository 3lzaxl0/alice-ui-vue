<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Eye, EyeOff, X } from 'lucide-vue-next'
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

const { showPassword, currentType, isPassword, handleInput, togglePassword, clearValue } = useInput(props, emit)

const inputClass = computed(() => {
  return inputVariants({
    error: !!props.error || !!props.errorMessage,
    hasIcon: !!props.icon,
    isPassword: isPassword.value,
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

      <!-- Trailing Action (Password Toggle or Clear) -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
        <button
          v-if="clearable && modelValue && !disabled"
          type="button"
          @click="clearValue"
          class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer outline-none"
          title="Limpiar"
        >
          <X :size="16" />
        </button>

        <button
          v-if="isPassword"
          type="button"
          @click="togglePassword"
          class="flex items-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer outline-none"
        >
          <Eye v-if="!showPassword" :size="18" />
          <EyeOff v-else :size="18" />
        </button>
      </div>
    </div>

    <!-- Feedback Messages -->
    <div v-if="error || errorMessage || helperText || (showCounter && maxlength)" class="flex items-start justify-between gap-4 mt-1">
      <div class="flex-1">
        <p v-if="error && typeof error === 'string'" class="text-xs text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap">
          {{ error }}
        </p>
        <p v-else-if="errorMessage" class="text-xs text-red-500 dark:text-red-400 font-medium whitespace-pre-wrap">
          {{ errorMessage }}
        </p>
        <p v-else-if="helperText" class="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
          {{ helperText }}
        </p>
      </div>
      <p v-if="showCounter && maxlength" class="text-xs text-gray-400 dark:text-gray-500 text-right whitespace-nowrap shrink-0">
        {{ String(modelValue ?? '').length }} / {{ maxlength }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Fix Webkit autofill overriding Alice UI dark mode text and background */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
  -webkit-text-fill-color: #111827; /* text-gray-900 */
  transition: background-color 5000s ease-in-out 0s;
}

:global(.dark) input:-webkit-autofill,
:global(.dark) input:-webkit-autofill:hover, 
:global(.dark) input:-webkit-autofill:focus, 
:global(.dark) input:-webkit-autofill:active{
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
