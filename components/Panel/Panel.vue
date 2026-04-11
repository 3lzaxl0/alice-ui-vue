<script setup lang="ts">
import { type Component, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

defineOptions({
  name: 'AlicePanel',
})

interface Props {
  title: string
  description?: string
  icon?: Component
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray'
  bodyPadding?: string
  overflowVisible?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  collapsed?: boolean // Optional v-model support
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  bodyPadding: 'p-0',
  overflowVisible: false,
  collapsible: false,
  defaultCollapsed: false,
  collapsed: undefined,
})

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const isCollapsed = ref(props.collapsed !== undefined ? props.collapsed : props.defaultCollapsed)

watch(() => props.collapsed, (val) => {
  if (val !== undefined) isCollapsed.value = val
})

function toggleCollapse() {
  if (!props.collapsible) return
  isCollapsed.value = !isCollapsed.value
  emit('update:collapsed', isCollapsed.value)
}

const variantClasses = {
  primary: {
    outerBorder: 'border-primary-300 dark:border-primary-700',
    header: 'bg-primary-50 dark:bg-primary-900/30 border-primary-200/50 dark:border-primary-800/50',
    hoverHeader: 'hover:bg-primary-100 dark:hover:bg-primary-900/50',
    title: 'text-primary-800 dark:text-primary-200',
    description: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    outerBorder: 'border-success-300 dark:border-success-700',
    header: 'bg-success-50 dark:bg-success-900/30 border-success-200/50 dark:border-success-800/50',
    hoverHeader: 'hover:bg-success-100 dark:hover:bg-success-900/50',
    title: 'text-success-800 dark:text-success-200',
    description: 'text-success-600 dark:text-success-400',
  },
  warning: {
    outerBorder: 'border-warning-300 dark:border-warning-700',
    header: 'bg-warning-50 dark:bg-warning-900/30 border-warning-200/50 dark:border-warning-800/50',
    hoverHeader: 'hover:bg-warning-100 dark:hover:bg-warning-900/50',
    title: 'text-warning-800 dark:text-warning-200',
    description: 'text-warning-600 dark:text-warning-400',
  },
  error: {
    outerBorder: 'border-error-300 dark:border-error-700',
    header: 'bg-error-50 dark:bg-error-900/30 border-error-200/50 dark:border-error-800/50',
    hoverHeader: 'hover:bg-error-100 dark:hover:bg-error-900/50',
    title: 'text-error-800 dark:text-error-200',
    description: 'text-error-600 dark:text-error-400',
  },
  info: {
    outerBorder: 'border-info-300 dark:border-info-700',
    header: 'bg-info-50 dark:bg-info-900/30 border-info-200/50 dark:border-info-800/50',
    hoverHeader: 'hover:bg-info-100 dark:hover:bg-info-900/50',
    title: 'text-info-800 dark:text-info-200',
    description: 'text-info-600 dark:text-info-400',
  },
  gray: {
    outerBorder: 'border-gray-300 dark:border-slate-700',
    header: 'bg-gray-50 dark:bg-slate-800/50 border-gray-200/50 dark:border-slate-700/50',
    hoverHeader: 'hover:bg-gray-100 dark:hover:bg-slate-700/50',
    title: 'text-gray-800 dark:text-gray-200',
    description: 'text-gray-600 dark:text-gray-400',
  },
}
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-slate-900/50 border rounded-alice-md shadow-alice-sm transition-all duration-300"
    :class="[
      overflowVisible ? 'overflow-visible' : 'overflow-hidden',
      variantClasses[props.variant].outerBorder
    ]"
  >
    <!-- Header -->
    <div
      class="px-5 py-3.5 shrink-0 select-none transition-colors duration-300 relative z-10 flex items-center justify-between"
      :class="[
        variantClasses[props.variant].header,
        overflowVisible ? 'rounded-t-[inherit]' : '',
        collapsible ? 'cursor-pointer transition-colors ' + variantClasses[props.variant].hoverHeader : ''
      ]"
      @click="toggleCollapse"
    >
      <div>
        <h3 class="font-bold flex items-center gap-2.5" :class="variantClasses[props.variant].title">
          <component :is="icon" v-if="icon" :size="18" stroke-width="2.5" />
          {{ title }}
        </h3>
        <p v-if="description" class="text-xs mt-1" :class="variantClasses[props.variant].description">
          {{ description }}
        </p>
      </div>

      <button
        v-if="collapsible"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
        :class="variantClasses[props.variant].description"
        aria-label="Toggle panel"
      >
        <ChevronDown
          :size="20"
          class="transition-transform duration-300"
          :class="isCollapsed ? 'rotate-180' : ''"
        />
      </button>
    </div>

    <!-- Content Area -->
    <div
      v-show="!isCollapsed"
      class="flex-1"
      :class="[bodyPadding, overflowVisible ? 'overflow-visible' : 'overflow-hidden']"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Standard Alice transition if used with v-if elsewhere */
.alice-panel-enter-active,
.alice-panel-leave-active {
  transition: all 0.3s ease;
}
.alice-panel-enter-from,
.alice-panel-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
