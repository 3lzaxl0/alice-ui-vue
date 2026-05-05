<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { Menu, LogOut, UserCircle } from 'lucide-vue-next'
import SidebarItem from './SidebarItem.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import AliceThemeToggle from '../ThemeToggle/ThemeToggle.vue'
import AliceColorPicker from '../ColorPicker/ColorPicker.vue'

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
    showColorPicker?: boolean
  }>(),
  {
    title: '',
    persistence: false,
    showThemeToggle: true,
    showLogout: true,
    userName: '',
    activeRoleCode: null,
    userRoles: () => [],
    showColorPicker: false,
  },
)


// Emits
const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'switchRole', domainCode: string): void
}>()

const isPinned = ref(localStorage.getItem('alice-sidebar-pinned') === 'true')
const isMobileOpen = ref(false)
const isCustomizing = ref(false)

function toggleSidebar() {
  isPinned.value = !isPinned.value
  localStorage.setItem('alice-sidebar-pinned', String(isPinned.value))
}

// Expanded = pinned/clicked open, mobile open, or color picker open
const expanded = computed(() => {
  return isPinned.value || isMobileOpen.value || isCustomizing.value
})

// Provide expanded state to all sidebar items
provide('alice-sidebar-expanded', expanded)

function closeMobile() {
  isMobileOpen.value = false
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
    class="h-16 bg-white dark:bg-slate-900 border-b border-gray-200/50 dark:border-white/5 flex items-center px-4 justify-between lg:hidden shrink-0 z-30 relative shadow-xs">
    <div class="flex items-center gap-3">
      <button @click="isMobileOpen = true"
        class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
        <Menu :size="24" />
      </button>
      <span class="font-bold text-gray-900 dark:text-white text-lg tracking-tight">{{
        title
      }}</span>
    </div>
    <!-- Optional: Logo or other mobile actions -->
    <div
      class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 text-white text-xs font-bold shadow-lg shadow-primary-600/20 select-none">
      <template v-if="userName">{{ userInitials }}</template>
      <UserCircle v-else :size="20" />
    </div>
  </div>

  <!-- Mobile Overlay -->
  <Transition name="alice-fade">
    <div v-if="isMobileOpen" class="fixed inset-0 bg-black/60 z-1440 lg:hidden backdrop-blur-sm" @click="closeMobile">
    </div>
  </Transition>

  <aside
    class="fixed inset-y-0 left-0 flex flex-col h-screen transition-[transform,width] duration-300 ease-in-out lg:translate-x-0"
    :class="[
      isMobileOpen ? 'z-alice-sidebar-mobile' : 'z-30',
      // Mobile: Drawer transform + styles (needs background)
      isMobileOpen
        ? 'translate-x-0 shadow-2xl bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none'
        : '-translate-x-full',

      // Desktop: Width transition
      expanded ? 'lg:w-64 w-64' : 'lg:w-18 w-64',
    ]"
  >
    <!-- Header: User Profile -->
    <div class="h-20 flex items-center px-4 shrink-0 relative">
      <!-- Avatar -->
      <div class="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 text-white text-xs font-bold shadow-lg shadow-primary-600/20 select-none">
        <template v-if="userName">{{ userInitials }}</template>
        <UserCircle v-else :size="20" />
      </div>

      <!-- User Info (visible when expanded) -->
      <div
        class="flex flex-col min-w-0 flex-1 ml-3 transition-all duration-300"
        :class="expanded ? 'opacity-100' : 'opacity-0 overflow-hidden w-0'"
      >
        <p class="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight" :title="userName">
          {{ userName || title }}
        </p>
        <template v-if="userRoles.length > 1">
          <DropdownMenu id="sidebar-role-selector" :model-value="activeRoleCode" :options="roleOptions" design="ghost" size="sm" placeholder="Seleccionar rol..." @update:model-value="handleRoleChange" />
        </template>
        <p v-else-if="activeRoleLabel" class="text-[11px] text-gray-400 dark:text-gray-500 truncate" :title="activeRoleLabel">
          {{ activeRoleLabel }}
        </p>
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

      <!-- Theme & Color Customization -->
      <div class="flex flex-col gap-2">
        <AliceColorPicker v-if="showColorPicker" @open-change="(val) => isCustomizing = val" />
        <AliceThemeToggle />
      </div>

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

    <!-- Edge Toggle Bar -->
    <div
      class="absolute right-0 top-0 bottom-0 w-1.5 hover:w-3 bg-transparent cursor-pointer hidden lg:flex items-center justify-center transition-all duration-200 group/edge z-50"
      @click="toggleSidebar"
      :title="expanded ? 'Contraer menú' : 'Expandir menú'"
    >
      <div class="h-10 w-1 rounded-full bg-gray-200 dark:bg-slate-700 group-hover/edge:bg-primary-500 transition-colors"></div>
    </div>
  </aside>

  <!-- Content Spacer (Desktop Only) -->
  <div class="transition-[width] duration-300 ease-in-out shrink-0 hidden lg:block"
    :class="[expanded ? 'w-64' : 'w-20']">
  </div>
</template>
