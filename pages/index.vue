<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-extrabold">My_Maker Portfolio</h1>
      <div class="text-sm font-medium text-neutral-600">powered by <span class="text-neutral-900 font-bold">Nuxt 3</span>, <span class="text-neutral-900 font-bold">Vite</span>, <span class="text-neutral-900 font-bold">Tailwind</span>, <span class="text-neutral-900 font-bold">Supabase</span> and <span class="text-neutral-900 font-bold">Vercel</span>.</div>
    </div>
    <MediaPlayerCard />
    <CurrentGameCard />
    <NuxtLink v-if="projects" :to="project.htmlUrl" v-for="project in projects" :key="project.slug">
      <Card>
        <div class="flex flex-col gap-2">
          <h1 class="text-md text-neutral-700 font-bold whitespace-nowrap">{{project.displayName}}</h1>
          <p class="text-sm text-neutral-600 whitespace-nowrap">{{project.summary}}</p>
        </div>
      </Card>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import MediaPlayerCard from "~/components/MediaPlayerCard.vue";

const { data: projects } = useFetch('/api/v1/projects');

useHead({
  title: "My_Maker"
})
</script>