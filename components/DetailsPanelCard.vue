<template>
  <div class="rounded-xl bg-gray-50 dark:bg-gray-800 p-8 md:p-12 flex flex-col gap-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100" v-if="title">{{ title }}</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>