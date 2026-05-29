<script setup lang="ts">
import { inject, computed } from 'vue'

defineOptions({ name: 'AliceCarouselItem' })

const minWidth = inject('carouselItemMinWidth', computed(() => 280))
</script>

<template>
  <div
    class="scroll-snap-align-start shrink-0"
    :style="{ minWidth: `${minWidth}px` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-snap-align-start {
  scroll-snap-align: start;
}
</style>
