<script setup lang="ts">
import { useContextMenu } from './useContextMenu'
import type { Component } from 'vue'

export interface ContextMenuOption {
  label: string
  value: string | number
  icon?: Component
}

defineOptions({
  name: 'AliceContextMenu',
})

withDefaults(
  defineProps<{
    options: ContextMenuOption[]
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'select', value: string | number): void
}>()

const { isOpen, x, y, menuRef, handleContextMenu, closeMenu } = useContextMenu()

const selectOption = (option: ContextMenuOption) => {
  emit('select', option.value)
  closeMenu()
}
</script>

<template>
  <div @contextmenu.prevent.stop="handleContextMenu" class="block w-full h-full">
    <slot></slot>
    <Teleport to="body">
      <transition name="alice-pop">
        <div
          v-if="isOpen"
          ref="menuRef"
          class="fixed bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden py-1 rounded-alice-md min-w-48"
          :style="{ top: `${y}px`, left: `${x}px`, zIndex: 999999 }"
        >
          <div
            v-for="option in options"
            :key="option.value"
            @click.stop="selectOption(option)"
            class="px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <component v-if="option.icon" :is="option.icon" :size="16" class="shrink-0 text-gray-400 dark:text-gray-500" />
            <span class="truncate">{{ option.label }}</span>
          </div>

          <slot name="empty" v-if="options.length === 0">
            <div class="px-4 py-3 text-sm text-gray-400 text-center italic">
              Sin opciones
            </div>
          </slot>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
