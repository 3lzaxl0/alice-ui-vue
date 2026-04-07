<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

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
  }>(),
  {
    modelValue: 0,
    itemMinWidth: 280,
    gap: 'md',
    showArrows: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const trackRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

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
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
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
  <div class="relative w-full group/carousel border-2 border-dashed border-gray-200 dark:border-white/10 bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_15px,transparent_15px,transparent_30px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_15px,transparent_15px,transparent_30px)] rounded-alice-lg p-2 md:p-3">
    
    <!-- Left Arrow -->
    <button
      v-if="showArrows && canScrollLeft"
      class="absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 z-20
             w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-alice-sm border border-gray-200 dark:border-slate-700
             flex items-center justify-center text-gray-600 dark:text-gray-300
             hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200
             opacity-90 md:opacity-0 md:group-hover/carousel:opacity-100"
      @click.stop="scrollLeft"
      aria-label="Desplazar a la izquierda"
    >
      <ChevronLeft :size="16" />
    </button>

    <!-- Scroll Track -->
    <div
      ref="trackRef"
      class="flex overflow-x-auto scroll-smooth scrollbar-hide"
      :class="gapClass"
      style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
      @scroll="updateScrollState"
    >
      <!-- Each child will be a carousel item -->
      <slot :select-item="selectItem" :selected="modelValue" />
    </div>

    <!-- Right Arrow -->
    <button
      v-if="showArrows && canScrollRight"
      class="absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 z-20
             w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-alice-sm border border-gray-200 dark:border-slate-700
             flex items-center justify-center text-gray-600 dark:text-gray-300
             hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200
             opacity-90 md:opacity-0 md:group-hover/carousel:opacity-100"
      @click.stop="scrollRight"
      aria-label="Desplazar a la derecha"
    >
      <ChevronRight :size="16" />
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
