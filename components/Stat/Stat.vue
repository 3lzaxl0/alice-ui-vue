<script setup lang="ts">
import { computed, type Component } from "vue";
import { statVariants, statIconVariants, statValueVariants } from "./Stat.variants";
import AliceCard from "../Card/Card.vue";
import AliceText from "../Text/Text.vue";

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


const computedIconClass = computed(() => {
  return statIconVariants({ variant: props.variant });
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
  <AliceCard :interactive="interactive" :class="computedContainerClass">
    <div class="flex items-center justify-between mb-2">
      <AliceText variant="subtitle">{{ title }}</AliceText>
      <div v-if="icon" :class="computedIconClass">
        <component :is="icon" :size="20" />
      </div>
    </div>

    <AliceText variant="h3" tag="span" :class="[computedValueClass, valueClass]">
      {{ displayValue }}
      <AliceText v-if="$slots.suffix" tag="span" variant="caption" weight="bold" class="opacity-60 ml-0.5">
        <slot name="suffix" />
      </AliceText>
    </AliceText>

    <AliceText v-if="$slots.footer" variant="caption" tag="div" class="mt-1 opacity-70">
      <slot name="footer" />
    </AliceText>
  </AliceCard>
</template>
