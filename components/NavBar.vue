<template>
  <nav class="z-50 fixed bottom-12 left-1/2 -translate-x-1/2 shadow-xl shadow-gray-500/10 dark:shadow-gray-600/10 rounded-full">
    <SpotlightSelector :active-index="activeIndex">
      <slot />
    </SpotlightSelector>
  </nav>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
});
</script>