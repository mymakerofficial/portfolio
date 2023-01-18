<template>
  <Card :class="`shadow-${color}-500/10 bg-${color}-50 overflow-hidden`">
    <div v-if="battery">
      <div :class="`absolute h-full bg-${color}-200/50`" :style="{ width: `${ battery.batteryLevel }%` }" />
      <div class="p-8 flex flex-col gap-4">
        <h2 :class="`text-md font-medium text-${color}-900`">Phone Battery</h2>
        <h1  :class="`text-4xl font-bold text-${color}-900`">{{ battery.batteryLevel }}%</h1>
      </div>
    </div>
    <div v-else class="p-8 flex flex-col gap-4">
      <div class="w-28 h-5 bg-blue-900/20 animate-pulse rounded-md" />
      <div class="w-16 h-11 bg-blue-900/20 animate-pulse rounded-md" />
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
