<script setup lang="ts">
import { type Component, computed } from 'vue'
import AliceBadge from '../Badge/Badge.vue'

defineOptions({ name: 'AliceActivityItem' })

const props = withDefaults(
  defineProps<{
    /** Icon component to display */
    icon?: Component
    /** Title of the activity */
    title: string
    /** Subtitle or date of the activity */
    subtitle?: string
    /** Label for the status badge */
    badgeLabel?: string
    /** Variant for the AliceBadge */
    badgeVariant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'indigo' | 'purple' | 'pink' | 'cyan' | 'emerald' | 'amber' | 'blue' | 'violet' | 'teal'
    /** Amount or value to display on the right */
    amount?: string | number
    /** CSS class for the amount text */
    amountClass?: string
    /** Visual variant for the icon container and amount */
    variant?: 'success' | 'error' | 'info' | 'warning' | 'default'
    /** Whether the item is clickable */
    interactive?: boolean
    /** Loading state */
    loading?: boolean
  }>(),
  {
    badgeVariant: 'default',
    variant: 'default',
    interactive: false,
    loading: false
  }
)

const variantClasses = {
  success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600',
  error: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600',
  info: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
  warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600',
  default: 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'
}

const amountVariantClasses = {
  success: 'text-emerald-600',
  error: 'text-rose-600',
  info: 'text-blue-600',
  warning: 'text-amber-600',
  default: 'text-slate-900 dark:text-white'
}

const iconContainerClass = computed(() => variantClasses[props.variant])
const amountColorClass = computed(() => amountVariantClasses[props.variant])
</script>

<template>
  <div
    class="py-4 flex items-center justify-between group transition-colors px-2 rounded-alice-lg"
    :class="[
      interactive ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-white/5 active:scale-[0.98]' : '',
      loading ? 'opacity-50 pointer-events-none' : ''
    ]"
  >
    <div class="flex items-center gap-4 min-w-0">
      <!-- Icon Container -->
      <div 
        v-if="icon || $slots.icon"
        class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
        :class="iconContainerClass"
      >
        <slot name="icon">
          <component :is="icon" v-if="icon" :size="18" />
        </slot>
      </div>

      <!-- Text Content -->
      <div class="min-w-0 flex flex-col justify-center">
        <p class="font-bold text-slate-900 dark:text-white truncate leading-tight">
          <slot name="title">{{ title }}</slot>
        </p>
        <div class="flex items-center gap-2 mt-0.5">
          <span v-if="subtitle || $slots.subtitle" class="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider truncate">
            <slot name="subtitle">{{ subtitle }}</slot>
          </span>
          <AliceBadge 
            v-if="badgeLabel" 
            :variant="badgeVariant" 
            type="soft" 
            :label="badgeLabel" 
            class="text-[8px] h-4" 
          />
        </div>
      </div>
    </div>

    <!-- Trailing Content -->
    <div class="flex items-center gap-3 shrink-0">
      <slot name="trailing">
        <span 
          v-if="amount !== undefined"
          class="font-black text-sm tabular-nums"
          :class="[amountClass || amountColorClass]"
        >
          {{ amount }}
        </span>
      </slot>
    </div>
  </div>
</template>
