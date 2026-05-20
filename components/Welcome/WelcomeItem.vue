<script setup lang="ts">
import { type Component } from 'vue'
import {
  welcomeCardVariants,
  welcomeIconVariants,
  welcomeTitleVariants,
} from './Welcome.variants'

defineOptions({
  name: 'AliceWelcomeItem',
})

// Define accepted colors for type safety
type WelcomeColor =
  | 'success'
  | 'primary'
  | 'warning'
  | 'info'
  | 'error'
  | 'default'

defineProps<{
  label: string
  to: string
  icon: Component
  description?: string
  color?: WelcomeColor
}>()
</script>

<template>
  <RouterLink
    :to="to"
    :class="welcomeCardVariants({ color })"
  >
    <div class="flex flex-col h-full gap-3 md:gap-4">
      <!-- Icon Container -->
      <div :class="welcomeIconVariants({ color })">
        <component :is="icon" class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" stroke-width="2" />
      </div>

      <!-- Content -->
      <div>
        <h3 :class="welcomeTitleVariants({ color })">
          {{ label }}
        </h3>
        <p
          v-if="description"
          class="hidden sm:block text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </RouterLink>
</template>
