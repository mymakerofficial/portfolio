<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-extrabold">My_Maker Portfolio</h1>
      <div class="text-sm font-medium text-neutral-600">powered by <span class="text-neutral-900 font-bold">Nuxt 3</span>, <span class="text-neutral-900 font-bold">Vite</span>, <span class="text-neutral-900 font-bold">Tailwind</span>, <span class="text-neutral-900 font-bold">Supabase</span> and <span class="text-neutral-900 font-bold">Vercel</span>.</div>
    </div>
    <div v-if="listening" class="p-4 border-2 border-neutral-900 rounded-xl lg:min-w-fit lg:w-1/2">
      <div class="flex flex-row gap-4">
        <div>
          <img :alt="listening.albumName" :src="listening.albumArtUrl" class="w-24 h-24" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="text-md text-neutral-700 font-bold whitespace-nowrap">{{listening.trackTitle}}</h1>
          <p class="text-sm text-neutral-600 whitespace-nowrap">{{listening.artistName}}</p>
          <div v-if="listening.shareUrl" class="mt-2">
            <a :href="listening?.shareUrl" target="_blank" class="text-md font-medium text-neutral-800 border-2 border-b-4 border-r-4 border-neutral-800 px-2 py-0.5 rounded-lg">play on {{ listening.contentProvider }}</a>
          </div>
        </div>
        <div class="ml-auto">
          <img v-if="listening.contentProvider === 'spotify'" alt="Spotify" src="~/assets/img/Spotify_Logo_RGB_Green.png" class="h-6" />
          <img v-else-if="listening.contentProvider === 'plex'" alt="Plex" src="~/assets/img/plex-logo-full-color-on-white.png" class="h-6" />
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
const { data: listening } = useFetch('/api/v1/currently_listening');

useHead({
  title: "My_Maker"
})
</script>