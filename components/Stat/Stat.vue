<script setup lang="ts">
import { computed, inject, type Component } from "vue";
import { statVariants, statValueVariants } from "./Stat.variants";
import AliceCard from "../Card/Card.vue";
import AliceText from "../Text/Text.vue";
import AliceIcon from "../Icon/Icon.vue";

defineOptions({ name: "AliceStat" });

interface Props {
  variant?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
  title?: string;
  value?: string | number;
  icon?: Component;
  interactive?: boolean;
  valueClass?: string;
  flat?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "neutral",
  title: "",
  value: "",
  interactive: false,
  flat: false,
});

const isParentFlat = inject("alice-stat-flat", false);
const isFlat = computed(() => props.flat || isParentFlat);

const computedContainerClass = computed(() => {
  return statVariants({ variant: props.variant });
});

const computedValueClass = computed(() => {
  return statValueVariants({ variant: props.variant });
});

const displayValue = computed(() => {
  if (typeof props.value === "number") {
    return isNaN(props.value) ? 0 : props.value;
  }
  if (!props.value || props.value === "NaN") {
    return 0;
  }
  return props.value;
});
</script>

<template>
  <!-- Flat Layout inside AliceStatBar -->
  <div v-if="isFlat" class="p-5 flex-1 w-full flex flex-col justify-center min-w-0 transition-colors duration-200" :class="[interactive ? 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5' : '']">
    <div class="flex flex-col items-start sm:flex-row sm:items-center gap-2.5 sm:gap-3">
      <AliceIcon v-if="icon" :icon="icon" :variant="variant" size="md" radius="xl" />
      
      <div class="flex flex-col min-w-0 w-full sm:flex-1">
        <AliceText variant="description" weight="medium" truncate class="leading-tight">
          {{ title }}
        </AliceText>
        <AliceText variant="h3" tag="span" :class="[computedValueClass, valueClass]" weight="bold" class="mt-0.5 tracking-tight">
          {{ displayValue }}
          <AliceText v-if="$slots.suffix" tag="span" variant="caption" weight="bold" class="opacity-60 ml-0.5">
            <slot name="suffix" />
          </AliceText>
        </AliceText>
      </div>
    </div>

    <AliceText v-if="$slots.footer" variant="caption" tag="div" class="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 opacity-70">
      <slot name="footer" />
    </AliceText>
  </div>

  <!-- Standard Card Layout -->
  <AliceCard v-else :interactive="interactive" :class="computedContainerClass" radius="lg">
    <div class="flex flex-col items-start sm:flex-row sm:items-center gap-2.5 sm:gap-3">
      <AliceIcon v-if="icon" :icon="icon" :variant="variant" size="md" radius="xl" />
      
      <div class="flex flex-col min-w-0 w-full sm:flex-1">
        <AliceText variant="description" weight="medium" truncate class="leading-tight">
          {{ title }}
        </AliceText>
        <AliceText variant="h3" tag="span" :class="[computedValueClass, valueClass]" weight="bold" class="mt-0.5 tracking-tight">
          {{ displayValue }}
          <AliceText v-if="$slots.suffix" tag="span" variant="caption" weight="bold" class="opacity-60 ml-0.5">
            <slot name="suffix" />
          </AliceText>
        </AliceText>
      </div>
    </div>

    <AliceText v-if="$slots.footer" variant="caption" tag="div" class="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 opacity-70">
      <slot name="footer" />
    </AliceText>
  </AliceCard>
</template>
