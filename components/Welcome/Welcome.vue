<script setup lang="ts">
import { type Component } from 'vue'
import {
  welcomeCardVariants,
  welcomeIconVariants,
  welcomeTitleVariants,
  welcomeLinkVariants,
} from './Welcome.variants'

defineOptions({
  name: 'AliceWelcome',
})

// Define accepted colors for type safety
type WelcomeColor =
  | 'emerald'
  | 'cyan'
  | 'indigo'
  | 'amber'
  | 'blue'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'default'

export interface WelcomeItem {
  label: string
  to: string
  icon: Component
  description?: string
  color?: string // We cast this to WelcomeColor in template
}

defineProps<{
  userName: string
  items: WelcomeItem[]
}>()
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-0">
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white shadow-lg rounded-3xl"
    >
      <div class="relative z-10">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Bienvenido, <span class="opacity-90">{{ userName }}</span>
        </h1>
        <p class="text-blue-100 text-lg md:text-xl max-w-2xl font-light">
          Selecciona una operación para comenzar o utiliza el menú lateral para navegar por el
          sistema.
        </p>
      </div>

      <!-- Decorative Background Circles -->
      <div
        class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-black/10 blur-2xl"
      ></div>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :class="welcomeCardVariants({ color: item.color as WelcomeColor })"
      >
        <div class="flex flex-col h-full gap-4">
          <!-- Icon Container -->
          <div :class="welcomeIconVariants({ color: item.color as WelcomeColor })">
            <component :is="item.icon" :size="24" stroke-width="2" />
          </div>

          <!-- Content -->
          <div>
            <h3 :class="welcomeTitleVariants({ color: item.color as WelcomeColor })">
              {{ item.label }}
            </h3>
            <p
              v-if="item.description"
              class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2"
            >
              {{ item.description }}
            </p>
          </div>

          <!-- Arrow Indicator (Visible on hover) -->
          <div
            class="mt-auto pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0"
          >
            <span :class="welcomeLinkVariants({ color: item.color as WelcomeColor })">
              Ir ahora &rarr;
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
