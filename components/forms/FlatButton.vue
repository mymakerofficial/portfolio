<template>
  <GenericButton
    class="relative inline-block rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 duration-500 ease-in-out"
  >
    <ClientOnly>
      <SpotlightEffectElement class="opacity-10" />
    </ClientOnly>
    <span class="h-12 px-6 inline-flex justify-center items-center gap-2 text-md font-medium text-gray-900 dark:text-gray-100">
      <slot />
    </span>
  </GenericButton>
</template>

<script setup lang="ts">
import SpotlightEffectElement from "~/components/generics/SpotlightEffectElement.vue";
import GenericButton from "~/components/forms/GenericButton.vue";
</script>