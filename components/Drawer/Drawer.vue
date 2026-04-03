<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import AliceButton from '../Button/Button.vue'

interface Props {
  show: boolean
  title: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  loading?: boolean
  width?: string
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Guardar',
  cancelLabel: 'Cancelar',
  confirmVariant: 'primary',
  loading: false,
  width: 'max-w-md',
  showCancel: true,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

defineOptions({
  name: 'AliceDrawer',
})

function close() {
  if (props.loading) return
  emit('update:show', false)
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) close()
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="alice-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-alice-modal bg-slate-900/40 backdrop-blur-[2px]"
        @click.self="close"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="alice-drawer">
      <div
        v-if="show"
        class="fixed inset-y-0 right-0 z-alice-modal flex flex-col bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-white/10 shadow-2xl w-full"
        :class="width"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 shrink-0"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-none">
            {{ title }}
          </h3>
          <button
            @click="close"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
          <slot />
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center justify-end gap-3 shrink-0"
        >
          <slot name="footer">
            <AliceButton v-if="showCancel" variant="ghost" @click="close" :disabled="loading">
              {{ cancelLabel }}
            </AliceButton>
            <AliceButton :variant="confirmVariant" @click="onConfirm" :loading="loading">
              {{ confirmLabel }}
            </AliceButton>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Drawer slide-in animation */
.alice-drawer-enter-active,
.alice-drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.alice-drawer-enter-from,
.alice-drawer-leave-to {
  transform: translateX(100%);
}
</style>
