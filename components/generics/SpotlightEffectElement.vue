<template>
  <span
    ref="container"
    class="absolute top-0 left-0 right-0 bottom-0"
  >
    <span
      ref="spotlight"
      :data-visible="spotlightVisible"
      class="absolute w-1/2 aspect-square rounded-full bg-gray-700 dark:bg-gray-300 opacity-0 data-[visible=true]:opacity-100 blur-3xl transition-opacity duration-200 ease-in-out"
    />
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {get, set, useEventListener, useMouse, watchTriggerable} from "@vueuse/core";
import { gsap } from 'gsap';

const spotlight = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

const { x, y } = useMouse({
  initialValue: { x: 0, y: 0 },
  type: 'client',
});

const spotlightVisible = ref(true);
const inside = ref(false)

const { trigger: update } = watchTriggerable([x, y], () => {
  const containerRect = get(container)?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
  const spotlightRect = get(spotlight)?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
  const spotlightX = get(x) - containerRect.left;
  const spotlightY = get(y) - containerRect.top;

  set(inside, spotlightX > 0 && spotlightX < containerRect.width && spotlightY > 0 && spotlightY < containerRect.height);

  // animate the transition using gsap
  if(get(inside)) {
    gsap.to(get(spotlight), {
      duration: 0.5,
      x: spotlightX - spotlightRect.width / 2,
      y: spotlightY - spotlightRect.height / 2,
      ease: 'power4.out',
    });
  }
});

useEventListener(document, 'scroll', update);
</script>