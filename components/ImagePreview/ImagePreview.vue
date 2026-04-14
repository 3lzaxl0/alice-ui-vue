<script setup lang="ts">
import AliceDialog from '../Dialog/Dialog.vue'
import AliceImage from '../Image/Image.vue'

defineOptions({ name: 'AliceImagePreview' })

withDefaults(
  defineProps<{
    show: boolean
    src: string | null | undefined
    title?: string
    maxWidth?: string
  }>(),
  {
    title: 'Vista Previa de Imagen',
    maxWidth: 'max-w-4xl'
  }
)

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()
</script>

<template>
  <AliceDialog
    :show="show"
    @update:show="emit('update:show', $event)"
    :title="title"
    hide-footer
    padding="none"
    :max-width="maxWidth"
  >
    <div class="bg-slate-900/95 dark:bg-slate-950 flex items-center justify-center min-h-[300px] sm:min-h-[500px] p-1 sm:p-4 overflow-hidden select-none">
      <div class="relative w-full h-full max-h-[85vh] flex items-center justify-center">
        <!-- We use AliceImage to maintain standard loading skeletons and fallbacks -->
        <AliceImage
          :src="src"
          object-fit="contain"
          class="max-w-full max-h-[85vh] shadow-2xl rounded-sm sm:rounded-lg"
        />
      </div>
    </div>
  </AliceDialog>
</template>

<style scoped>
.alice-image-preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
