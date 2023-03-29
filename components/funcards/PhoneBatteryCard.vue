<template>
  <Card class="fun-card border border-gray-100/80 dark:border-gray-800/80 overflow-hidden duration-500 ease-in-out">
    <div v-if="data" class="bg-gradient-to-r dark:from-gray-800/20">
      <div class="absolute h-full bg-gradient-to-l from-gray-100/80 dark:from-gray-800/60" :style="{ width: `${ data.batteryLevel }%` }" />
      <div class="p-8 flex flex-col gap-4">
        <h2 class="text-md font-medium text-gray-600 dark:text-gray-100">Phone Battery</h2>
        <h1 class="text-4xl font-bold text-gray-600 dark:text-gray-100">{{ data.batteryLevel !== null ? `${data.batteryLevel}%` : "N/A" }}</h1>
      </div>
    </div>
    <div v-else class="p-8 flex flex-col gap-4">
      <div class="w-28 h-5 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
      <div class="w-16 h-11 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import {PhoneBatteryResponse} from "~/server/api/v1/fun/phone_battery";
import Card from "~/components/generics/Card.vue";

defineProps<{
  data: PhoneBatteryResponse
}>();
</script>
