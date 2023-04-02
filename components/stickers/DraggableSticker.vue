<template>
  <div @mousedown.prevent="activate" :data-active="active" ref="translateEl" class="cursor-grab data-[active=true]:cursor-grabbing data-[active=true]:z-20 data-[active=true]:drop-shadow-lg">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {get, set, useMouse, useMousePressed, whenever} from "@vueuse/core";
import {computed, ref, watch} from "vue";
import gsap from "gsap";
import {clamp} from "~/lib/utils";

const active = ref(false);

const { x: mouseX, y: mouseY } = useMouse();
const { pressed: mousePressed } = useMousePressed()

const startX = ref(0);
const startY = ref(0);

const mouseXOffset = computed(() => get(mouseX) - get(startX) + get(startXOffset));
const mouseYOffset = computed(() => get(mouseY) - get(startY) + get(startYOffset));

const translateEl = ref<HTMLElement>();

const startXOffset = ref(0);
const startYOffset = ref(0);

const lastX = ref(0);
const lastY = ref(0);

const firstTrigger = ref(true);

whenever(() => !get(mousePressed), deactivate);

function activate() {
  set(startXOffset, get(lastX));
  set(startYOffset, get(lastY));
  set(startX, get(mouseX));
  set(startY, get(mouseY));
  set(firstTrigger, true);
  set(active, true);
}

function deactivate() {
  set(active, false);

  if (get(translateEl)) {
    gsap.killTweensOf(get(translateEl)!);

    gsap.to(get(translateEl)!, {
      x: get(lastX),
      y: get(lastY),
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }
}

watch([mouseXOffset, mouseYOffset], ([newXOffset, newYOffset], [oldXOffset]) => {
  if (!get(active) || !get(translateEl)) {
    return;
  }

  // we ignore the trigger so the last position doesn't affect the velocity
  if (get(firstTrigger)) {
    set(firstTrigger, false);
    return;
  }

  set(lastX, newXOffset);
  set(lastY, newYOffset);

  // calculate velocity
  const xVelocity = newXOffset - oldXOffset;

  // calculate rotation based on velocity
  // tilt the sticker slightly in the direction of the mouse
  const rotation = clamp(xVelocity, -45, 45);

  gsap.to(get(translateEl)!, {
    x: newXOffset,
    y: newYOffset,
    rotation,
    duration: 0.3,
    ease: "power2.out",
  });
});
</script>