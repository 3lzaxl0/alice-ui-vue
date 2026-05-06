<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import AliceLoading from '../Loading/Loading.vue'
import AliceContextMenu, { type ContextMenuOption } from '../ContextMenu/ContextMenu.vue'
import { Copy, Download } from 'lucide-vue-next'
import { addAliceToast } from '../Toast/useToast'

defineOptions({ name: 'AliceImage' })

const props = withDefaults(
  defineProps<{
    src: string | null | undefined
    alt?: string
    aspect?: 'square' | 'video' | 'auto'
    type?: 'skeleton' | 'spinner'
    objectFit?: 'cover' | 'contain' | 'fill'
    transition?: boolean
  }>(),
  {
    alt: '',
    aspect: 'square',
    type: 'skeleton',
    objectFit: 'cover',
    transition: true
  }
)

const isLoaded = ref(false)
const hasError = ref(false)
const isWaiting = ref(true)

// Preload optimization
let imgInstance: HTMLImageElement | null = null

const loadImage = (url: string | null | undefined) => {
  if (!url) {
    isLoaded.value = true
    isWaiting.value = false
    return
  }

  isLoaded.value = false
  isWaiting.value = true
  hasError.value = false

  imgInstance = new Image()
  imgInstance.src = url
  imgInstance.onload = () => {
    isLoaded.value = true
    isWaiting.value = false
  }
  imgInstance.onerror = () => {
    hasError.value = true
    isLoaded.value = true
    isWaiting.value = false
  }
}

watch(() => props.src, (newSrc) => {
  loadImage(newSrc)
}, { immediate: true })

onUnmounted(() => {
  if (imgInstance) {
    imgInstance.onload = null
    imgInstance.onerror = null
  }
})

const aspectClass = {
  square: 'aspect-square',
  video: 'aspect-video',
  auto: ''
}

const fitClass = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill'
}

const contextOptions: ContextMenuOption[] = [
  { label: 'Copiar imagen', value: 'copy', icon: Copy },
  { label: 'Descargar imagen', value: 'download', icon: Download }
]

const handleContextSelect = async (value: string | number) => {
  if (!props.src) return
  
  if (value === 'copy') {
    try {
      const response = await fetch(props.src)
      const blob = await response.blob()
      
      // Convert to PNG since ClipboardItem only supports image/png currently
      let finalBlob = blob
      if (blob.type !== 'image/png') {
        const imageBitmap = await createImageBitmap(blob)
        const canvas = document.createElement('canvas')
        canvas.width = imageBitmap.width
        canvas.height = imageBitmap.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(imageBitmap, 0, 0)
          finalBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => {
              if (b) resolve(b)
              else reject(new Error('Canvas toBlob failed'))
            }, 'image/png')
          })
        }
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          [finalBlob.type]: finalBlob
        })
      ])
      addAliceToast({
        title: 'Imagen copiada',
        message: 'La imagen se ha copiado al portapapeles',
        type: 'success'
      })
    } catch (e) {
      console.error('Failed to copy image', e)
      addAliceToast({
        title: 'No se pudo copiar',
        message: 'Puede deberse a restricciones de seguridad del navegador',
        type: 'error'
      })
    }
  } else if (value === 'download') {
    const a = document.createElement('a')
    a.href = props.src
    
    // Determine extension
    let ext = 'jpg'
    if (props.src.includes('image/png')) ext = 'png'
    else if (props.src.includes('image/webp')) ext = 'webp'
    else if (props.src.includes('image/gif')) ext = 'gif'
    
    a.download = `imagen-${Date.now()}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
</script>

<template>
  <AliceContextMenu :options="contextOptions" @select="handleContextSelect">
    <div class="relative overflow-hidden w-full h-full" :class="aspectClass[aspect]">
      <!-- Loading Skeleton (Simple Pulse) -->
    <div 
      v-if="!isLoaded && src && type === 'skeleton'" 
      class="absolute inset-0 z-10 bg-slate-200 dark:bg-slate-700 animate-pulse"
    ></div>

    <!-- Loading Spinner (Using AliceLoading) -->
    <AliceLoading 
      v-if="!isLoaded && src && type === 'spinner'" 
      active 
      type="spinner"
      transparent 
      :blur="false"
      class="z-10"
    />

    <!-- Image -->
    <img
      v-if="src && !hasError && !isWaiting"
      :src="src"
      :alt="alt"
      class="w-full h-full"
      :class="[
        fitClass[objectFit],
        transition ? 'transition-all duration-300 ease-out' : '',
        isLoaded ? 'opacity-100' : 'opacity-0'
      ]"
    />

    <!-- Error/Fallback -->
    <div 
      v-else-if="(hasError || !src) && !isWaiting" 
      class="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-700 p-2 text-center"
    >
      <slot name="fallback">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span class="text-[10px] font-black uppercase tracking-tighter opacity-70">Sin Imagen</span>
      </slot>
    </div>
    </div>
  </AliceContextMenu>
</template>
