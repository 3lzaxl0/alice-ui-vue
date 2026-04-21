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
  size?: 'default' | 'fullscreen'
  padding?: 'default' | 'compact' | 'none'
  overflowVisible?: boolean
  hideFooter?: boolean
  preventClose?: boolean
  closeOnBackdropClick?: boolean
  description?: string
  bodyClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Aceptar',
  cancelLabel: 'Cancelar',
  confirmVariant: 'primary',
  loading: false,
  maxWidth: 'max-w-2xl',
  size: 'default',
  padding: 'default',
  overflowVisible: false,
  hideFooter: false,
  preventClose: false,
  closeOnBackdropClick: false,
  bodyClass: 'flex flex-col gap-6',
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
  if (props.preventClose || !props.closeOnBackdropClick) return
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

import { computed } from 'vue'

const contentPadding = computed(() => {
  if (props.padding === 'none') return 'p-0'
  if (props.padding === 'compact') return 'p-4'
  return 'px-6 py-6'
})

const headerFooterPadding = computed(() => {
  if (props.padding === 'compact') return 'px-4 py-3'
  return 'px-6 py-4'
})
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
            class="bg-white dark:bg-slate-900 shadow-2xl relative flex flex-col transition-all duration-300 ease-in-out w-full rounded-alice-md"
            :class="[
              size === 'fullscreen' ? 'h-full max-w-none' : [width || maxWidth],
              overflowVisible ? 'overflow-visible' : 'overflow-hidden'
            ]"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between border-b border-gray-100 dark:border-slate-700"
              :class="headerFooterPadding"
            >
              <div class="flex flex-col gap-1.5 pr-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-none">
                  {{ title }}
                </h3>
                <div 
                  v-if="$slots.description || description" 
                  class="text-sm text-gray-600 dark:text-gray-400 [&_strong]:font-bold [&_strong]:text-gray-900 dark:[&_strong]:text-white"
                >
                  <slot name="description">
                    {{ description }}
                  </slot>
                </div>
              </div>
              <AliceButton
                v-if="!preventClose"
                @click="close"
                variant="error"
                design="ghost-subtle"
                radius="full"
                size="icon"
                :icon="X"
              />
            </div>

            <!-- Content Area -->
            <div
              :class="[
                size === 'fullscreen' ? 'flex-1 min-h-0' : 'max-h-[70vh]',
                overflowVisible ? 'overflow-visible' : 'overflow-y-auto w-full custom-scrollbar',
                contentPadding,
                bodyClass
              ]"
            >
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="!hideFooter"
              class="border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center justify-end gap-3"
              :class="headerFooterPadding"
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
