<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Eye, Trash2 } from 'lucide-vue-next'
import AliceLoading from '../Loading/Loading.vue'
import AliceDialog from '../Dialog/Dialog.vue'
import AliceButton from '../Button/Button.vue'
import AliceText from '../Text/Text.vue'

interface Props {
  modelValue?: string | string[]
  multiple?: boolean
  label?: string
  loading?: boolean,
  aspectRatio?: 'square' | 'video' | 'portrait',
  fullWidth?: boolean,
  allowPreview?: boolean,
  allowDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  multiple: false,
  aspectRatio: 'square',
  fullWidth: false,
  allowPreview: true,
  allowDelete: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'select', file: File): void
  (e: 'remove', url: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const isPreviewOpen = ref(false)
const currentPreviewUrl = ref('')

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (file) {
    emit('select', file)
  }

  // Reset input so the same file can be selected again
  target.value = ''
}

const triggerSelect = () => {
  if (props.loading) return
  fileInput.value?.click()
}

const openPreview = (url: string) => {
  if (!props.allowPreview) return
  currentPreviewUrl.value = url
  isPreviewOpen.value = true
}

const removeImage = (url: string) => {
  if (!props.allowDelete) return
  emit('remove', url)
}

</script>

<template>
  <div class="flex flex-col gap-3">
    <label v-if="label" class="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {{ label }}
    </label>

    <div class="flex flex-wrap gap-4">
      <!-- 1. MULTIPLE PREVIEW -->
      <template v-if="multiple && Array.isArray(modelValue)">
        <div v-for="(url, index) in modelValue" :key="index"
          class="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 shadow-sm transition-all hover:shadow-md">
          <img :src="url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

          <!-- Actions Overlay -->
          <!-- Desktop: Centered Hover -->
          <div
            class="hidden md:flex absolute inset-0 bg-slate-900/60 items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button v-if="allowPreview" type="button" @click="openPreview(url)"
              class="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-all transform hover:scale-110 shadow-lg backdrop-blur-md"
              title="Previsualizar">
              <Eye :size="16" />
            </button>
            <button v-if="allowDelete" type="button" @click="removeImage(url)"
              class="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-all transform hover:scale-110 shadow-lg"
              title="Eliminar">
              <Trash2 :size="16" />
            </button>
          </div>

          <!-- Mobile: Bottom Action Bar (Solid) -->
          <div
            v-if="allowPreview || allowDelete"
            class="md:hidden absolute inset-x-0 bottom-0 h-9 bg-white dark:bg-slate-900 flex items-center border-t border-slate-100 dark:border-slate-800"
          >
            <AliceButton
              v-if="allowPreview"
              variant="ghost"
              radius="none"
              expanded
              @click="openPreview(url)"
              class="h-full!"
            >
              <Eye :size="14" />
            </AliceButton>
            <div v-if="allowPreview && allowDelete" class="w-px h-4 bg-slate-100 dark:bg-slate-800"></div>
            <AliceButton
              v-if="allowDelete"
              variant="ghost"
              radius="none"
              expanded
              @click="removeImage(url)"
              class="h-full! text-red-500 hover:text-red-600"
            >
              <Trash2 :size="14" />
            </AliceButton>
          </div>
        </div>
      </template>

      <!-- 2. SINGLE PREVIEW -->
      <template v-else-if="!multiple && modelValue && typeof modelValue === 'string'">
        <div
          class="relative rounded-xl overflow-hidden border-2 border-slate-100 group shadow-alice-sm transition-all hover:shadow-alice-md"
          :class="[
            fullWidth ? 'w-full' : 'w-32 h-32',
            aspectRatio === 'square' ? 'aspect-square' : '',
            aspectRatio === 'video' ? 'aspect-video' : '',
            aspectRatio === 'portrait' ? 'aspect-3/4' : '',
          ]">
          <img :src="modelValue"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            @click="openPreview(modelValue)" />

          <!-- Actions Overlay -->
          <!-- Desktop: Centered Hover -->
          <div
            class="hidden md:flex absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-4 backdrop-blur-[2px]">
            <button v-if="allowPreview" type="button" @click="openPreview(modelValue)"
              class="p-3 bg-white/20 hover:bg-white/40 rounded-2xl text-white transition-all transform hover:scale-110 shadow-xl backdrop-blur-md border border-white/20"
              title="Ver imagen">
              <Eye :size="24" />
            </button>
            <button v-if="allowDelete" type="button" @click="removeImage(modelValue)"
              class="p-3 bg-red-500/90 hover:bg-red-600 rounded-2xl text-white transition-all transform hover:scale-110 shadow-xl"
              title="Eliminar">
              <Trash2 :size="24" />
            </button>
          </div>

          <!-- Mobile: High-Visibility Bottom Bar (Solid) -->
          <div
            v-if="allowPreview || allowDelete"
            class="md:hidden absolute inset-x-0 bottom-0 h-14 bg-white dark:bg-slate-900 flex items-center border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
          >
            <AliceButton
              v-if="allowPreview"
              variant="ghost"
              radius="none"
              expanded
              @click="openPreview(modelValue)"
              class="h-full!"
            >
              <div class="flex items-center gap-2">
                <Eye :size="18" />
                <AliceText variant="caption" weight="bold" class="uppercase tracking-widest">Ver</AliceText>
              </div>
            </AliceButton>
            <div v-if="allowPreview && allowDelete" class="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
            <AliceButton
              v-if="allowDelete"
              variant="ghost"
              radius="none"
              expanded
              @click="removeImage(modelValue)"
              class="h-full! text-red-500! hover:bg-red-50/50! dark:hover:bg-red-500/10!"
            >
              <div class="flex items-center gap-2">
                <Trash2 :size="18" />
                <AliceText variant="caption" weight="bold" class="uppercase tracking-widest">Borrar</AliceText>
              </div>
            </AliceButton>
          </div>
        </div>
      </template>

      <!-- 3. UPLOAD TRIGGER -->
      <button v-if="multiple || !modelValue" type="button" @click="triggerSelect" :disabled="loading"
        class="rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          multiple ? 'w-24 h-24 sm:w-32 sm:h-32' : (fullWidth ? 'w-full' : 'w-24 h-24 sm:w-32 sm:h-32'),
          aspectRatio === 'square' ? 'aspect-square' : '',
          aspectRatio === 'video' ? 'aspect-video' : '',
          aspectRatio === 'portrait' ? 'aspect-3/4' : '',
        ]">
        <div v-if="loading" class="flex flex-col items-center gap-2">
          <AliceLoading size="sm" />
          <span class="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Subiendo...</span>
        </div>
        <template v-else>
          <div class="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-100 transition-colors">
            <Upload :size="20" class="text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <span
            class="text-[9px] font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-tighter">Añadir
            Foto</span>
        </template>
      </button>

      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
    </div>

    <!-- Preview Lightbox -->
    <AliceDialog
      v-model:show="isPreviewOpen"
      title="Vista Previa de Imagen"
      hide-footer
      padding="none"
      max-width="max-w-4xl"
    >
      <div class="bg-slate-900 flex items-center justify-center min-h-[400px] overflow-hidden">
        <img :src="currentPreviewUrl" class="max-w-full max-h-[85vh] object-contain shadow-2xl" alt="Vista previa" />
      </div>
    </AliceDialog>
  </div>
</template>

<style scoped>
/* Transiciones suaves para la Alice UI */
.group:hover img {
  transform: scale(1.05);
}

img {
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
