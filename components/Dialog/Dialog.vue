<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import AliceButton from '../../components/Button/Button.vue'

interface Props {
  show: boolean
  title: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  loading?: boolean
  maxWidth?: string
  width?: string
  overflowVisible?: boolean
  hideFooter?: boolean
  preventClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Aceptar',
  cancelLabel: 'Cancelar',
  confirmVariant: 'primary',
  loading: false,
  maxWidth: 'max-w-md',
  overflowVisible: false,
  hideFooter: false,
  preventClose: false,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

defineOptions({
  name: 'AliceDialog',
  inheritAttrs: false,
})

function close() {
  if (props.loading) return
  emit('update:show', false)
  emit('cancel')
}

function handleBackdropClick() {
  if (props.preventClose) return
  close()
}

function onConfirm() {
  emit('confirm')
}

// Handle Escape key
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    if (props.preventClose) return
    close()
  }
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
  <Teleport to="body">
    <Transition name="alice-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-alice-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <Transition appear name="alice-modal">
          <div
            class="bg-white dark:bg-slate-900 w-full shadow-2xl relative flex flex-col rounded-alice-md transition-all duration-300 ease-in-out"
            :class="[width || maxWidth, overflowVisible ? 'overflow-visible' : 'overflow-hidden']"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700"
            >
              <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-none">
                {{ title }}
              </h3>
              <button
                v-if="!preventClose"
                @click="close"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X :size="20" />
              </button>
            </div>

            <!-- Content Area -->
            <div
              class="px-6 py-6 max-h-[70vh]"
              :class="[overflowVisible ? 'overflow-visible' : 'overflow-y-auto']"
            >
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="!hideFooter"
              class="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center justify-end gap-3"
            >
              <slot name="footer">
                <AliceButton variant="ghost" @click="close" :disabled="loading">
                  {{ cancelLabel }}
                </AliceButton>
                <AliceButton :variant="confirmVariant" @click="onConfirm" :loading="loading">
                  {{ confirmLabel }}
                </AliceButton>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
