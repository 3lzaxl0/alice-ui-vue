<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Eye } from 'lucide-vue-next'
import AliceButton from '../Button/Button.vue'

defineOptions({ name: 'TableCellText' })

const props = defineProps<{
  text: string
  header: string
}>()

const emit = defineEmits<{
  (e: 'expand', title: string, content: string): void
}>()

const spanRef = ref<HTMLElement | null>(null)
const isTruncated = ref(false)

function checkTruncation() {
  const el = spanRef.value
  if (!el) return
  // scrollWidth > clientWidth means the text overflows the container
  isTruncated.value = el.scrollWidth > el.clientWidth
}

// Double-RAF: first frame = style applied, second frame = layout committed + painted
function checkTruncationDeferred() {
  requestAnimationFrame(() => {
    requestAnimationFrame(checkTruncation)
  })
}

let ro: ResizeObserver | null = null

onMounted(() => {
  // Defer initial check so table-layout:fixed has committed column widths
  checkTruncationDeferred()
  if (spanRef.value?.parentElement) {
    ro = new ResizeObserver(checkTruncation)
    ro.observe(spanRef.value.parentElement)
  }
})

onUnmounted(() => ro?.disconnect())

watch(() => props.text, checkTruncationDeferred)
</script>

<template>
  <div class="flex items-center w-full min-w-0 group/cell-text">
    <!-- Text: always truncates via CSS -->
    <span
      ref="spanRef"
      class="block truncate text-sm text-slate-800 dark:text-white flex-1 min-w-0 leading-5"
      :title="isTruncated ? text : undefined"
    >
      {{ text }}
    </span>

    <!-- "Ver más" — shown on hover only when text overflows -->
    <AliceButton
      v-if="isTruncated"
      variant="primary"
      design="ghost-subtle"
      size="sm"
      :icon="Eye"
      :icon-size="11"
      @click.stop="emit('expand', header, text)"
    >
      Ver más
    </AliceButton>
  </div>
</template>
