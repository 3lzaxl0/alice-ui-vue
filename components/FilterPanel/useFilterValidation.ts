import { inject, onMounted, onUnmounted, type InjectionKey, computed } from 'vue'

export interface ValidationResult {
  valid: boolean
  name: string
}

export type ValidatorFn = () => ValidationResult

export interface FilterPanelContext {
  registerValidator: (id: string, validator: ValidatorFn) => void
  unregisterValidator: (id: string) => void
}

export const FilterPanelKey: InjectionKey<FilterPanelContext> = Symbol('FilterPanelKey')

export function useFilterValidation(props: {
  id?: string
  required?: boolean
  label?: string
  modelValue: unknown
}) {
  const context = inject(FilterPanelKey, null)

  const validator: ValidatorFn = () => {
    if (!props.required) return { valid: true, name: props.label || 'Campo' }

    let isValid = false
    const val = props.modelValue

    if (val === null || val === undefined || val === '') {
      isValid = false
    } else if (Array.isArray(val)) {
      // For MultiSelect, DateRange, etc. Arrays must have at least one defined element
      isValid = val.length > 0 && val.some((v) => v !== null && v !== undefined && v !== '')
    } else {
      isValid = true
    }

    return { valid: isValid, name: props.label || 'Campo Requerido' }
  }

  onMounted(() => {
    if (context && props.required && props.id) {
      context.registerValidator(props.id, validator)
    }
  })

  onUnmounted(() => {
    if (context && props.id) {
      context.unregisterValidator(props.id)
    }
  })

  return {
    isInsideFilterPanel: computed(() => !!context),
  }
}
