<template>
  <a :href="listening?.shareUrl" target="_blank" class="rounded-xl" v-if="!hide">
    <Card class="p-8 bg-green-50 dark:bg-green-800 overflow-hidden">
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
              <div class="h-full bg-green-900 dark:bg-green-100 transition-[width] duration-1000 ease-linear rounded-full" :style="{ width: `${(playbackPosition / listening.playbackDuration) * 100}%` }" />
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
<script setup lang="ts">
import {CurrentlyListeningResponse} from "~/server/api/v1/fun/currently_listening";
import {get, set, watchTriggerable} from "@vueuse/core";

const props = defineProps<{
  data: CurrentlyListeningResponse
}>();

const listening = ref<CurrentlyListeningResponse>(props.data);

const currentTime = ref(new Date());
const startTime = ref(new Date());

const playbackPosition = computed(() => {
  if (get(listening).state === "playing") {
    // get playback position and compensate for caching
    const playbackPosition = (get(listening).playbackPosition || 0) + (get(startTime).getTime() - new Date(get(listening).generatedAt).getTime()) / 1000;
    const timeDifference = (get(currentTime).getTime() - get(startTime).getTime()) / 1000;
    return playbackPosition + timeDifference;
  } else {
    return get(listening).playbackPosition || 0;
  }
});

const hide = computed(() => {
  if (get(listening).state === "playing") {
    return false;
  } else if (get(listening).state === "paused") {
    return false;
  }

  return true;
});

const refresh = async () => {
  const { data } = await useFetch<CurrentlyListeningResponse>("/api/v1/fun/currently_listening");

  set(listening, get(data));
};

const { trigger: startPlayback } = watchTriggerable(listening, (newValue, oldValue) => {

  let waitTime = 120000;

  if (newValue.state === "playing") {
    // wait until invalidAt has passed
    waitTime = new Date(newValue.invalidAt).getTime() - new Date().getTime();
  }

  if (newValue.state === "playing" && newValue.contentId === oldValue?.contentId && get(playbackPosition) > (newValue.playbackDuration || 0)) {
    console.info("MediaPlayerCard: Playback ID is the same, but playback position is greater than playback duration. Refreshing in 10s");

    waitTime = 10000;
  }

  console.info(`MediaPlayerCard: Waiting ${waitTime / 1000}s until refreshing`)

  if (get(listening).invalidAt) {
    setTimeout(() => {
      refresh();
    }, waitTime);
  }

  set(startTime, new Date());
})

onMounted(() => {
  setInterval(() => {
    set(currentTime, new Date());
  }, 1000);

  console.info("MediaPlayerCard: Initialised")

  startPlayback();
})
</script>