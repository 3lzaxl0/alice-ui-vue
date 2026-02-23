<script setup lang="ts">
import { computed, inject } from 'vue'
import { sidebarItemVariants } from './Sidebar.variants'

defineOptions({
  name: 'AliceSidebarItem',
})

interface Props {
  icon?: object
  label: string
  to?: string
  active?: boolean
  expanded?: boolean
  variant?: 'default' | 'error'
  design?: 'filled' | 'ghost' | 'outline'
  isButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  design: 'ghost',
  expanded: undefined,
  isButton: false,
})

const injectedExpanded = inject('alice-sidebar-expanded', { value: false })
const isExpanded = computed(() => props.expanded ?? injectedExpanded.value)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const computedClass = computed(() => {
  return sidebarItemVariants({
    active: props.active,
    variant: props.variant,
    design: props.design,
  })
})
</script>

<template>
  <component
    :is="isButton ? 'button' : 'RouterLink'"
    :to="!isButton ? to : undefined"
    :class="computedClass"
    @click="isButton ? emit('click') : undefined"
  >
    <div
      class="flex items-center gap-2 transition-transform duration-300 ease-out group-hover:scale-[1.03] group-active:scale-[0.98] origin-left transform-gpu backface-hidden antialiased"
    >
      <!-- Icon Wrapper -->
      <div class="shrink-0 flex items-center justify-center w-6 h-6">
        <component :is="icon" v-if="icon" :size="20" />
      </div>

      <!-- Label (Transition for width/opacity) -->
      <span
        class="whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left"
        :class="[
          isExpanded
            ? 'opacity-100 translate-x-0 w-auto'
            : 'opacity-0 -translate-x-4 w-0 overflow-hidden',
        ]"
      >
        {{ label }}
      </span>
    </div>
  </component>
</template>
