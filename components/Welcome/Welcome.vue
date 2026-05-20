<script setup lang="ts">
import { type Component } from 'vue'
import WelcomeItemComponent from './WelcomeItem.vue'

defineOptions({
  name: 'AliceWelcome',
})

// Define accepted colors for type safety
type WelcomeColor =
  | 'success'
  | 'primary'
  | 'warning'
  | 'info'
  | 'error'
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
      class="relative overflow-hidden bg-linear-to-r from-primary-600 to-primary-700 p-6 md:p-10 text-white shadow-lg rounded-2xl md:rounded-3xl"
    >
      <div class="relative z-10">
        <h1 class="text-2xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight">
          Bienvenido, <span class="opacity-90">{{ userName }}</span>
        </h1>
        <p class="text-primary-100 text-base md:text-xl font-light">
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
    <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      <WelcomeItemComponent
        v-for="item in items"
        :key="item.to"
        :label="item.label"
        :to="item.to"
        :icon="item.icon"
        :description="item.description"
        :color="item.color as WelcomeColor"
      />
    </div>
  </div>
</template>
