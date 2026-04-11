<script setup lang="ts">
import { type Component, computed } from 'vue'
import AliceBadge from '../Badge/Badge.vue'
import AliceText from '../Text/Text.vue'
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
    /** Whether to show a divider at the bottom (except for the last item) */
    divider?: boolean
  }>(),
  {
    badgeVariant: 'default',
    variant: 'default',
    interactive: false,
    loading: false,
    divider: false
  }
)

const variantClasses = {
  success: 'bg-success-50 dark:bg-success-500/10 text-success-600',
  error: 'bg-error-50 dark:bg-error-500/10 text-error-600',
  info: 'bg-info-50 dark:bg-info-500/10 text-info-600',
  warning: 'bg-warning-50 dark:bg-warning-500/10 text-warning-600',
  default: 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'
}

const amountVariantClasses = {
  success: 'text-success-600',
  error: 'text-error-600',
  info: 'text-info-600',
  warning: 'text-warning-600',
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
      loading ? 'opacity-50 pointer-events-none' : '',
      divider ? 'border-b border-gray-100 dark:border-white/5 last:border-b-0' : ''
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
        <AliceText tag="p" weight="bold" class="truncate leading-tight">
          <slot name="title">{{ title }}</slot>
        </AliceText>
        <div class="flex items-center gap-2 mt-0.5">
          <AliceText v-if="subtitle || $slots.subtitle" tag="span" variant="label" class="text-[10px]! truncate">
            <slot name="subtitle">{{ subtitle }}</slot>
          </AliceText>
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
        <AliceText
          v-if="amount !== undefined"
          tag="span"
          weight="black"
          class="text-sm tabular-nums"
          :class="[amountClass || amountColorClass]"
        >
          {{ amount }}
        </AliceText>
      </slot>
    </div>
  </div>
</template>
