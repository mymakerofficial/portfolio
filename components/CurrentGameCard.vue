<template>
  <a :href="playing?.steamUrl" target="_blank">
    <Card class="p-8 shadow-slate-500/10 bg-slate-50">
      <div v-if="playing">
        <div class="flex flex-col gap-4">
          <div>
            <h1 class="text-md text-slate-700 font-bold">{{ playing.state === 'idle' ? "Last played" : "Currently playing" }}</h1>
          </div>
          <div class="flex flex-col lg:flex-row gap-4">
            <div v-if="playing.headerImageUrl" class="w-48 aspect-[92/43] overflow-hidden">
              <img :alt="playing.gameName" :src="playing.headerImageUrl" class="absolute w-full h-full z-10" />
              <div class="absolute w-full h-full bg-slate-700/20 animate-pulse" />
            </div>
            <div class="flex flex-col gap-2 justify-between">
              <div class="flex flex-col gap-2">
                <h1 class="text-md text-slate-700 font-bold">{{ playing.gameName }}</h1>
                <p v-if="playing.developers !== null" class="text-sm text-slate-600">{{ playing.developers.join(', ') }}</p>
                <p v-if="playing.publishers !== null" class="text-sm text-slate-600">{{ playing.publishers.join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col gap-4">
          <div>
            <div class="w-28 h-4 bg-slate-700/20 animate-pulse rounded-md" />
          </div>
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="w-48 aspect-[92/43] bg-slate-700/20 animate-pulse" />
            <div class="flex-1 flex flex-col gap-2 justify-between">
              <div class="flex flex-col gap-4">
                <div class="w-28 h-4 bg-slate-700/20 animate-pulse rounded-md" />
                <div class="w-16 h-4 bg-slate-700/20 animate-pulse rounded-md" />
                <div class="w-20 h-4 bg-slate-700/20 animate-pulse rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </a>
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