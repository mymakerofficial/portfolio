<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-extrabold">{{ project?.displayName || 'loading..' }}</h1>
      <div class="text-sm font-medium text-neutral-600">{{ project?.summary || 'loading..' }}</div>
      <a :href="`/api/projects/${useRoute().params.slug}`" class="text-sm text-blue-600 underline">/api/projects/{{ useRoute().params.slug }}</a>
    </div>
    <img v-if="project?.thumbnailUrl" :src="project.thumbnailUrl" alt="thumbnail" class="rounded-xl w-96">
    <div v-if="project" class="flex flex-col border-2 border-neutral-900 rounded-xl min-w-fit w-96">
      <div class="p-4 flex flex-row gap-4 items-center border-b-2 border-neutral-900 last:border-b-0" v-for="key in Object.keys(project)" :key="key">
        <h1 class="text-md text-neutral-700 font-bold whitespace-nowrap">{{ key }}</h1>
        <p class="text-sm text-neutral-600 whitespace-nowrap">{{ project[key] || 'null' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: project } = useFetch(`/api/projects/${useRoute().params.slug}`);
</script>