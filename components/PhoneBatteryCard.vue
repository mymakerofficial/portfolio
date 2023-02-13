<template>
  <Card class="shadow-gray-500/10 dark:shadow-gray-600/10 bg-gray-50 dark:bg-gray-800 overflow-hidden">
    <div v-if="data">
      <div class="absolute h-full bg-gray-200/30 dark:bg-gray-400/10" :style="{ width: `${ data.batteryLevel }%` }" />
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

defineProps<{
  data: PhoneBatteryResponse
}>();
</script>
