<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  maxWidth?: string
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const tooltipStyle = ref({ top: '0px', left: '0px' })

defineOptions({
  name: 'AliceTooltip',
})

const positionMap = {
  top: 'translate-x-[-50%] translate-y-[-100%] mb-2 origin-bottom',
  bottom: 'translate-x-[-50%] mt-2 origin-top',
  left: 'translate-y-[-50%] translate-x-[-100%] mr-2 origin-right',
  right: 'translate-y-[-50%] ml-2 origin-left',
}

function updatePosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()

  let top = 0
  let left = 0

  switch (props.position || 'top') {
    case 'top':
      top = rect.top
      left = rect.left + rect.width / 2
      break
    case 'bottom':
      top = rect.bottom
      left = rect.left + rect.width / 2
      break
    case 'left':
      top = rect.top + rect.height / 2
      left = rect.left
      break
    case 'right':
      top = rect.top + rect.height / 2
      left = rect.right
      break
  }

  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

async function toggle(val?: boolean) {
  const nextState = val === undefined ? !isOpen.value : val

  if (nextState) {
    // Calculate position BEFORE showing to avoid "jump" from (0,0)
    updatePosition()
    isOpen.value = true
    // Re-calculate after next tick to ensure absolute precision if needed
    await nextTick()
    updatePosition()
  } else {
    isOpen.value = false
  }
}

function handleHover(val: boolean) {
  if (props.trigger === 'click') return
  toggle(val)
}

function handleClick() {
  if (props.trigger === 'hover') return
  toggle()
}

// Close when clicking outside
function handleOutsideClick(e: MouseEvent) {
  if (
    isOpen.value &&
    !triggerRef.value?.contains(e.target as Node) &&
    !tooltipRef.value?.contains(e.target as Node)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <div
    ref="triggerRef"
    class="inline-block"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
    @click="handleClick"
  >
    <slot name="trigger" :is-open="isOpen" :toggle="toggle" />

    <Teleport to="body">
      <Transition name="alice-pop">
        <div
          v-if="isOpen"
          ref="tooltipRef"
          class="fixed z-9999 pointer-events-none w-0 h-0"
          :style="tooltipStyle"
        >
          <div
            class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-alice-panel rounded-alice-md p-3 text-sm text-gray-700 dark:text-gray-200 pointer-events-auto w-max"
            :class="positionMap[position || 'top']"
            :style="{ maxWidth: maxWidth || '280px' }"
          >
            <slot :close="() => toggle(false)" />
            <div v-if="content">{{ content }}</div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Ensure no clipping */
.fixed {
  will-change: transform, opacity;
}
</style>
