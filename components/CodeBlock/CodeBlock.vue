<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { useClipboard } from '../../composables/useClipboard'
import AliceButton from '../Button/Button.vue'

defineOptions({ name: 'AliceCodeBlock' })

const props = withDefaults(
  defineProps<{
    code: string
    filename?: string
    language?: string
  }>(),
  {
    filename: 'code.vue',
    language: 'vue',
  }
)

const { copyToClipboard } = useClipboard()
const showCopiedIndicator = ref(false)

async function handleCopy() {
  if (showCopiedIndicator.value) return
  const success = await copyToClipboard(props.code, 'Código copiado exitosamente')
  if (success) {
    showCopiedIndicator.value = true
    setTimeout(() => {
      showCopiedIndicator.value = false
    }, 2000)
  }
}

// Light & robust Regex-based HTML/Vue/JS syntax highlighter
function highlightCode(rawCode: string): string {
  let escaped = rawCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 1. Comments
  escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-slate-500 italic">$1</span>')
  escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-slate-500 italic">$1</span>')

  // 2. Process complete tags to isolate tag names, attributes and values cleanly
  escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9_-]*)([\s\S]*?)(&gt;)/g, (match, tagHead, tagBody, tagTail) => {
    // Determine tag head class (indigo for AliceComponents, sky for standard HTML)
    const isAliceComponent = /&lt;\/?[A-Z]/.test(tagHead)
    const tagClass = isAliceComponent ? 'text-indigo-400 font-semibold' : 'text-sky-400'
    const highlightedHead = `<span class="${tagClass}">${tagHead}</span>`
    const highlightedTail = `<span class="text-indigo-400 font-semibold">${tagTail}</span>`

    // Process body: isolate values first to avoid inner quote conflict, then attribute names
    const highlightedBody = tagBody
      // First, replace attribute values with temporary tokens
      .replace(/(['"])(.*?)\1/g, '___VAL_START___$2___VAL_END___')
      // Second, highlight attribute names
      .replace(/([\w:-]+)(?=\s*=\s*___VAL_START___)/g, '<span class="text-emerald-400">$1</span>')
      // Finally, expand tokens to actual colored span tags
      .replace(/___VAL_START___(.*?)___VAL_END___/g, '<span class="text-amber-300">"$1"</span>')

    return highlightedHead + highlightedBody + highlightedTail
  })

  return escaped
}

const highlightedHtml = computed(() => highlightCode(props.code))
const lineCount = computed(() => props.code.split('\n').length)
</script>

<template>
  <div class="dark select-text w-full">
    <div class="flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner w-full">
      <!-- Editor Header (IDE style) -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
        <!-- Dots -->
        <div class="flex items-center gap-1.5 w-1/4">
          <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        <!-- Filename -->
        <div class="text-xs text-slate-400 font-mono select-none text-center flex-1">
          {{ filename }}
        </div>

        <!-- Action Button inside Header -->
        <div class="flex justify-end w-1/4">
          <AliceButton
            :variant="showCopiedIndicator ? 'success' : 'primary'"
            design="ghost-subtle"
            size="sm"
            radius="md"
            :icon="showCopiedIndicator ? Check : Copy"
            @click="handleCopy"
          >
            {{ showCopiedIndicator ? 'Copiado!' : 'Copiar' }}
          </AliceButton>
        </div>
      </div>

      <!-- Editor Content (Scrollable) -->
      <div class="flex font-mono text-sm leading-relaxed p-5 text-slate-100 overflow-x-auto custom-scrollbar">
        <!-- Line Numbers -->
        <div class="text-slate-600 text-right pr-4 select-none border-r border-slate-800/80 mr-4 shrink-0 font-mono">
          <div v-for="n in lineCount" :key="n">{{ n }}</div>
        </div>
        <!-- Code Block -->
        <pre class="flex-1 whitespace-pre m-0 font-mono text-slate-300 select-text" v-html="highlightedHtml"></pre>
      </div>
    </div>
  </div>
</template>
