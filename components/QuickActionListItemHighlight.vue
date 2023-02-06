<template>
  <div ref="highlight" class="absolute w-full px-1.5">
    <div :data-active="active" class="relative h-full w-full bg-gray-100 dark:bg-gray-700 opacity-0 data-[active=true]:opacity-100 transition-opacity duration-500 ease-in-out rounded-lg" />
  </div>
</template>
<script setup lang="ts">
import {get, useResizeObserver} from "@vueuse/core";
import gsap from "gsap";

const props = defineProps<{
  activeElement: HTMLElement | null;
}>()

const highlight = ref();

const active = computed(() => {
  return get(props.activeElement) !== null;
})

watch(() => props.activeElement, () => moveHighlight())

onMounted(() => {
  useResizeObserver(() => get(highlight).parentElement, () => moveHighlight());
})

const moveHighlight = () => {
  if (!get(highlight)) return;
  if (!props.activeElement) return;

  const elementRect = get(props.activeElement).getBoundingClientRect();
  const parentRect = get(highlight).parentElement.getBoundingClientRect()

  // use gsap to animate the highlight
  gsap.to(get(highlight), {
    duration: 0.1,
    y: elementRect.top - parentRect.top,
    height: elementRect.height,
    ease: "power2.inOut"
  })
}
</script>