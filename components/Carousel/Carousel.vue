<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AliceContainer from '../Container/Container.vue'

defineOptions({ name: 'AliceCarousel' })

const props = withDefaults(
  defineProps<{
    /** Currently selected item index (v-model) */
    modelValue?: number
    /** Minimum width of each item in px. Used in auto mode to fit as many as possible. */
    itemMinWidth?: number
    /** Gap between items */
    gap?: 'sm' | 'md' | 'lg'
    /** Show left/right navigation arrows */
    showArrows?: boolean
    /** Pass a background pattern (zero-class capability) */
    pattern?: 'none' | 'zebra' | 'dots'
    /** Pass a border style */
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
    /** Padding from the container */
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }>(),
  {
    modelValue: 0,
    itemMinWidth: 280,
    gap: 'md',
    showArrows: true,
    pattern: 'none',
    borderStyle: 'none',
    padding: 'md',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const trackRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// Drag scroll variables
const isDragging = ref(false)
let startX = 0
let scrollLeftPos = 0

const gapClass = computed(() => {
  const map = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' }
  return map[props.gap]
})

const gapPx = computed(() => {
  const map = { sm: 12, md: 16, lg: 24 }
  return map[props.gap]
})

function updateScrollState() {
  const el = trackRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 4
}

function scrollLeft() {
  const el = trackRef.value
  if (!el) return
  el.scrollBy({ left: -(props.itemMinWidth + gapPx.value), behavior: 'smooth' })
}

function scrollRight() {
  const el = trackRef.value
  if (!el) return
  el.scrollBy({ left: props.itemMinWidth + gapPx.value, behavior: 'smooth' })
}

function selectItem(index: number) {
  emit('update:modelValue', index)
}

// Mouse events for Desktop Drag to Scroll
function handleMouseDown(e: MouseEvent) {
  const el = trackRef.value
  if (!el) return
  isDragging.value = true
  el.style.scrollBehavior = 'auto' // Prevent laggy smooth snapping during drag
  el.style.cursor = 'grabbing'
  
  // To avoid selecting text inside the carousel when dragging
  window.getSelection()?.removeAllRanges()

  startX = e.pageX - el.offsetLeft
  scrollLeftPos = el.scrollLeft
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  const el = trackRef.value
  if (!el) return
  
  e.preventDefault() // Stop scrolling logic inside elements text selection
  const x = e.pageX - el.offsetLeft
  const walk = (x - startX) * 1.5 // multiplier for drag speed
  el.scrollLeft = scrollLeftPos - walk
  updateScrollState()
}

function handleMouseUpOrLeave() {
  const el = trackRef.value
  if (!el) return
  if (isDragging.value) {
    isDragging.value = false
    el.style.scrollBehavior = 'smooth'
    el.style.cursor = 'grab'
    updateScrollState()
  }
}

// ResizeObserver to recalculate scroll state on resize
let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  updateScrollState()
  resizeObserver = new ResizeObserver(() => updateScrollState())
  if (trackRef.value) resizeObserver.observe(trackRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <AliceContainer
    class="relative w-full group/carousel select-none"
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    :pattern="pattern"
    :border-style="borderStyle"
    :border-variant="borderStyle === 'none' ? 'none' : 'default'"
    :padding="padding"
    shadow="none"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUpOrLeave"
    @mouseleave="handleMouseUpOrLeave"
  >
    <!-- Left Arrow -->
    <button
      v-show="showArrows && canScrollLeft"
      class="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20
             w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-alice-sm border border-gray-200 dark:border-slate-700
             flex items-center justify-center text-gray-600 dark:text-gray-300
             hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200"
      @click.stop="scrollLeft"
      aria-label="Desplazar a la izquierda"
    >
      <ChevronLeft :size="16" />
    </button>

    <!-- Scroll Track -->
    <div
      ref="trackRef"
      class="flex overflow-x-auto scrollbar-hide"
      :class="gapClass"
      style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scroll-behavior: smooth;"
      @scroll="updateScrollState"
    >
      <slot :select-item="selectItem" :selected="modelValue" />
    </div>

    <!-- Right Arrow -->
    <button
      v-show="showArrows && canScrollRight"
      class="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20
             w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-alice-sm border border-gray-200 dark:border-slate-700
             flex items-center justify-center text-gray-600 dark:text-gray-300
             hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200"
      @click.stop="scrollRight"
      aria-label="Desplazar a la derecha"
    >
      <ChevronRight :size="16" />
    </button>
  </AliceContainer>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* Ensure child items don't inherit selection handling during drag */
.scrollbar-hide > :deep(*) {
  user-select: none;
  pointer-events: auto;
}
</style>
