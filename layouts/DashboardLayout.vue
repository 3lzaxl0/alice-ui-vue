<script setup lang="ts">
import { type Component } from 'vue'
import { useRoute } from 'vue-router'
import AliceSidebar from '../components/Sidebar/Sidebar.vue'
import AlicePageHeader from '../components/PageHeader/PageHeader.vue'
import AliceToast from '../components/Toast/Toast.vue'

defineOptions({
  name: 'AliceDashboardLayout',
})

interface UserRole {
  domainCode: string
  roleName: string
}

withDefaults(
  defineProps<{
    /** Sidebar title */
    sidebarTitle?: string
    /** User name for sidebar display */
    userName?: string
    /** User roles for sidebar display/selection */
    userRoles?: UserRole[]
    /** Currently active domain code */
    activeRoleCode?: string | null
    /** Header title */
    headerTitle?: string
    /** Header description */
    headerDescription?: string
    /** Header icon component */
    headerIcon?: Component
    /** Enable KeepAlive for router-view components */
    persistence?: boolean
    /** Show the global toast notification system in this layout */
    showToast?: boolean
    /** Show theme toggle (sun/moon) in sidebar */
    showThemeToggle?: boolean
    /** Show logout button in sidebar */
    showLogout?: boolean
    /** Transition name for view changes */
    transitionName?: string
    /** Max cached components for KeepAlive */
    keepAliveMax?: number
    /** Whether the header should show a refresh button */
    headerRefreshable?: boolean
    /** Whether the header refresh button is in loading state */
    headerRefreshing?: boolean
  }>(),
  {
    sidebarTitle: 'Portal Agua',
    userName: '',
    userRoles: () => [],
    activeRoleCode: null,
    persistence: true,
    showToast: true,
    showThemeToggle: true,
    showLogout: true,
    transitionName: 'slide-fade',
    keepAliveMax: 10,
  },
)

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'switchRole', domainCode: string): void
  (e: 'headerRefresh'): void
}>()

const route = useRoute()

function handleLogout() {
  emit('logout')
}

function handleSwitchRole(code: string) {
  emit('switchRole', code)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col lg:flex-row">
    <!-- Navigation Sidebar -->
    <AliceSidebar
      :title="sidebarTitle"
      :persistence="persistence"
      :user-name="userName"
      :active-role-code="activeRoleCode"
      :user-roles="userRoles"
      :show-theme-toggle="showThemeToggle"
      :show-logout="showLogout"
      @logout="handleLogout"
      @switch-role="handleSwitchRole"
    >
      <template #default>
        <slot name="sidebar" />
      </template>

      <template #footer="{ expanded }">
        <slot name="sidebar-footer" v-bind="{ expanded }" />
      </template>
    </AliceSidebar>

    <!-- Main Content Area -->
    <main
      class="flex-1 transition-all duration-300 relative p-2 md:py-4 md:pe-4 md:ps-1 overflow-hidden h-screen"
    >
      <!-- Floating Card Container -->
      <div
        class="h-full w-full bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-md shadow-gray-300/60 dark:shadow-black/60 flex flex-col overflow-hidden relative transition-all duration-300 border-none"
      >
        <!-- Automated Page Header -->
        <slot name="header">
          <AlicePageHeader
            v-if="headerTitle"
            :title="headerTitle"
            :description="headerDescription"
            :icon="headerIcon"
            :show-refresh="headerRefreshable"
            :refreshing="headerRefreshing"
            @refresh="emit('headerRefresh')"
          >
            <template #actions>
              <slot name="header-actions" />
            </template>
          </AlicePageHeader>
        </slot>

        <!-- Viewport / Content Section -->
        <div class="px-6 pb-6 pt-4 h-full overflow-y-auto custom-scrollbar flex flex-col gap-4">
          <slot>
            <!-- Integrated Routing Logic -->
            <RouterView v-slot="{ Component }">
              <transition :name="transitionName" mode="out-in">
                <template v-if="persistence">
                  <KeepAlive :max="keepAliveMax">
                    <component :is="Component" :key="route.fullPath" />
                  </KeepAlive>
                </template>
                <template v-else>
                  <component :is="Component" :key="route.fullPath" />
                </template>
              </transition>
            </RouterView>
          </slot>
        </div>
      </div>
    </main>

    <!-- Global Alice Components -->
    <AliceToast v-if="showToast" />
  </div>
</template>

<style scoped>
</style>
