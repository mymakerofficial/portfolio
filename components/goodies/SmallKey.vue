<template>
  <span
    @mousedown="pressed = true"
    @mouseup="pressed = false"
    @mouseleave="pressed = false"
    :data-pressed="pressed"
    class="px-2 py-0.5 flex items-center text-sm font-medium text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300/20 dark:border-gray-600/20 data-[pressed=true]:border-transparent data-[pressed=true]:translate-y-1 rounded-lg select-none cursor-pointer transition-all ease-in-out duration-75"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import {useMagicKeys} from "@vueuse/core";
import {ref, watch} from "vue";

const props = defineProps({
  keyCode: String
});

let pressed = ref(false);

const { current } = useMagicKeys()

watch(
  () => props.keyCode && current.has(props.keyCode),
  (v) => pressed.value = Boolean(v),
)
</script>
