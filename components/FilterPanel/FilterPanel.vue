<script setup lang="ts">
import { provide, onUnmounted } from 'vue'
import AliceButton from '../Button/Button.vue'
import { Filter } from 'lucide-vue-next'
import { FilterPanelKey, type ValidatorFn } from './useFilterValidation'
import { useToast } from '../Toast/useToast'

defineOptions({
  name: 'AliceFilterPanel',
})

const emit = defineEmits<{
  (e: 'filter'): void
}>()

const { add } = useToast()

// Registry of child validators (Inputs)
const validators = new Map<string, ValidatorFn>()

provide(FilterPanelKey, {
  registerValidator: (id: string, validator: ValidatorFn) => {
    validators.set(id, validator)
  },
  unregisterValidator: (id: string) => {
    validators.delete(id)
  },
})

function handleFilter() {
  // Execute all registered validators
  for (const validate of validators.values()) {
    const result = validate()
    if (!result.valid) {
      add({
        type: 'warning',
        title: 'Filtro Requerido',
        message: `El filtro "${result.name}" es obligatorio.`,
      })
      return // Halt filter propagation
    }
  }

  // All inputs passed validation
  emit('filter')
}

onUnmounted(() => {
  validators.clear()
})
</script>

<template>
  <div
    class="bg-white dark:bg-white/2 p-5 border border-gray-100 dark:border-white/10 flex flex-col lg:flex-row gap-5 items-end lg:items-center justify-between transition-all duration-300 rounded-alice-md shadow-alice-sm"
  >
    <!-- Filters Area -->
    <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <slot></slot>
    </div>

    <!-- Action Button -->
    <div class="shrink-0 w-full lg:w-auto">
      <AliceButton @click="handleFilter" :icon="Filter" class="w-full lg:w-auto min-w-[100px]">
        Filtrar
      </AliceButton>
    </div>
  </div>
</template>
