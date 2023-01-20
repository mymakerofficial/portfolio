<template>
  <div class="flex flex-row" v-if="!hide">
    <div class="flex-1 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-xl shadow-gray-500/10 dark:shadow-gray-600/10 overflow-hidden">
      <div v-if="battery">
        <div class="absolute h-full bg-gray-200/30 dark:bg-gray-400/10" :style="{ width: `${ battery.batteryLevel }%` }" />
        <div class="p-8 flex flex-col gap-4">
          <h2 class="text-md font-medium text-gray-600 dark:text-gray-100">Phone Battery</h2>
          <h1 class="text-4xl font-bold text-gray-600 dark:text-gray-100">{{ battery.batteryLevel !== null ? `${battery.batteryLevel}%` : "N/A" }}</h1>
        </div>
      </div>
      <div v-else class="p-8 flex flex-col gap-4">
        <div class="w-28 h-5 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
        <div class="w-16 h-11 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
      </div>
    </div>
    <div class="flex items-center">
      <div class="w-6 h-14 rounded-r-xl bg-gray-50 dark:bg-gray-800" />
    </div>
  </div>
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
    hide() {
      if (!this.battery) {
        return false;
      }
      return this.battery.batteryLevel === null;
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
