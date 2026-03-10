<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { PanelLeftOpen, PanelLeftClose, Menu, Sun, Moon, LogOut, UserCircle } from 'lucide-vue-next'
import SidebarItem from './SidebarItem.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'

defineOptions({
  name: 'AliceSidebar',
})

interface UserRole {
  domainCode: string
  roleName: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    persistence?: boolean
    showThemeToggle?: boolean
    showLogout?: boolean
    userName?: string
    /** Currently active domainCode (v-model compatible) */
    activeRoleCode?: string | null
    userRoles?: UserRole[]
  }>(),
  {
    title: 'Portal Agua',
    persistence: false,
    showThemeToggle: true,
    showLogout: true,
    userName: '',
    activeRoleCode: null,
    userRoles: () => [],
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
  (e: 'switchRole', domainCode: string): void
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

function handleMouseLeave() {
  isHovered.value = false
}

// User initials for collapsed avatar
const userInitials = computed(() => {
  if (!props.userName) return '?'
  const parts = props.userName.trim().split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0]! + parts[1][0]!).toUpperCase()
  }
  return parts[0]?.[0]?.toUpperCase() ?? '?'
})

// Convert userRoles to DropdownMenu options
const roleOptions = computed(() =>
  props.userRoles.map((r) => ({
    label: r.roleName,
    value: r.domainCode,
  })),
)

// Active role label for display when dropdown not needed
const activeRoleLabel = computed(() => {
  const role = props.userRoles.find((r) => r.domainCode === props.activeRoleCode)
  return role?.roleName ?? ''
})

function handleRoleChange(value: string | number) {
  emit('switchRole', String(value))
}
</script>

<template>
  <!-- Mobile Header (Visible only on mobile) -->
  <div
    class="h-16 bg-white dark:bg-slate-900 border-b border-gray-200/50 dark:border-white/5 flex items-center px-4 justify-between lg:hidden shrink-0 z-30 relative shadow-xs"
  >
    <div class="flex items-center gap-3">
      <button
        @click="isMobileOpen = true"
        class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <Menu :size="24" />
      </button>
      <span class="font-bold text-gray-900 dark:text-white text-lg tracking-tight">{{
        title
      }}</span>
    </div>
    <!-- Optional: Logo or other mobile actions -->
    <div
      class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-600/20 select-none"
    >
      <template v-if="userName">{{ userInitials }}</template>
      <UserCircle v-else :size="20" />
    </div>
  </div>

  <!-- Mobile Overlay -->
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
    @click="closeMobile"
  ></div>

  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col h-screen transition-all duration-300 ease-in-out lg:translate-x-0"
    :class="[
      // Mobile: Drawer transform + styles (needs background)
      isMobileOpen
        ? 'translate-x-0 shadow-2xl bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none'
        : '-translate-x-full',

      // Desktop: Width transition (always visible due to lg:translate-x-0)
      expanded ? 'lg:w-64 w-64' : 'lg:w-18 w-64',
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="handleMouseLeave"
  >
    <!-- Header: User Profile -->
    <div class="h-20 flex items-center px-5 shrink-0 relative">
      <!-- User Avatar (Initials) -->
      <div
        class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-600/20 select-none"
      >
        <template v-if="userName">{{ userInitials }}</template>
        <UserCircle v-else :size="20" />
      </div>

      <!-- User Info & Pin (Visible when expanded) -->
      <div
        class="flex items-center justify-between flex-1 ml-3 transition-all duration-300 min-w-0"
        :class="expanded ? 'opacity-100' : 'opacity-0 overflow-hidden w-0'"
      >
        <div class="min-w-0 flex-1">
          <!-- User Name -->
          <p
            class="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight"
            :title="userName"
          >
            {{ userName || title }}
          </p>

          <!-- Active Role (DropdownMenu if multiple, static text if single) -->
          <template v-if="userRoles.length > 1">
            <DropdownMenu
              id="sidebar-role-selector"
              :model-value="activeRoleCode"
              :options="roleOptions"
              design="ghost"
              size="sm"
              placeholder="Seleccionar rol..."
              @update:model-value="handleRoleChange"
            />
          </template>
          <p
            v-else-if="activeRoleLabel"
            class="text-[11px] text-gray-400 dark:text-gray-500 truncate"
            :title="activeRoleLabel"
          >
            {{ activeRoleLabel }}
          </p>
        </div>

        <button
          @click.stop="togglePin"
          class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden lg:block shrink-0"
        >
          <PanelLeftClose v-if="isPinned" :size="18" />
          <PanelLeftOpen v-else :size="18" />
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="flex-1 overflow-y-auto px-3 flex flex-col gap-1 custom-scrollbar-sm pt-4">
      <slot :expanded="expanded"></slot>
    </div>

    <!-- Divider -->
    <div class="px-3 mt-auto">
      <div class="h-px bg-gray-200/20 dark:bg-white/10 w-full mt-4"></div>
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
    :class="[expanded ? 'w-64' : 'w-20']"
  ></div>
</template>
