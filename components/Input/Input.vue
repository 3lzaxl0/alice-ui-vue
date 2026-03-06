<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
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
  error?: boolean
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  required: false,
  disabled: false,
  placeholder: '',
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const { showPassword, currentType, isPassword, handleInput, togglePassword } = useInput(props, emit)

const inputClass = computed(() => {
  return inputVariants({
    error: props.error,
    hasIcon: !!props.icon,
    isPassword: isPassword.value,
  })
})
</script>

<template>
  <div class="flex flex-col w-full gap-0">
    <AliceLabel v-if="label" :for="id" :error="error" :disabled="disabled">
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
        :class="inputClass"
        @input="handleInput"
      />

      <!-- Trailing Action (Password Toggle) -->
      <button
        v-if="isPassword"
        type="button"
        @click="togglePassword"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer outline-none"
      >
        <Eye v-if="!showPassword" :size="18" />
        <EyeOff v-else :size="18" />
      </button>
    </div>
  </div>
</template>
