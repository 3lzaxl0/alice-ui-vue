<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

type Placement = 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center'

const props = withDefaults(
  defineProps<{
    placement?: Placement
    closeOnClick?: boolean
    modelValue?: boolean
    mobileFullscreen?: boolean
    teleport?: boolean
    to?: string
    offset?: number
    autoPlacement?: boolean
    contentClass?: string | string[] | Record<string, boolean>
    contentStyle?: Record<string, string | number> | string
    triggerClass?: string | string[] | Record<string, boolean>
  }>(),
  {
    placement: 'bottom-right',
    closeOnClick: true,
    modelValue: undefined,
    mobileFullscreen: false,
    teleport: true,
    to: 'body',
    offset: 8,
    autoPlacement: true,
    contentClass: '',
    contentStyle: () => ({}),
    triggerClass: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const internalOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const calculatedStyle = ref<Record<string, string>>({})
const dynamicPlacement = ref<Placement>(props.placement)
let resizeObserver: ResizeObserver | null = null

defineOptions({
  name: 'AlicePopover',
})

const isOpen = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalOpen.value),
  set: (val: boolean) => {
    internalOpen.value = val
    emit('update:modelValue', val)
  },
})

const reposition = () => {
  if (!isOpen.value || !containerRef.value || !props.teleport) return

  const triggerRect = containerRef.value.getBoundingClientRect()
  const popoverWidth = contentRef.value?.offsetWidth || 0
  const popoverHeight = contentRef.value?.offsetHeight || 0
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let placement = props.placement
  let top = 0
  let left = 0

  // Smart Flipping Logic
  if (props.autoPlacement) {
    // Horizontal check
    if (placement.endsWith('-right')) {
      if (triggerRect.right - popoverWidth < 0) {
        placement = placement.replace('-right', '-left') as Placement
      }
    } else if (placement.endsWith('-left')) {
      if (triggerRect.left + popoverWidth > viewportWidth) {
        placement = placement.replace('-left', '-right') as Placement
      }
    }

    // Vertical check
    if (placement.startsWith('bottom')) {
      if (triggerRect.bottom + popoverHeight + props.offset > viewportHeight) {
        placement = placement.replace('bottom', 'top') as Placement
      }
    } else if (placement.startsWith('top')) {
      if (triggerRect.top - popoverHeight - props.offset < 0) {
        placement = placement.replace('top', 'bottom') as Placement
      }
    }
  }

  dynamicPlacement.value = placement

  // Positioning Calculation
  if (placement.startsWith('bottom')) {
    top = triggerRect.bottom + props.offset
  } else {
    top = triggerRect.top - popoverHeight - props.offset
  }

  if (placement.endsWith('-left')) {
    left = triggerRect.left
  } else if (placement.endsWith('-right')) {
    left = triggerRect.right - popoverWidth
  } else {
    // center
    left = triggerRect.left + triggerRect.width / 2 - popoverWidth / 2
  }

  // Clamping to screen
  left = Math.max(10, Math.min(left, viewportWidth - popoverWidth - 10))
  top = Math.max(10, Math.min(top, viewportHeight - popoverHeight - 10))

  calculatedStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    maxHeight: `${viewportHeight - 20}px`,
    display: 'flex',
    flexDirection: 'column'
  }
}

const stopObserving = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

const startObserving = () => {
  stopObserving()
  if (!contentRef.value) return
  resizeObserver = new ResizeObserver(() => {
    reposition()
  })
  resizeObserver.observe(contentRef.value)
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const isOutsideTrigger = containerRef.value && !containerRef.value.contains(target)
  const isOutsideContent = contentRef.value && !contentRef.value.contains(target)

  // Check if the click was on a teleported element that should not close this popover
  // For example, another popover or a select dropdown list
  const isInsideOtherPopover = target.closest('.z-alice-popover')
  const isInsideSelectDropdown = target.closest('[role="listbox"]')

  if (isOutsideTrigger && isOutsideContent && !isInsideOtherPopover && !isInsideSelectDropdown) {
    close()
  }
}

watch(isOpen, (val: boolean) => {
  if (val) {
    setTimeout(() => {
      reposition()
      startObserving()
    }, 0)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
  } else {
    stopObserving()
    window.removeEventListener('scroll', reposition, true)
    window.removeEventListener('resize', reposition)
  }
})

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside, true)
})

onUnmounted(() => {
  stopObserving()
  document.removeEventListener('mousedown', handleClickOutside, true)
  window.removeEventListener('scroll', reposition, true)
  window.removeEventListener('resize', reposition)
})

defineExpose({
  close,
  open: () => (isOpen.value = true),
  toggle,
  reposition
})
</script>

<template>
  <div ref="containerRef" class="relative inline-block text-left" :class="triggerClass">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger" :open="isOpen" />
    </div>

    <Teleport :to="to" :disabled="!teleport">
      <!-- Positioning Wrapper -->
      <div v-show="isOpen" class="z-alice-popover" :class="[!teleport ? 'absolute mt-2' : 'fixed']" :style="[contentStyle, calculatedStyle]">
        <!-- Animation & Visual Shell -->
        <transition name="alice-pop">
          <div v-if="isOpen" ref="contentRef" class="focus:outline-none" :class="[
            !teleport && placement === 'bottom-right' ? 'right-0 origin-top-right' : '',
            !teleport && placement === 'bottom-left' ? 'left-0 origin-top-left' : '',
            teleport && dynamicPlacement.startsWith('top') ? 'origin-bottom' : '',
            teleport && dynamicPlacement.startsWith('bottom') ? 'origin-top' : '',
            teleport && dynamicPlacement.endsWith('-left') ? 'origin-left' : '',
            teleport && dynamicPlacement.endsWith('-right') ? 'origin-right' : '',
            mobileFullscreen
              ? 'max-md:fixed max-md:inset-0 max-md:mt-0 max-md:w-full max-md:h-full max-md:bg-black/50 max-md:z-alice-modal max-md:flex max-md:items-end max-md:justify-center'
              : '',
            contentClass,
          ]" @click.self="mobileFullscreen ? close() : undefined">
            <div @click="closeOnClick ? close() : undefined"
              class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-alice-panel rounded-alice-md flex flex-col overflow-hidden"
              :class="mobileFullscreen
                ? 'max-md:w-full max-md:rounded-b-none max-md:rounded-t-xl max-md:animate-slide-up max-md:border-b-0 max-md:border-l-0 max-md:border-r-0'
                : ''
              ">
              <div class="overflow-y-auto w-full">
                <slot :close="close" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </Teleport>
  </div>
</template>
