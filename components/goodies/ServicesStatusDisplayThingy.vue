<template>
  <div v-if="!data" class="flex flex-row gap-4 items-center">
    <span class="block w-2 h-2 rounded-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
    <span class="w-44 h-4 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
  </div>
  <div v-else class="flex flex-row gap-4 items-center">
    <span :data-color="data?.available ? 'green' : 'red'" class="block w-2 h-2 rounded-full data-[color=green]:bg-green-200 data-[color=red]:bg-red-400 shadow data-[color=green]:shadow-green-200 data-[color=red]:red-400" />
    <p class="text-gray-300 dark:text-gray-600 text-sm font-medium">{{ data?.available ? "All systems operating normally" : "Some systems are offline" }}</p>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/v1/services_status');
</script>