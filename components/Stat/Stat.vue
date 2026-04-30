<script setup lang="ts">
import { computed, type Component } from "vue";
import { statVariants, statValueVariants } from "./Stat.variants";
import AliceCard from "../Card/Card.vue";
import AliceText from "../Text/Text.vue";
import AliceIcon from "../Icon/Icon.vue";

defineOptions({ name: "AliceStat" });

interface Props {
  variant?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
  title: string;
  value: string | number;
  icon?: Component;
  interactive?: boolean;
  valueClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "neutral",
  interactive: false,
});

const computedContainerClass = computed(() => {
  return statVariants({ variant: props.variant });
});

const computedValueClass = computed(() => {
  return statValueVariants({ variant: props.variant });
});

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return isNaN(props.value) ? 0 : props.value
  }
  if (!props.value || props.value === 'NaN') {
    return 0
  }
  return props.value
});
</script>

<template>
  <AliceCard :interactive="interactive" :class="computedContainerClass" radius="lg">
    <div class="flex items-center gap-3">
      <AliceIcon v-if="icon" :icon="icon" :variant="variant" size="md" radius="xl" />
      
      <div class="flex flex-col min-w-0">
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
