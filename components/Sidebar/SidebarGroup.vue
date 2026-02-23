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
  <div class="px-3 mt-4 mb-2 relative h-4 w-full">
    <!-- Expanded: Title -->
    <div
      class="absolute inset-0 flex items-center px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 select-none transition-all duration-300 origin-left"
      :class="isExpanded ? 'opacity-100' : 'opacity-0 -translate-x-2 pointer-events-none'"
    >
      <span class="truncate">{{ title }}</span>
    </div>

    <!-- Collapsed: Subtle Divider -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px bg-gray-200/50 dark:bg-white/5 w-8 transition-all duration-300"
      :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    ></div>
  </div>
</template>
