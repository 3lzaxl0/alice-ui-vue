<script setup lang="ts">
import { computed } from "vue";
import { statVariants, statTitleVariants } from "./Stat.variants";
import type { VariantProps } from "class-variance-authority";

defineOptions({ name: "AliceStat" });

type StatVariantProps = VariantProps<typeof statVariants>;

interface Props {
  variant?: StatVariantProps["variant"];
  title: string;
  value: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "neutral",
});

const computedContainerClass = computed(() => {
  return statVariants({ variant: props.variant });
});

const computedTitleClass = computed(() => {
  return statTitleVariants({ variant: props.variant });
});
</script>

<template>
  <div :class="computedContainerClass">
    <p :class="computedTitleClass">{{ title }}</p>
    <p class="text-2xl font-black text-slate-900 dark:text-white">
      {{ value }}
      <span v-if="$slots.suffix" class="text-sm font-bold opacity-60 ml-0.5">
        <slot name="suffix" />
      </span>
    </p>
    <div v-if="$slots.footer" class="mt-1 text-xs opacity-70">
      <slot name="footer" />
    </div>
  </div>
</template>
