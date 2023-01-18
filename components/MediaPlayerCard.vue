<template>
  <a :href="listening?.shareUrl" target="_blank">
    <Card>
      <div v-if="listening" class="flex flex-col lg:flex-row gap-4">
        <div v-if="listening.albumArtUrl">
          <img :alt="listening.albumName" :src="listening.albumArtUrl" class="w-28 h-28" />
        </div>
        <div v-if="listening.state === 'idle' || !listening.state">
          <h1 class="text-md text-neutral-700 font-bold">Not listening to anything at the moment</h1>
        </div>
        <div v-else class="flex-1 flex flex-col gap-2 justify-between">
          <div class="flex flex-col gap-2">
            <h1 class="text-md text-neutral-700 font-bold">{{listening.trackTitle}}</h1>
            <p class="text-sm text-neutral-600">{{listening.artistName}}</p>
            <p class="text-sm text-neutral-600">{{listening.albumName}}</p>
          </div>
          <div>
            <div class="h-1 w-full bg-neutral-100 rounded-full overflow-hidden"><div class="h-full bg-neutral-900 transition-[width] duration-1000" :style="{ width: `${(playbackPosition / listening.playbackDuration) * 100}%` }"></div></div>
          </div>
        </div>
        <div class="flex flex-row-reverse w-full lg:w-auto lg:flex-col items-end gap-4 justify-between" v-if="listening.contentProvider">
          <img v-if="listening.contentProvider === 'spotify'" alt="Spotify" src="~/assets/img/Spotify_Icon_RGB_Green.png" class="h-6" />
        </div>
      </div>
      <div v-else class="flex flex-col lg:flex-row gap-4">
        <div class="w-28 h-28 bg-neutral-200 animate-pulse" />
        <div class="flex-1 flex flex-col gap-2 justify-between">
          <div class="flex flex-col gap-2">
            <div class="w-28 h-4 bg-neutral-200 animate-pulse rounded-md" />
            <div class="w-16 h-4 bg-neutral-200 animate-pulse rounded-md" />
            <div class="w-20 h-4 bg-neutral-200 animate-pulse rounded-md" />
          </div>
          <div>
            <div class="h-1 w-full bg-neutral-200 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  </a>
</template>
<script lang="ts">
import {CurrentlyListeningResponse} from "~/server/api/v1/fun/currently_listening";

export default defineNuxtComponent({
  data() {
    return {
      listening: null as CurrentlyListeningResponse | null,
      startTime: new Date() as Date,
      currentTime: new Date() as Date,
      refreshing: false,
      mediaHasEnded: false,
    }
  },

  computed: {
    playbackPosition() {
      const playbackPosition = this.listening?.playbackPosition || 0;
      const timeDifference = (this.currentTime.getTime() - this.startTime.getTime()) / 1000;
      return playbackPosition + timeDifference;
    },
  },

  watch: {
    playbackPosition(value) {
      if (!this.listening?.playbackDuration) return;
      if (value > this.listening.playbackDuration && !this.mediaHasEnded) {
        this.mediaHasEnded = true;
        console.log("Playback position is greater than playback duration, refreshing");
        this.refresh();
      }
    },
    listening: {
      handler(newValue, oldValue) {
        if (newValue?.contentId === oldValue?.contentId && newValue?.playbackRepeat !== "one") {
          console.log("Content ID is the same, trying again in 10 seconds");
          setTimeout(() => {
            this.refresh();
          }, 10000)
        } else {
          this.mediaHasEnded = false;
          this.startTime = new Date();
        }
      },
      deep: true,
    }
  },

  methods: {
    async refresh() {
      this.refreshing = true;
      this.listening = (await useFetch<CurrentlyListeningResponse>("/api/v1/fun/currently_listening")).data as unknown as CurrentlyListeningResponse;
      this.refreshing = false;
    }
  },

  mounted() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.$nextTick(() => {
      this.refresh();
    });
  }
})
</script>