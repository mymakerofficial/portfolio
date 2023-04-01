<template>
  <div @mousedown.prevent="activate" :data-active="active" ref="translateEl" class="cursor-grab data-[active=true]:cursor-grabbing">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {get, set, useMouse, useMousePressed, whenever} from "@vueuse/core";
import {computed, ref, watch} from "vue";
import gsap from "gsap";

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

whenever(() => !get(mousePressed), deactivate);

function activate() {
  set(startXOffset, get(lastX));
  set(startYOffset, get(lastY));
  set(startX, get(mouseX));
  set(startY, get(mouseY));
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

watch([mouseXOffset, mouseYOffset], (_, [oldXOffset]) => {
  if (get(active) && get(translateEl)) {
    const x = get(mouseXOffset);
    const y = get(mouseYOffset);

    set(lastX, x);
    set(lastY, y);

    // calculate velocity
    const xVelocity = (get(mouseXOffset) - oldXOffset) / 0.1;

    // calculate rotation based on velocity
    // tilt the sticker slightly in the direction of the mouse
    const rotation = Math.min(Math.max(xVelocity / 10, -45), 45);

    gsap.to(get(translateEl)!, {
      x,
      y,
      rotation,
      duration: 0.3,
      ease: "power2.out",
    });
  }
});
</script>