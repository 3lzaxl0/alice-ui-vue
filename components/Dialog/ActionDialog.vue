<script setup lang="ts">
import { ref, watch, type Component } from 'vue'
import AliceDialog from './Dialog.vue'
import AliceInput from '../Input/Input.vue'

defineOptions({
  name: 'AliceActionDialog',
})

const props = withDefaults(
  defineProps<{
    /** Visibilidad del diálogo (v-model:show) */
    show: boolean
    /** Título principal del diálogo */
    title: string
    /** Descripción opcional que aparece bajo el título */
    description?: string
    /** Texto del botón de confirmación */
    confirmLabel?: string
    /** Color/Variante del botón de confirmación */
    confirmVariant?: 'primary' | 'success' | 'error' | 'warning' | 'info'
    /** Estado de carga del proceso */
    loading?: boolean
    /** Placeholder para el campo de observación */
    placeholder?: string
    /** Etiqueta para el campo de observación */
    label?: string
    /** Si el campo de observación es obligatorio para confirmar */
    required?: boolean
    /** Cantidad máxima de caracteres permitidos */
    maxlength?: number
    /** Icono opcional para el encabezado del diálogo */
    icon?: Component
  }>(),
  {
    confirmLabel: 'Confirmar',
    confirmVariant: 'primary',
    loading: false,
    placeholder: 'Escriba una observación...',
    label: 'Observación',
    required: true,
    maxlength: 200,
  }
)

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'confirm', value: string): void
}>()

const value = ref('')
const errorMessage = ref('')
const inputId = `action-dialog-${Math.random().toString(36).slice(2, 9)}`

// Limpiar el valor cuando se abre el diálogo
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      value.value = ''
      errorMessage.value = ''
    }
  }
)

function handleConfirm() {
  if (props.required && !value.value.trim()) {
    errorMessage.value = 'Este campo es obligatorio para continuar.'
    return
  }
  emit('confirm', value.value)
}
</script>

<template>
  <AliceDialog
    :show="show"
    @update:show="emit('update:show', $event)"
    :title="title"
    :description="description"
    :confirm-label="confirmLabel"
    :confirm-variant="confirmVariant"
    :loading="loading"
    @confirm="handleConfirm"
  >
    <!-- Slot para descripción rica (opcional, sobrescribe la prop description) -->
    <template #description v-if="$slots.description">
      <slot name="description" />
    </template>

    <div class="flex flex-col gap-5 pt-2">
      <!-- Slot para contenido adicional (opcional) -->
      <slot />

      <!-- Campo de Observación Integrado -->
      <AliceInput
        :id="inputId"
        v-model="value"
        :label="label"
        :placeholder="placeholder"
        :maxlength="maxlength"
        show-counter
        :required="required"
        :error-message="errorMessage"
        @update:model-value="errorMessage = ''"
      />
    </div>
  </AliceDialog>
</template>
