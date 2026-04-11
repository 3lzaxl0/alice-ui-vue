<script setup lang="ts">
import { ref } from 'vue'
import { X, Upload } from 'lucide-vue-next'
import AliceLoading from '../Loading/Loading.vue'

interface Props {
  modelValue?: string | string[]
  multiple?: boolean
  label?: string
  loading?: boolean
  aspectRatio?: 'square' | 'video' | 'portrait'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  multiple: false,
  aspectRatio: 'square'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'select', file: File): void
  (e: 'remove', url: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

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

const removeImage = (url: string) => {
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
        <div 
          v-for="(url, index) in modelValue" 
          :key="index"
          class="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 shadow-sm transition-all hover:shadow-md"
        >
          <img :src="url" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              @click="removeImage(url)" 
              class="p-2 bg-white/10 hover:bg-red-500 rounded-full text-white transition-all transform hover:scale-110"
            >
              <X :size="16" />
            </button>
          </div>
        </div>
      </template>
      
      <!-- 2. SINGLE PREVIEW -->
      <template v-else-if="!multiple && modelValue && typeof modelValue === 'string'">
        <div 
          class="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-100 group shadow-alice-sm transition-all hover:shadow-alice-md"
        >
          <img :src="modelValue" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
                type="button"
                @click="removeImage(modelValue)" 
                class="p-2 bg-white/10 hover:bg-red-500 rounded-full text-white transition-all transform hover:scale-110"
              >
              <X :size="20" />
            </button>
          </div>
        </div>
      </template>

      <!-- 3. UPLOAD TRIGGER -->
      <button 
        v-if="multiple || !modelValue"
        type="button"
        @click="triggerSelect"
        :disabled="loading"
        class="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div v-if="loading" class="flex flex-col items-center gap-2">
           <AliceLoading size="sm" />
           <span class="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Subiendo...</span>
        </div>
        <template v-else>
          <div class="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-100 transition-colors">
            <Upload :size="20" class="text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <span class="text-[9px] font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-tighter">Añadir Foto</span>
        </template>
      </button>

      <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        class="hidden" 
        @change="handleFileSelect" 
      />
    </div>
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
