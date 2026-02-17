<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { PanelLeftOpen, PanelLeftClose, Menu, Sun, Moon, LogOut } from 'lucide-vue-next'
import SidebarItem from './SidebarItem.vue'

defineOptions({
  name: 'AliceSidebar',
})

const props = withDefaults(
  defineProps<{
    title?: string
    persistence?: boolean
    showThemeToggle?: boolean
    showLogout?: boolean
  }>(),
  {
    title: 'Portal Agua',
    persistence: false,
    showThemeToggle: true,
    showLogout: true,
  },
)

// Internal Theme State
const isDark = ref(localStorage.getItem('theme') === 'dark')

function toggleTheme() {
  isDark.value = !isDark.value
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Initialize theme
if (isDark.value) {
  document.documentElement.classList.add('dark')
}

// Emits
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const isHovered = ref(false)
const isPinned = ref(localStorage.getItem('alice-sidebar-pinned') === 'true')
const isMobileOpen = ref(false)

function togglePin() {
  isPinned.value = !isPinned.value
  localStorage.setItem('alice-sidebar-pinned', String(isPinned.value))
}

// Expanded logic:
const expanded = computed(() => {
  return isHovered.value || isPinned.value || isMobileOpen.value
})

// Provide expanded state to all sidebar items
provide('alice-sidebar-expanded', expanded)

function closeMobile() {
  isMobileOpen.value = false
}
</script>

<template>
  <!-- Mobile Header (Visible only on mobile) -->
  <div
    class="h-16 bg-linear-to-br from-blue-600 to-indigo-700 flex items-center px-4 justify-between lg:hidden shrink-0 z-30 relative shadow-md"
  >
    <div class="flex items-center gap-3">
      <button
        @click="isMobileOpen = true"
        class="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <Menu :size="24" />
      </button>
      <span class="font-bold text-white text-lg tracking-tight">{{ title }}</span>
    </div>
    <!-- Optional: Logo or other mobile actions -->
    <div class="w-8 h-8 flex items-center justify-center">
      <img src="/favicon.ico" alt="Logo" class="w-6 h-6" />
    </div>
  </div>

  <!-- Mobile Overlay -->
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
    @click="closeMobile"
  ></div>

  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-linear-to-b from-blue-600 to-indigo-700 shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0"
    :class="[
      // Mobile: Drawer transform
      isMobileOpen ? 'translate-x-0' : '-translate-x-full',

      // Desktop: Width transition (always visible due to lg:translate-x-0)
      expanded ? 'lg:w-64 w-64' : 'lg:w-18 w-64',
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Header -->
    <div class="h-20 flex items-center px-5 shrink-0 relative overflow-hidden">
      <!-- Logo Icon -->
      <div
        class="shrink-0 text-white flex items-center justify-center bg-white/10 p-1.5 rounded-lg backdrop-blur-sm"
      >
        <img src="/favicon.ico" alt="Logo" class="w-6 h-6" />
      </div>

      <!-- Title & Pin (Visible when expanded) -->
      <div
        class="flex items-center justify-between flex-1 ml-3 transition-all duration-300"
        :class="expanded ? 'opacity-100' : 'opacity-0 overflow-hidden w-0'"
      >
        <span class="font-bold text-white text-lg tracking-tight whitespace-nowrap">{{
          title
        }}</span>

        <button
          @click.stop="togglePin"
          class="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden lg:block"
        >
          <PanelLeftClose v-if="isPinned" :size="18" />
          <PanelLeftOpen v-else :size="18" />
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="px-3">
      <div class="h-px bg-white/15 w-full mb-4"></div>
    </div>

    <!-- Body -->
    <div class="flex-1 overflow-y-auto px-3 flex flex-col gap-1 custom-scrollbar">
      <slot :expanded="expanded"></slot>
    </div>

    <!-- Divider -->
    <div class="px-3 mt-auto">
      <div class="h-px bg-white/15 w-full mt-4"></div>
    </div>

    <!-- Footer -->
    <div class="p-3 flex flex-col gap-2">
      <slot name="footer" :expanded="expanded"></slot>

      <!-- Internal Footer Actions -->
      <SidebarItem
        v-if="props.showThemeToggle"
        :label="isDark ? 'Modo Claro' : 'Modo Oscuro'"
        :icon="isDark ? Sun : Moon"
        is-button
        @click="toggleTheme"
      />

      <SidebarItem
        v-if="props.showLogout"
        label="Cerrar Sesión"
        :icon="LogOut"
        variant="error"
        design="filled"
        is-button
        @click="emit('logout')"
      />
    </div>
  </aside>

  <!-- Content Spacer (Desktop Only) -->
  <div
    class="transition-all duration-300 ease-in-out shrink-0 hidden lg:block"
    :class="[isPinned ? 'w-64' : 'w-20']"
  ></div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
