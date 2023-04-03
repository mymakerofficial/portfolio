<template>
  <Card class="fun-card p-8 flex flex-col gap-4">
    <h2 class="text-md font-medium text-gray-600 dark:text-gray-100">Time in Germany</h2>
    <h1  class="text-4xl font-bold text-gray-600 dark:text-gray-100">{{ clockText }}</h1>
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

const clockText = computed(() => dayjs(get(useNow())).tz("Europe/Berlin").format("HH:mm:ss"))
</script>