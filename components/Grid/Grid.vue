<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "AliceGrid" });

interface Props {
  cols?: string | number; // Default columns: 1 to 12
  smCols?: string | number;
  mdCols?: string | number;
  lgCols?: string | number;
  xlCols?: string | number;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  itemsAlign?: "start" | "center" | "end" | "stretch";
  autoFitMin?: string; // e.g. '240px'
}

const props = withDefaults(defineProps<Props>(), {
  cols: 1,
  gap: "md",
  itemsAlign: "stretch",
});

const gapClass = computed(() => {
  const map: Record<string, string> = {
    none: "gap-0",
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  };
  return map[props.gap] || "gap-6";
});

const alignClass = computed(() => {
  const map: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };
  return map[props.itemsAlign] || "items-stretch";
});

const responsiveCols = computed(() => {
  if (props.autoFitMin) return ""; // Ignorado si se usa auto-fit

  const classes = [`grid-cols-${props.cols}`];

  if (props.smCols) classes.push(`sm:grid-cols-${props.smCols}`);
  if (props.mdCols) classes.push(`md:grid-cols-${props.mdCols}`);
  if (props.lgCols) classes.push(`lg:grid-cols-${props.lgCols}`);
  if (props.xlCols) classes.push(`xl:grid-cols-${props.xlCols}`);

  return classes.join(" ");
});

const gridStyle = computed(() => {
  if (props.autoFitMin) {
    return {
      gridTemplateColumns: `repeat(auto-fit, minmax(${props.autoFitMin}, 1fr))`
    }
  }
  return {}
});
</script>

<template>
  <div
    class="grid w-full"
    :class="[responsiveCols, gapClass, alignClass]"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
}
</style>
