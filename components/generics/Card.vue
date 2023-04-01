<template>
  <component
    :is="is || 'article'"
    class="group/card relative rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-[background-color] duration-500 ease-in-out"
    :class="{ 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': hoverable }"
  >
    <ClientOnly class="absolute">
      <SpotlightEffectElement class="opacity-5 group-hover/card:opacity-10 duration-500 ease-in-out" v-if="hoverable" />
    </ClientOnly>
    <slot />
  </component>
</template>

<script setup lang="ts">
import SpotlightEffectElement from "~/components/generics/SpotlightEffectElement.vue";

defineProps<{
  hoverable?: boolean;
  is?: string;
}>();
</script>