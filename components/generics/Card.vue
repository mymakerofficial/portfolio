<template>
  <component
    :is="is || $attrs.href ? 'a' : $attrs.to ? NuxtLink : 'article'"
    class="group/card rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden duration-500 ease-in-out"
    :class="{ 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': hoverable }"
  >
    <ClientOnly v-if="hoverable">
      <SpotlightEffectElement class="opacity-5 group-hover/card:opacity-10 duration-500 ease-in-out" />
    </ClientOnly>
    <slot />
  </component>
</template>

<script setup lang="ts">
import SpotlightEffectElement from "~/components/generics/SpotlightEffectElement.vue";
import {NuxtLink} from "#components";

defineProps<{
  hoverable?: boolean;
  is?: string;
}>();
</script>