<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-extrabold">My_Maker Portfolio</h1>
      <div class="text-sm font-medium text-neutral-600">powered by <span class="text-neutral-900 font-bold">Nuxt 3</span>, <span class="text-neutral-900 font-bold">Vite</span>, <span class="text-neutral-900 font-bold">Tailwind</span>, <span class="text-neutral-900 font-bold">Supabase</span> and <span class="text-neutral-900 font-bold">Vercel</span>.</div>
    </div>
    <div class="flex flex-col border-2 border-neutral-900 rounded-xl min-w-fit w-96">
      <div class="p-4 border-b-2 border-neutral-900">
        <h1 class="text-xl font-bold whitespace-nowrap">Projects</h1>
        <a href="/api/projects" class="text-sm text-blue-600 underline">/api/projects</a>
      </div>
      <NuxtLink v-if="projects" :to="project.htmlUrl" class="p-4 border-b-2 border-neutral-900 last:border-b-0" v-for="project in projects" :key="project.slug">
        <h1 class="text-md text-neutral-700 font-bold whitespace-nowrap">{{project.displayName}}</h1>
        <p class="text-sm text-neutral-600 whitespace-nowrap">{{project.summary}}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: projects } = useFetch('/api/projects');

useHead({
  title: "My_Maker"
})
</script>