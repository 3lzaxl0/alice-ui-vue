<script setup lang="ts">
import { computed } from 'vue'
import AliceDrawer from './Drawer.vue'

defineOptions({
  name: 'AliceFormDrawer',
})

const props = withDefaults(
  defineProps<{
    /** Visibilidad del drawer (v-model:show) */
    show: boolean
    /** Título del encabezado */
    title: string
    /** Etiqueta del botón de confirmación */
    confirmLabel?: string
    /** Variante de color para el botón de confirmación */
    confirmVariant?: 'primary' | 'success' | 'error' | 'warning' | 'info'
    /** Estado de carga del envío del formulario */
    loading?: boolean
    /** Ancho del drawer */
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    /** Si se debe mostrar el botón de cancelar */
    showCancel?: boolean
    /** Etiqueta del botón de cancelar */
    cancelLabel?: string
  }>(),
  {
    confirmLabel: 'Guardar',
    confirmVariant: 'primary',
    loading: false,
    width: 'md',
    showCancel: true,
    cancelLabel: 'Cancelar',
  }
)

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const widthClass = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full',
  }
  return map[props.width] || map.md
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  emit('update:show', false)
}
</script>

<template>
  <AliceDrawer
    :show="show"
    @update:show="emit('update:show', $event)"
    :title="title"
    :confirm-label="confirmLabel"
    :confirm-variant="confirmVariant"
    :loading="loading"
    :width="widthClass"
    :show-cancel="showCancel"
    :cancel-label="cancelLabel"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="flex flex-col gap-6">
      <!-- Slot principal para los campos del formulario -->
      <slot />
    </div>

    <!-- Slot opcional para contenido al final del drawer (fuera del scroll del form si se desea,
         aunque AliceDrawer ya tiene su propio footer fijo) -->
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </AliceDrawer>
</template>
