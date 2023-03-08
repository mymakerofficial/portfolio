<template>
  <span
    ref="container"
    class="absolute top-0 left-0 right-0 bottom-0"
    @mousemove="onMouseMove"
  >
    <span
      ref="spotlight"
      :data-visible="spotlightVisible"
      class="absolute h-1/2 aspect-square rounded-full bg-gray-700 dark:bg-white opacity-0 data-[visible=true]:opacity-100 blur-2xl transition-opacity"
    />
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {get, useMouse} from "@vueuse/core";
import { gsap } from 'gsap';

const spotlight = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

const { x, y } = useMouse({
  initialValue: { x: 0, y: 0 },
  type: 'client',
});

const spotlightVisible = ref(true);

watch([x, y], () => {
  const containerRect = container.value?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
  const spotlightRect = spotlight.value?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
  const spotlightX = get(x) - containerRect.left - spotlightRect.width / 2;
  const spotlightY = get(y) - containerRect.top - spotlightRect.height / 2;

  // animate the transition using gsap
  gsap.to(spotlight.value, {
    duration: 0.5,
    x: spotlightX,
    y: spotlightY,
    ease: 'power4.out',
  });
});
</script>