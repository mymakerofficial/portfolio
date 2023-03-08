<template>
  <div class="flex flex-col gap-4 sm:gap-2">
    <p class="text-md sm:text-xs font-medium text-gray-500">{{ title }}</p>
    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  text: string;
}>();
</script>