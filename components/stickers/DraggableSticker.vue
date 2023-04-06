<template>
  <div
    @mousedown.prevent="activate"
    :data-active="active"
    ref="translateEl"
    class="cursor-grab data-[active=true]:cursor-grabbing data-[active=true]:z-20 drop-shadow-md data-[active=true]:drop-shadow-lg"
  >
    <ClientOnly>
      <slot />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {get, set, useMouse, useMousePressed, whenever} from "@vueuse/core";
import {computed, onMounted, ref, watch} from "vue";
import gsap from "gsap";
import {clamp, randomBetween} from "~/lib/utils";

const props = withDefaults(defineProps<{
  rotation?: number
  rotationRandomize?: number
  xRandomize?: number
  yRandomize?: number
}>(), {
  rotation: 0,
  rotationRandomize: 10,
  xRandomize: 10,
  yRandomize: 10
});

/***
 * active is true when the element is being dragged
 */
const active = ref(false);

const { x: mouseX, y: mouseY } = useMouse();
const { pressed: mousePressed } = useMousePressed()

/***
 * originX is the start x offset position of the element
 */
const originX = ref(0);
/***
 * originY is the start y offset position of the element
 */
const originY = ref(0);
/***
 * originRotation is the start rotation of the element
 */
const originRotation = ref(0);

/***
 * startX is the x position of the mouse when the element is clicked
 */
const startX = ref(0);
/***
 * startY is the y position of the mouse when the element is clicked
 */
const startY = ref(0);

/***
 * mouseXOffset is the x offset of the mouse position relative to the start position
 */
const mouseXOffset = computed(() => get(mouseX) - get(startX) + get(startXOffset));
/***
 * mouseYOffset is the y offset of the mouse position relative to the start position
 */
const mouseYOffset = computed(() => get(mouseY) - get(startY) + get(startYOffset));

const translateEl = ref<HTMLElement>();

/***
 * startXOffset is the x offset of the element when the element is clicked
 */
const startXOffset = ref(0);
/***
 * startYOffset is the y offset of the element when the element is clicked
 */
const startYOffset = ref(0);

/***
 * lastX is the last x position of the element (used for calculating the offset after the element is dragged and clicked again)
 */
const lastX = ref(0);
/***
 * lastY is the last y position of the element (used for calculating the offset after the element is dragged and clicked again)
 */
const lastY = ref(0);

/***
 * firstTrigger is true during the first trigger of the watch function after the element is clicked
 */
const firstTrigger = ref(true);

onMounted(() => {
  if (!get(translateEl)) return;

  const { rotation, rotationRandomize, xRandomize, yRandomize } = props;

  set(originX, randomBetween(-xRandomize, xRandomize));
  set(originY, randomBetween(-yRandomize, yRandomize));
  set(originRotation, rotation + randomBetween(-rotationRandomize, rotationRandomize));

  set(lastX, get(originX));
  set(lastY, get(originY));

  gsap.set(get(translateEl)!, {
    x: get(originX),
    y: get(originY),
    rotation: get(originRotation),
  });
})

// if the mouse is released, deactivate the element
// whenever acts like an event listener in this case, we cant just use the mouseup event because the mouse might be released outside of the element
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

  if (!get(translateEl)) return;

  gsap.killTweensOf(get(translateEl)!);

  gsap.to(get(translateEl)!, {
    x: get(lastX),
    y: get(lastY),
    rotation: get(originRotation),
    duration: 0.3,
    ease: "power2.out",
  });
}

watch([mouseXOffset, mouseYOffset], ([newXOffset, newYOffset], [oldXOffset]) => {
  if (!get(active) || !get(translateEl)) return;

  // we ignore the trigger so the last position doesn't affect the velocity
  if (get(firstTrigger)) {
    set(firstTrigger, false);
    return;
  }

  const { rotation: originRotation } = props;

  set(lastX, newXOffset);
  set(lastY, newYOffset);

  // calculate velocity
  const xVelocity = newXOffset - oldXOffset;

  // calculate rotation based on velocity
  // tilt the sticker slightly in the direction of the mouse
  const rotation = clamp(xVelocity + originRotation, -45, 45);

  gsap.to(get(translateEl)!, {
    x: newXOffset,
    y: newYOffset,
    rotation,
    duration: 0.3,
    ease: "power2.out",
  });
});
</script>