<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import AliceInput from '../Input/Input.vue'
import AliceCheckbox from '../Checkbox/Checkbox.vue'
import AliceSelect from '../Select/Select.vue'
import AliceDatePicker from '../DatePicker/DatePicker.vue'
import AliceButton from '../../components/Button/Button.vue'
import type { FilterType, FilterOption, FilterValue } from '../../types'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface Props {
  type: FilterType
  options?: FilterOption[] // For 'select' type
  modelValue?: FilterValue
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: () => ({ value: null }),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterValue): void
  (e: 'apply'): void
  (e: 'clear'): void
  (e: 'close'): void
}>()

defineOptions({
  name: 'AliceTableFilter',
})

/* -------------------------------------------------------------------------- */
/*                                    STATE                                   */
/* -------------------------------------------------------------------------- */

// Operators based on type
const operators = computed(() => {
  switch (props.type) {
    case 'text':
      return [
        { label: 'Contiene', value: 'contains' },
        { label: 'Igual a', value: 'equals' },
        { label: 'Empieza con', value: 'startsWith' },
        { label: 'Termina con', value: 'endsWith' },
      ]
    case 'number':
      return [
        { label: 'Igual a', value: 'equals' },
        { label: 'Mayor que', value: 'gt' },
        { label: 'Menor que', value: 'lt' },
        { label: 'Mayor o igual', value: 'gte' },
        { label: 'Menor o igual', value: 'lte' },
      ]
    case 'date':
      return [
        { label: 'Igual a', value: 'equals' },
        { label: 'Antes de', value: 'before' },
        { label: 'Después de', value: 'after' },
      ]
    default:
      return []
  }
})

// Helper to get default operator
function getDefaultOperator(type: FilterType): string {
  switch (type) {
    case 'text':
      return 'contains'
    case 'number':
    case 'date':
      return 'equals'
    default:
      return 'contains'
  }
}

const internalValue = ref<unknown>(props.modelValue.value)
const internalOperator = ref<string>(props.modelValue.operator || getDefaultOperator(props.type))
const selectedOptions = ref<(string | number)[]>(
  Array.isArray(props.modelValue.value) ? [...props.modelValue.value] : [],
)

// Sync internal state when prop changes (e.g. from outside reset or apply)
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal.value
    internalOperator.value = newVal.operator || getDefaultOperator(props.type)
    selectedOptions.value = Array.isArray(newVal.value) ? [...newVal.value] : []
  },
  { deep: true },
)

const inputValue = computed(() => (internalValue.value ?? '') as string | number)

/* -------------------------------------------------------------------------- */
/*                                    LOGIC                                   */
/* -------------------------------------------------------------------------- */

function toggleOption(value: string | number) {
  const index = selectedOptions.value.indexOf(value)
  if (index === -1) {
    selectedOptions.value.push(value)
  } else {
    selectedOptions.value.splice(index, 1)
  }
}

function applyFilter() {
  let finalValue: unknown = internalValue.value

  if (props.type === 'select') {
    finalValue = [...selectedOptions.value]
  }

  emit('update:modelValue', {
    operator: internalOperator.value,
    value: finalValue,
  })
  emit('apply')
  emit('close')
}

function clearFilter() {
  internalValue.value = null
  selectedOptions.value = []
  emit('update:modelValue', { value: null })
  emit('clear')
  emit('close')
}
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 w-72 max-w-[calc(100vw-2rem)] p-4 flex flex-col gap-4 shadow-xl z-50 text-left rounded-alice-md"
    @click.stop
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-700"
    >
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Filtrar</span>
      <AliceButton
        variant="primary" design="ghost-subtle"
        size="icon-sm"
        :icon-size="16"
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        :icon="X"
      />
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-3">
      <!-- Operator Select (if applicable) -->
      <div v-if="type !== 'select'" class="flex flex-col gap-1">
        <AliceSelect
          label="Operador"
          :model-value="internalOperator"
          @update:model-value="(val) => (internalOperator = val as string)"
          :options="operators"
        />
      </div>

      <!-- Value Input -->

      <!-- Type: Text/Number -->
      <div v-if="['text', 'number'].includes(type)">
        <AliceInput
          id="filter-value"
          :model-value="inputValue"
          @update:model-value="(val: string | number) => (internalValue = val)"
          :type="type === 'number' ? 'number' : 'text'"
          placeholder="Valor..."
          class="w-full"
        />
      </div>

      <!-- Type: Date -->
      <div v-else-if="type === 'date'">
        <AliceDatePicker
          id="filter-date"
          :model-value="internalValue as string"
          @update:model-value="(val: string | null) => (internalValue = val)"
          placeholder="Seleccionar fecha"
        />
      </div>

      <!-- Type: Select -->
      <div
        v-else-if="type === 'select'"
        class="flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar p-1"
      >
        <div
          v-for="opt in options"
          :key="String(opt.value)"
          @click="toggleOption(opt.value)"
          class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          :class="{ 'bg-blue-50/50 dark:bg-blue-900/20': selectedOptions.includes(opt.value) }"
        >
          <AliceCheckbox
            :model-value="selectedOptions.includes(opt.value)"
            class="pointer-events-none"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ opt.label }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
      <AliceButton variant="ghost" size="sm" class="flex-1 text-xs" @click="clearFilter">
        Limpiar
      </AliceButton>
      <AliceButton variant="primary" size="sm" class="flex-1 text-xs" @click="applyFilter">
        Aplicar
      </AliceButton>
    </div>
  </div>
</template>
