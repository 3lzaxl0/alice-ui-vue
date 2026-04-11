<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Eraser } from 'lucide-vue-next'
import AliceLabel from '../Label/Label.vue'

defineOptions({
  name: 'AliceSignature',
})

const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    penColor?: string
    backgroundColor?: string
    guideLine?: boolean
    label?: string
  }>(),
  {
    width: 600,
    height: 200,
    penColor: '#0f172a', // slate-900
    backgroundColor: '#ffffff',
    guideLine: true,
  },
)

interface Point {
  x: number
  y: number
  time: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isEmpty = ref(true)

// Advanced Drawing State
const points = ref<Point[]>([])
const strokeWidth = ref(2.5)
const MIN_WIDTH = 1.0
const MAX_WIDTH = 4.0

function resizeCanvas() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  // Set physical resolution
  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr

  // Set display size via CSS handled by classes, but we ensure context is scaled
  if (ctx.value) {
    ctx.value.scale(dpr, dpr)
  }

  initContext()
  if (isEmpty.value) drawGuideLine()
}

function initContext() {
  if (!canvas.value) return
  const dpr = window.devicePixelRatio || 1
  ctx.value = canvas.value.getContext('2d', { desynchronized: true })
  if (ctx.value) {
    ctx.value.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.value.strokeStyle = props.penColor
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'
  }
}

function drawGuideLine() {
  if (!ctx.value || !canvas.value || !props.guideLine) return
  const rect = canvas.value.getBoundingClientRect()
  const middleY = rect.height * 0.75

  ctx.value.save()
  ctx.value.setLineDash([5, 5])
  ctx.value.strokeStyle = '#e2e8f0' // slate-200
  ctx.value.lineWidth = 1
  ctx.value.beginPath()
  ctx.value.moveTo(20, middleY)
  ctx.value.lineTo(rect.width - 20, middleY)
  ctx.value.stroke()
  ctx.value.restore()
}

function getEventPos(event: MouseEvent | TouchEvent): Point {
  if (!canvas.value) return { x: 0, y: 0, time: Date.now() }
  const rect = canvas.value.getBoundingClientRect()

  let clientX, clientY

  if (window.TouchEvent && event instanceof TouchEvent) {
    const touch = event.touches[0] || event.changedTouches[0]
    if (!touch) return { x: 0, y: 0, time: Date.now() }
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    clientX = (event as MouseEvent).clientX
    clientY = (event as MouseEvent).clientY
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
    time: Date.now(),
  }
}

function startDrawing(event: MouseEvent | TouchEvent) {
  event.preventDefault()
  isDrawing.value = true
  const point = getEventPos(event)
  points.value = [point]

  if (isEmpty.value) {
    const rect = canvas.value?.getBoundingClientRect()
    if (rect && ctx.value) {
      ctx.value.clearRect(0, 0, rect.width, rect.height)
    }
    isEmpty.value = false
  }

  if (ctx.value) {
    ctx.value.beginPath()
    ctx.value.moveTo(point.x, point.y)
  }
}

function draw(event: MouseEvent | TouchEvent) {
  if (!isDrawing.value || !ctx.value) return
  event.preventDefault()

  const newPoint = getEventPos(event)
  const lastPoint = points.value[points.value.length - 1]

  // Calculate velocity for variable width
  if (lastPoint) {
    const dist = Math.sqrt(
      Math.pow(newPoint.x - lastPoint.x, 2) + Math.pow(newPoint.y - lastPoint.y, 2),
    )
    const time = newPoint.time - lastPoint.time
    const velocity = dist / (time || 1)

    // Invert velocity: faster = thinner (typical ink behavior)
    const targetWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, MAX_WIDTH - velocity * 1.5))
    // Smooth width transition
    strokeWidth.value = strokeWidth.value * 0.7 + targetWidth * 0.3
  }

  points.value.push(newPoint)

  if (points.value.length > 2) {
    const p1 = points.value[points.value.length - 3]
    const p2 = points.value[points.value.length - 2]
    const p3 = points.value[points.value.length - 1]

    if (!p1 || !p2 || !p3) return

    // Quadratic curve midpoint
    const midPointX = (p2.x + p3.x) / 2
    const midPointY = (p2.y + p3.y) / 2

    ctx.value.lineWidth = strokeWidth.value
    ctx.value.beginPath()
    ctx.value.moveTo(p1.x, p1.y) // Approximated, ideally move to mid and curve to mid
    ctx.value.quadraticCurveTo(p2.x, p2.y, midPointX, midPointY)
    ctx.value.stroke()
  }
}

function stopDrawing() {
  if (!isDrawing.value || !ctx.value) return

  // Support for dots (taps without movement)
  if (points.value.length === 1) {
    const p = points.value[0]
    if (p) {
      ctx.value.lineWidth = 0 // use fill
      ctx.value.fillStyle = props.penColor
      ctx.value.beginPath()
      ctx.value.arc(p.x, p.y, strokeWidth.value, 0, Math.PI * 2)
      ctx.value.fill()
    }
  }

  isDrawing.value = false
  points.value = []
}

function clear() {
  if (!canvas.value || !ctx.value) return
  const rect = canvas.value.getBoundingClientRect()
  ctx.value.clearRect(0, 0, rect.width, rect.height)
  isEmpty.value = true
  strokeWidth.value = 2.5
  drawGuideLine()
}

function getSignatureImage(): string | null {
  if (isEmpty.value || !canvas.value) return null
  return canvas.value.toDataURL('image/png')
}

defineExpose({ clear, getSignatureImage, isEmpty })

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Header with label and clear button -->
    <div class="flex items-center justify-between px-1">
      <AliceLabel v-if="label">
        {{ label }}
      </AliceLabel>
      <button
        type="button"
        @click="clear"
        class="text-[10px] font-bold text-error-600 uppercase tracking-tighter flex items-center gap-1 py-1.5 px-3 rounded-full bg-error-50 dark:bg-error-900/20 border border-error-100 dark:border-error-800/50 hover:bg-error-100 dark:hover:bg-error-900/30 transition-all touch-manipulation"
        :class="{ 'ml-auto': !label, 'opacity-50 pointer-events-none grayscale': isEmpty }"
      >
        <Eraser :size="12" />
        Limpiar Firma
      </button>
    </div>

    <!-- Canvas Container (Forced white background for visibility) -->
    <div
      class="relative w-full h-40 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white transition-all shadow-md ring-primary-500/10 focus-within:ring-4 focus-within:border-primary-400"
    >
      <canvas
        ref="canvas"
        class="w-full h-full cursor-crosshair touch-none"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.passive="startDrawing"
        @touchmove.passive="draw"
        @touchend.passive="stopDrawing"
      ></canvas>

      <!-- UI Overlay -->
      <div
        v-if="isEmpty"
        class="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 pointer-events-none select-none"
      >
        <span
          class="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/60 px-2 py-1 rounded"
        >
          Firma aquí
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth transitions for the container */
div {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
