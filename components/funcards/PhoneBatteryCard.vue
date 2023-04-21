<template>
  <Card class="fun-card bg-gradient-to-r dark:from-gray-800/20">
    <div class="absolute h-full bg-gradient-to-l from-gray-200/60 dark:from-gray-700/60" :style="{ width: `${ data.batteryLevel }%` }" />
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-md font-medium text-gray900 dark:text-gray-100">Phone Battery</h2>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">{{ data.batteryLevel !== null ? `${data.batteryLevel}%` : "N/A" }}</h1>
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
