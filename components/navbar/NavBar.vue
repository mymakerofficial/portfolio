<template>
  <nav :data-active="active" class="z-50 fixed bottom-12 left-1/2 -translate-x-1/2 shadow-xl shadow-gray-500/10 dark:shadow-gray-600/10 rounded-full opacity-0 translate-y-4 scale-90 data-[active=true]:opacity-100 data-[active=true]:translate-y-0 data-[active=true]:scale-100 transition-all ease-in-out">
    <SpotlightSelector :active-index="activeIndex">
      <slot />
    </SpotlightSelector>
  </nav>
</template>

<script setup lang="ts">
import SpotlightSelector from "~/components/forms/SpotlightSelector.vue";

defineProps<{
  activeIndex: number;
  active: boolean;
}>();
</script>