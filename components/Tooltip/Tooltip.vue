<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
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
  top: '-translate-x-1/2 -translate-y-[calc(100%+8px)] origin-bottom',
  bottom: '-translate-x-1/2 translate-y-[8px] origin-top',
  left: '-translate-y-1/2 -translate-x-[calc(100%+8px)] origin-right',
  right: '-translate-y-1/2 translate-x-[8px] origin-left',
}

function updatePosition() {
  if (!triggerRef.value || !isOpen.value) return

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

async function handleHover(val: boolean) {
  isOpen.value = val
  if (val) {
    updatePosition()
    await nextTick()
    updatePosition()
  }
}

onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>

<template>
  <div
    ref="triggerRef"
    class="inline-block"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <slot />

    <Teleport to="body">
      <Transition name="alice-pop">
        <div
          v-if="isOpen && content"
          ref="tooltipRef"
          class="fixed z-9999 pointer-events-none flex"
          :style="tooltipStyle"
        >
          <div
            class="bg-gray-900/90 dark:bg-slate-800 text-white shadow-lg rounded-alice-sm px-2.5 py-1.5 text-[11px] leading-relaxed font-normal pointer-events-none text-center"
            :class="positionMap[position || 'top']"
            :style="{ maxWidth: maxWidth || '280px' }"
          >
            {{ content }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fixed {
  will-change: transform, opacity;
}
</style>
