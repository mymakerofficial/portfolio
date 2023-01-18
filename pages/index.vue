<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-extrabold">My_Maker Portfolio</h1>
      <div class="text-sm font-medium text-neutral-600">powered by <span class="text-neutral-900 font-bold">Nuxt 3</span>, <span class="text-neutral-900 font-bold">Vite</span>, <span class="text-neutral-900 font-bold">Tailwind</span>, <span class="text-neutral-900 font-bold">Supabase</span> and <span class="text-neutral-900 font-bold">Vercel</span>.</div>
    </div>
    <div v-if="listening" class="p-4 border-2 border-neutral-900 rounded-xl lg:min-w-fit lg:w-1/2">
      <div class="flex flex-col lg:flex-row gap-4">
        <div v-if="listening.albumArtUrl">
          <img :alt="listening.albumName" :src="listening.albumArtUrl" class="w-28 h-28" />
        </div>
        <div v-if="listening.state === 'idle' || !listening.state">
          <h1 class="text-md text-neutral-700 font-bold">Not listening to anything at the moment</h1>
        </div>
        <div v-else class="flex flex-col gap-2 justify-between">
          <div class="flex flex-col gap-2">
            <h1 class="text-md text-neutral-700 font-bold">{{listening.trackTitle}}</h1>
            <p class="text-sm text-neutral-600">{{listening.artistName}}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="text-xs font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-md">{{ listening.state }}</span>
            <span v-if="listening.playbackDuration !== null && listening.playbackDuration !== 0" class="text-xs font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-md">{{ listening.playbackPosition }}s / {{ listening.playbackDuration }}s</span>
            <span v-if="listening.playbackShuffle !== null" class="text-xs font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-md">shuffle: {{ listening.playbackShuffle ? "on" : "off" }}</span>
            <span v-if="listening.playbackRepeat !== null" class="text-xs font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-md">repeat: {{ listening.playbackRepeat }}</span>
          </div>
        </div>
        <div class="ml-auto flex flex-row-reverse w-full lg:w-auto lg:flex-col items-end gap-4 justify-between" v-if="listening.contentProvider">
          <div>
            <img v-if="listening.contentProvider === 'spotify'" alt="Spotify" src="~/assets/img/Spotify_Logo_RGB_Green.png" class="h-6" />
            <img v-else-if="listening.contentProvider === 'plex'" alt="Plex" src="~/assets/img/plex-logo-full-color-on-white.png" class="h-6" />
          </div>
          <div v-if="listening.shareUrl">
            <a :href="listening?.shareUrl" target="_blank" class="text-md font-medium text-neutral-800 border-2 border-b-4 border-r-4 border-neutral-800 px-2 py-0.5 rounded-lg">play on {{ listening.contentProvider }}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col border-2 border-neutral-900 rounded-xl lg:min-w-fit lg:w-1/2">
      <div class="p-4 border-b-2 border-neutral-900">
        <h1 class="text-xl font-bold whitespace-nowrap">Projects</h1>
        <a href="/api/v1/projects" class="text-sm text-blue-600 underline">/api/v1/projects</a>
      </div>
      <NuxtLink v-if="projects" :to="project.htmlUrl" class="p-4 border-b-2 border-neutral-900 last:border-b-0" v-for="project in projects" :key="project.slug">
        <h1 class="text-md text-neutral-700 font-bold whitespace-nowrap">{{project.displayName}}</h1>
        <p class="text-sm text-neutral-600 whitespace-nowrap">{{project.summary}}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: projects } = useFetch('/api/v1/projects');
const { data: listening } = useFetch('/api/v1/fun/currently_listening');

useHead({
  title: "My_Maker"
})
</script>