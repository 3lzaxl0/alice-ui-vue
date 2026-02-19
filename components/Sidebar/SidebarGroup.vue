<script setup lang="ts">
import { inject } from 'vue'

defineOptions({
  name: 'AliceSidebarGroup',
})

defineProps<{
  title: string
}>()

const isExpanded = inject('alice-sidebar-expanded', { value: false })
</script>

<template>
  <div class="px-3 mt-4 mb-2">
    <!-- Expanded: Title -->
    <div
      v-if="isExpanded"
      class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 px-3 select-none transition-all duration-300"
    >
      {{ title }}
    </div>

    <!-- Collapsed: Subtle Divider -->
    <div
      v-else
      class="h-px bg-gray-200/50 dark:bg-white/5 w-8 mx-auto transition-all duration-300"
    ></div>
  </div>
</template>
