<template>
  <Card class="bg-gray-50 dark:bg-gray-800 overflow-hidden">
    <div v-if="clockText">
      <div class="p-8 flex flex-col gap-4">
        <h2 class="text-md font-medium text-gray-600 dark:text-gray-100">Time in Germany</h2>
        <h1  class="text-4xl font-bold text-gray-600 dark:text-gray-100">{{ clockText }}</h1>
      </div>
    </div>
    <div v-else class="p-8 flex flex-col gap-4">
      <div class="w-28 h-5 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
      <div class="w-48 h-11 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
    </div>
  </Card>
</template>

<script lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone)
</script>

<script setup lang="ts">
import Card from "~/components/generics/Card.vue";
import {get, useNow} from "@vueuse/core";
import {computed} from "vue";

const now = useNow();

const clockText = computed(() => {
  return dayjs(get(now)).tz("Europe/Berlin").format("HH:mm:ss");
})
</script>