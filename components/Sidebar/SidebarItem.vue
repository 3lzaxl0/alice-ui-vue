<script setup lang="ts">
import { computed, inject, ref, type Component } from 'vue'
import { sidebarItemVariants } from './Sidebar.variants'

defineOptions({ name: 'AliceSidebarItem' })

interface Props {
  icon?: Component | object
  label: string
  to?: string
  active?: boolean
  expanded?: boolean
  variant?: 'default' | 'error'
  design?: 'filled' | 'ghost' | 'outline'
  isButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  design: 'ghost',
  expanded: undefined,
  isButton: false,
})

const injectedExpanded = inject('alice-sidebar-expanded', { value: false })
const isExpanded = computed(() => props.expanded ?? injectedExpanded.value)

const emit = defineEmits<{ (e: 'click'): void }>()

const computedClass = computed(() =>
  sidebarItemVariants({ active: props.active, variant: props.variant, design: props.design })
)

// --- Flyout state ---
const itemEl = ref<HTMLElement | null>(null)
const showFlyout = ref(false)
const flyoutTop = ref(0)
const flyoutLeft = ref(0)
let hideTimer: ReturnType<typeof setTimeout> | null = null

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function handleItemEnter() {
  if (isExpanded.value) return
  clearHideTimer()
  const el = itemEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  flyoutTop.value = rect.top
  flyoutLeft.value = rect.left
  showFlyout.value = true
}

function handleItemLeave() {
  hideTimer = setTimeout(() => { showFlyout.value = false }, 80)
}

function handleFlyoutEnter() {
  clearHideTimer()
}

function handleFlyoutLeave() {
  hideTimer = setTimeout(() => { showFlyout.value = false }, 80)
}
</script>

<template>
  <!--
    Native <div> wrapper: guarantees mouseenter/mouseleave events fire reliably.
    Vue's <component :is="RouterLink"> does NOT propagate native mouse events.
    This div is invisible to layout (contents display).
  -->
  <div
    ref="itemEl"
    class="w-full"
    @mouseenter="handleItemEnter"
    @mouseleave="handleItemLeave"
  >
    <component
      :is="isButton ? 'button' : 'RouterLink'"
      :to="!isButton ? to : undefined"
      :class="computedClass"
      @click="isButton ? emit('click') : undefined"
    >
      <div class="flex items-center gap-2">
        <div class="shrink-0 flex items-center justify-center w-6 h-6">
          <component :is="icon" v-if="icon" :size="20" />
        </div>
        <span
          class="whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left"
          :class="isExpanded
            ? 'opacity-100 translate-x-0 w-auto'
            : 'opacity-0 -translate-x-4 w-0 overflow-hidden'"
        >
          {{ label }}
        </span>
      </div>
    </component>
  </div>

  <!-- Flyout: full expanded item floating over content, no animation -->
  <Teleport to="body">
    <div
      v-if="showFlyout && !isExpanded"
      class="fixed shadow-lg ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-slate-900 rounded-xl"
      :style="{
        top: `${flyoutTop}px`,
        left: `${flyoutLeft}px`,
        zIndex: 9999,
        width: 'max-content',
      }"
      @mouseenter="handleFlyoutEnter"
      @mouseleave="handleFlyoutLeave"
    >
      <component
        :is="isButton ? 'button' : 'RouterLink'"
        :to="!isButton ? to : undefined"
        :class="computedClass"
        class="w-full"
        @click="isButton ? (emit('click'), showFlyout = false) : (showFlyout = false)"
      >
        <div class="flex items-center gap-2">
          <div class="shrink-0 flex items-center justify-center w-6 h-6">
            <component :is="icon" v-if="icon" :size="20" />
          </div>
          <span class="whitespace-nowrap font-medium text-sm">{{ label }}</span>
        </div>
      </component>
    </div>
  </Teleport>
</template>

