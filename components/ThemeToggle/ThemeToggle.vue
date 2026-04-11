<script setup lang="ts">
import { computed, inject } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '../../composables/useTheme'
import { cva, type VariantProps } from 'class-variance-authority'

const themeToggleVariants = cva(
  'group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-300 outline-none select-none cursor-pointer overflow-hidden rounded-xl shrink-0 focus:outline-none focus:ring-0',
  {
    variants: {
      active: {
        true: '',
        false: 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10',
      },
      variant: {
        sidebar: 'w-full',
        button: 'px-4 py-2 w-auto border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm',
      }
    },
    defaultVariants: {
      active: false,
      variant: 'sidebar',
    }
  }
)

type ThemeToggleProps = VariantProps<typeof themeToggleVariants>

interface Props {
  variant?: ThemeToggleProps['variant']
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'sidebar',
  expanded: undefined,
})

const { isDark, toggleTheme } = useTheme()
const injectedExpanded = inject('alice-sidebar-expanded', { value: false })
const isExpanded = computed(() => props.expanded ?? injectedExpanded.value)

defineOptions({
  name: 'AliceThemeToggle',
})

const currentLabel = computed(() => (isDark.value ? 'Modo Claro' : 'Modo Oscuro'))
</script>

<template>
  <button :class="themeToggleVariants({ variant })" @click="toggleTheme" :title="currentLabel">
    <div class="flex items-center gap-2 transition-transform duration-300 ease-out group-hover:scale-[1.03] origin-left">
      <!-- Icon Container -->
      <div class="relative w-6 h-6 flex items-center justify-center shrink-0">
        <transition
          enter-active-class="transform transition duration-300 ease-out"
          enter-from-class="opacity-0 rotate-90 scale-0"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transform transition duration-300 ease-in absolute"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 -rotate-90 scale-0"
        >
          <Sun v-if="isDark" :key="'sun'" :size="20" stroke-width="2" />
          <Moon v-else :key="'moon'" :size="20" stroke-width="2" />
        </transition>
      </div>

      <!-- Label (Transition matches SidebarItem) -->
      <span
        class="whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left"
        :class="[
          isExpanded || variant === 'button'
            ? 'opacity-100 translate-x-0 w-auto'
            : 'opacity-0 -translate-x-4 w-0 overflow-hidden',
        ]"
      >
        {{ currentLabel }}
      </span>
    </div>

    <!-- Dot Decoration (Sidebar Only) -->
    <div 
      v-if="variant === 'sidebar'"
      class="ml-auto w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
      :class="[
        isExpanded ? 'opacity-100' : 'opacity-0',
        'group-hover:bg-primary-500'
      ]"
    ></div>
  </button>
</template>
