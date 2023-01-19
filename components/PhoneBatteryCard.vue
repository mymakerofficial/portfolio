<template>
  <Card class="shadow-blue-500/10 dark:shadow-blue-500/10 bg-blue-50 dark:bg-blue-800 overflow-hidden">
    <div v-if="battery">
      <div class="absolute h-full bg-blue-200/30 dark:bg-blue-200/10" :style="{ width: `${ battery.batteryLevel }%` }" />
      <div class="p-8 flex flex-col gap-4">
        <h2 class="text-md font-medium text-blue-600 dark:text-blue-100">Phone Battery</h2>
        <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-100">{{ battery.batteryLevel !== null ? `${battery.batteryLevel}%` : "N/A" }}</h1>
      </div>
    </div>
    <div v-else class="p-8 flex flex-col gap-4">
      <div class="w-28 h-5 bg-blue-600/20 dark:bg-blue-100/20 animate-pulse rounded-md" />
      <div class="w-16 h-11 bg-blue-600/20 dark:bg-blue-100/20 animate-pulse rounded-md" />
    </div>
  </Card>
</template>

<script lang="ts">
import {PhoneBatteryResponse} from "~/server/api/v1/fun/phone_battery";

export default defineNuxtComponent({
  data() {
    return {
      battery: null as PhoneBatteryResponse | null,
    }
  },

  computed: {
    color() {
      if(!this.battery?.batteryLevel) return "blue";

      if (this.battery?.batteryLevel > 75) {
        return "green";
      } else if (this.battery?.batteryLevel > 25) {
        return "blue";
      } else {
        return "red";
      }
    }
  },

  methods: {
    async fetchData() {
      this.battery = (await useFetch<PhoneBatteryResponse>("/api/v1/fun/phone_battery")).data as unknown as PhoneBatteryResponse;
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    })
  }
})
</script>
