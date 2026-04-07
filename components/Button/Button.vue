<script setup lang="ts">
import { computed, type Component } from "vue";
import { Loader2 } from "lucide-vue-next";
import { buttonVariants } from "./Button.variants";
import type { VariantProps } from "class-variance-authority";

defineOptions({
  name: "AliceButton",
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface Props {
  variant?: ButtonVariantProps["variant"];
  design?: ButtonVariantProps["design"];
  size?: ButtonVariantProps["size"];
  radius?: ButtonVariantProps["radius"];
  /** @deprecated use radius instead */
  rounded?: boolean;
  expanded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: Component | object; // Component
  iconSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  design: "solid",
  size: "md",
  radius: undefined,
  rounded: false,
  expanded: false,
  loading: false,
  disabled: false,
  type: "button",
  iconSize: 20,
});

const computedClass = computed(() => {
  return [
    buttonVariants({
      variant: props.variant,
      design: props.design,
      size: props.size,
      radius: props.radius,
      // Fallback for deprecated rounded prop if radius is not set
      rounded: props.radius === undefined ? props.rounded : undefined,
    }),
    props.expanded ? "w-full h-full" : "",
  ];
});
</script>

<template>
  <button :type="type" :class="computedClass" :disabled="disabled || loading">
    <!-- Loading Spinner -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <Loader2 class="animate-spin" :size="20" />
    </div>

    <!-- Content (Inner scaling for Zen Browser effect) -->
    <div
      :class="{ 'opacity-0': loading }"
      class="flex items-center justify-center gap-2 w-full transition-transform duration-300 ease-out group-hover:scale-[1.04] group-active:scale-[0.97] transform-gpu backface-hidden antialiased"
    >
      <component :is="icon" v-if="icon" :size="iconSize" class="shrink-0" />
      <span v-if="$slots.default" class="truncate"><slot /></span>
    </div>
  </button>
</template>
