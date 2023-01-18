<template>
  <Card>
    <div v-if="playing" class="flex flex-col lg:flex-row gap-4">
      <div class="flex flex-col gap-4">
        <div>
          <h1 class="text-md text-neutral-700 font-bold">{{ playing.state === 'idle' ? "Last played" : "Currently playing" }}</h1>
        </div>
        <div class="flex flex-col lg:flex-row gap-4">
          <div v-if="playing.headerImageUrl">
            <img :alt="playing.gameName" :src="playing.headerImageUrl" class="h-28" />
          </div>
          <div class="flex flex-col gap-2 justify-between">
            <div class="flex flex-col gap-2">
              <h1 class="text-md text-neutral-700 font-bold">{{ playing.gameName }}</h1>
              <p v-if="playing.developers !== null" class="text-sm text-neutral-600">{{ playing.developers.join(', ') }}</p>
              <p v-if="playing.publishers !== null" class="text-sm text-neutral-600">{{ playing.publishers.join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="ml-auto flex flex-row-reverse w-full lg:w-auto lg:flex-col items-end gap-4 justify-end" v-if="playing.contentProvider">
        <div v-if="playing.steamUrl">
          <a :href="playing?.steamUrl" target="_blank" class="text-md font-medium text-neutral-800 border-2 border-b-4 border-r-4 border-neutral-800 px-2 py-0.5 rounded-lg">view on {{ playing.contentProvider }}</a>
        </div>
      </div>
    </div>
    <div v-else class="animate-pulse bg-neutral-200 w-full h-28"></div>
  </Card>
</template>

<script lang="ts">
import {CurrentlyPlayingResponse} from "~/server/api/v1/fun/currently_playing";

export default defineNuxtComponent({
  data() {
    return {
      playing: null as CurrentlyPlayingResponse | null,
    }
  },

  methods: {
    async fetchData() {
      this.playing = (await useFetch<CurrentlyPlayingResponse>("/api/v1/fun/currently_playing")).data as unknown as CurrentlyPlayingResponse;
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    })
  }
})
</script>