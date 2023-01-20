<template>
  <div class="p-8 flex flex-col gap-4 border-b-2 last:border-b-0 border-white dark:border-gray-900">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ title }}</h1>
    <slot />
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>