<template>
  <a :href="listening?.shareUrl" target="_blank" v-if="!hide">
    <Card class="p-8 shadow-green-500/10 dark:shadow-green-600/10 bg-green-50 dark:bg-green-800 overflow-hidden">
      <div v-if="listening" class="flex flex-col lg:flex-row gap-4">
        <div v-if="listening.albumArtUrl" class="w-28 h-28 overflow-hidden">
          <img :alt="listening.albumName" :src="listening.albumArtUrl" class="absolute w-full h-full z-10" />
          <div class="absolute w-full h-full bg-green-600/20 dark:bg-green-100/20 animate-pulse" />
        </div>
        <div class="flex-1 flex flex-col gap-4 justify-between">
          <div class="flex flex-col gap-2 mr-9">
            <h1 class="text-md text-green-700 dark:text-green-100 font-bold">{{listening.trackTitle}}</h1>
            <p class="text-sm text-green-600 dark:text-green-200">{{listening.artistName}}</p>
            <p class="text-sm text-green-600 dark:text-green-200">{{listening.albumName}}</p>
          </div>
          <div>
            <div class="h-1 w-full bg-green-100 dark:bg-green-700 rounded-full overflow-hidden">
              <div class="h-full bg-green-900 dark:bg-green-100 transition-[width] duration-1000 ease-linear" :style="{ width: `${(playbackPosition / listening.playbackDuration) * 100}%` }" />
            </div>
          </div>
        </div>
        <div class="absolute top-0 right-0 z-10" v-if="listening.contentProvider">
          <img v-if="listening.contentProvider === 'spotify'" alt="Spotify" src="~/assets/img/Spotify_Icon_RGB_Green.png" class="h-6" />
        </div>
      </div>
      <div v-else class="flex flex-col lg:flex-row gap-4">
        <div class="w-28 h-28 bg-green-600/20 dark:bg-green-100/20 animate-pulse" />
        <div class="flex-1 flex flex-col gap-4 justify-between">
          <div class="flex flex-col gap-4">
            <div class="w-28 h-4 bg-green-600/20 dark:bg-green-100/20 animate-pulse rounded-md" />
            <div class="w-16 h-4 bg-green-600/20 dark:bg-green-100/20 animate-pulse rounded-md" />
            <div class="w-20 h-4 bg-green-600/20 dark:bg-green-100/20 animate-pulse rounded-md" />
          </div>
          <div>
            <div class="h-1 w-full bg-green-900/20 dark:bg-green-100/20 animate-pulse rounded-full" />
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
      if (this.listening?.state === "playing") {
        // get playback position and compensate for caching
        const playbackPosition = (this.listening?.playbackPosition || 0) + (this.startTime.getTime() - new Date(this.listening.generatedAt).getTime()) / 1000;
        const timeDifference = (this.currentTime.getTime() - this.startTime.getTime()) / 1000;
        return playbackPosition + timeDifference;
      } else {
        return this.listening?.playbackPosition || 0;
      }
    },
    hide() {
      if (!this.listening) {
        return false;
      }
      return this.listening.state !== "playing" && this.listening.state !== "paused";
    }
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
        if (newValue?.contentId === oldValue?.contentId && newValue?.playbackRepeat !== "one" && newValue?.state !== "paused") {
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