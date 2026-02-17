<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, X } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'
import AliceCheckbox from '../Checkbox/Checkbox.vue'

interface Option {
  label: string
  value: string | number
}

defineOptions({
  name: 'AliceMultiSelect',
})

const props = defineProps<{
  id: string
  modelValue: (string | number)[]
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[]): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const selectedDisplay = computed(() => {
  if (props.modelValue.length === 0) return ''
  if (props.modelValue.length === 1) {
    const opt = props.options.find((o) => o.value === props.modelValue[0])
    return opt ? opt.label : ''
  }
  const firstOpt = props.options.find((o) => o.value === props.modelValue[0])
  const firstLabel = firstOpt ? firstOpt.label : ''
  return `${firstLabel}, +${props.modelValue.length - 1}`
})

const fullSelectionLabel = computed(() => {
  return props.options
    .filter((opt) => props.modelValue.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ')
})

function toggleOption(value: string | number) {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  if (index === -1) {
    newValue.push(value)
  } else {
    newValue.splice(index, 1)
  }
  emit('update:modelValue', newValue)
}

function clearAll(event: Event) {
  event.stopPropagation()
  emit('update:modelValue', [])
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
    <AliceLabel v-if="label" :for="id" :disabled="disabled">
      {{ label }}
    </AliceLabel>

    <div
      @click="isOpen = !isOpen"
      class="h-alice-input-height px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 cursor-pointer flex items-center justify-between gap-2 hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 rounded-alice-md relative pr-9"
      :class="[isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : '']"
      :title="modelValue.length > 1 ? fullSelectionLabel : undefined"
    >
      <!-- Selection Content -->
      <div class="flex items-center gap-2 overflow-hidden w-full">
        <span v-if="modelValue.length === 0" class="text-gray-400 text-sm truncate">
          {{ placeholder || 'Seleccionar...' }}
        </span>

        <div v-else class="flex items-center gap-2 overflow-hidden w-full">
          <!-- Main label -->
          <span class="text-sm text-gray-900 dark:text-white font-medium truncate">
            {{ selectedDisplay }}
          </span>
        </div>
      </div>

      <!-- Action Icons (Fixed on right) -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-0.5">
        <button
          v-if="modelValue.length > 0"
          @click="clearAll"
          class="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors flex items-center justify-center"
          title="Limpiar todo"
        >
          <X :size="14" />
        </button>

        <ChevronDown
          :size="16"
          class="text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Dropdown -->
    <transition name="alice-pop">
      <div
        v-if="isOpen"
        class="absolute z-50 top-full left-0 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1 rounded-alice-md origin-top"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="toggleOption(option.value)"
          class="px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors border-l-3"
          :class="[
            modelValue.includes(option.value)
              ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-600 dark:border-blue-400 font-medium'
              : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-200 border-transparent',
          ]"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <AliceCheckbox
              :model-value="modelValue.includes(option.value)"
              class="pointer-events-none"
            />
            <span class="truncate">{{ option.label }}</span>
          </div>
        </div>

        <div v-if="options.length === 0" class="px-4 py-6 text-sm text-gray-400 text-center italic">
          No hay opciones disponibles
        </div>
      </div>
    </transition>
  </div>
</template>
