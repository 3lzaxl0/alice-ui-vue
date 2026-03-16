<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    placement?: 'bottom-left' | 'bottom-right'
    closeOnClick?: boolean
    modelValue?: boolean
    mobileFullscreen?: boolean
  }>(),
  {
    placement: 'bottom-right',
    closeOnClick: true,
    modelValue: undefined,
    mobileFullscreen: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const internalOpen = ref(false)

const isOpen = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalOpen.value),
  set: (val: boolean) => {
    internalOpen.value = val
    emit('update:modelValue', val)
  },
})

const containerRef = ref<HTMLElement | null>(null)

defineOptions({
  name: 'AlicePopover',
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside, true)
})

defineExpose({
  close,
  open: () => (isOpen.value = true),
  toggle,
})
</script>

<template>
  <div ref="containerRef" class="relative inline-block text-left">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger" :open="isOpen" />
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-alice-popover mt-2 focus:outline-none"
        :class="[
          placement === 'bottom-right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
          mobileFullscreen
            ? 'max-md:fixed max-md:inset-0 max-md:mt-0 max-md:w-full max-md:h-full max-md:bg-black/50 max-md:z-50 max-md:flex max-md:items-end max-md:justify-center'
            : '',
        ]"
      >
        <div
          @click="closeOnClick ? close() : undefined"
          class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-alice-panel rounded-alice-md"
          :class="
            mobileFullscreen
              ? 'max-md:w-full max-md:rounded-b-none max-md:rounded-t-xl max-md:overflow-hidden max-md:animate-slide-up max-md:border-b-0 max-md:border-l-0 max-md:border-r-0'
              : ''
          "
        >
          <slot :close="close" />
        </div>
      </div>
    </transition>
  </div>
</template>
