<template>
  <div class="flex flex-row gap-2 items-center">
    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-bold rounded-lg">{{ type }}</span>
    <span class="text-gray-700 dark:text-gray-400 text-xs font-medium">{{ displayYear }}</span>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";

export default defineNuxtComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },

  computed: {
    displayYear() {
      return dayjs(this.date).format("YYYY");
    }
  }
})
</script>