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
    outerBorder: 'border-blue-300 dark:border-blue-700',
    header: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-800/50',
    hoverHeader: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
    title: 'text-blue-800 dark:text-blue-200',
    description: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    outerBorder: 'border-emerald-300 dark:border-emerald-700',
    header: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-800/50',
    hoverHeader: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    title: 'text-emerald-800 dark:text-emerald-200',
    description: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    outerBorder: 'border-amber-300 dark:border-amber-700',
    header: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-800/50',
    hoverHeader: 'hover:bg-amber-100 dark:hover:bg-amber-900/50',
    title: 'text-amber-800 dark:text-amber-200',
    description: 'text-amber-600 dark:text-amber-400',
  },
  error: {
    outerBorder: 'border-rose-300 dark:border-rose-700',
    header: 'bg-rose-50 dark:bg-rose-900/30 border-rose-200/50 dark:border-rose-800/50',
    hoverHeader: 'hover:bg-rose-100 dark:hover:bg-rose-900/50',
    title: 'text-rose-800 dark:text-rose-200',
    description: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    outerBorder: 'border-blue-300 dark:border-blue-700',
    header: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-800/50',
    hoverHeader: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
    title: 'text-blue-800 dark:text-blue-200',
    description: 'text-blue-600 dark:text-blue-400',
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
