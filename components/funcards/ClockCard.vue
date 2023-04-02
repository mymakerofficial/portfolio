<template>
  <Card class="fun-card p-8 flex flex-col gap-4">
    <h2 class="text-md font-medium text-gray-600 dark:text-gray-100">Time in Germany</h2>
    <h1  class="text-4xl font-bold text-gray-600 dark:text-gray-100">{{ clockText }}</h1>
  </Card>
</template>

<script setup lang="ts">
import Card from "~/components/generics/Card.vue";
import {useDateFormat, useNow} from "@vueuse/core";

const clockText = useDateFormat(useNow(), "HH:mm:ss");
</script>