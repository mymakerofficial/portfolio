<template>
  <div class="p-8 flex flex-col gap-8">
    <img v-if="project?.thumbnailUrl" :src="project.thumbnailUrl" alt="thumbnail" class="rounded-xl lg:w-1/2">
    <div class="p-4 flex flex-col gap-4">
      <h1 class="text-4xl font-extrabold">{{ project?.displayName || 'loading..' }}</h1>
      <p class="text-sm font-medium text-gray-600">{{ project?.summary || 'loading..' }}</p>
      <div v-if="project?.websiteUrl">
        <a :href="project?.websiteUrl" target="_blank" class="text-md font-medium text-gray-800 border-2 border-b-4 border-r-4 border-gray-800 px-7 py-2 rounded-lg">open</a>
      </div>
    </div>
    <div v-if="project" class="flex flex-col border-2 border-gray-900 rounded-xl lg:min-w-fit lg:w-1/2">
      <div class="p-4 border-b-2 border-gray-900 last:border-b-0">
        <div class="flex flex-col gap-4">
          <label class="text-lg font-medium text-gray-900">Timeline</label>
          <div class="flex flex-wrap gap-4">
            <span class="text-sm font-medium text-gray-100 bg-gray-800 px-2 py-1 rounded-md" v-if="startedHumanReadable !== null">started {{ startedHumanReadable }}</span>
            <span class="text-sm font-medium text-gray-100 bg-gray-800 px-2 py-1 rounded-md" v-if="releasedHumanReadable !== null">released {{ releasedHumanReadable }}</span>
          </div>
        </div>
      </div>
      <div v-if="project?.collaborators?.length !== 0" class="p-4 flex flex-col gap-4 border-b-2 border-gray-900 last:border-b-0">
        <label class="text-lg font-medium text-gray-900">Collaborators</label>
        <div class="flex flex-wrap gap-4">
          <span v-for="collaborator in project?.collaborators || []" :key="collaborator.slug" class="text-sm font-medium text-gray-100 bg-gray-800 px-2 py-1 rounded-md before:content-['@']">{{ collaborator.displayName }}</span>
        </div>
      </div>
      <div v-if="project?.tags?.length !== 0" class="p-4 flex flex-col gap-4 border-b-2 border-gray-900 last:border-b-0">
        <label class="text-lg font-medium text-gray-900">Tags</label>
        <div class="flex flex-wrap gap-4">
          <span v-for="tag in project?.tags || []" :key="tag.slug" class="text-sm font-medium text-gray-100 bg-gray-800 px-2 py-1 rounded-md before:content-['#']">{{ tag.displayName }}</span>
        </div>
      </div>
      <div v-if="project?.technologies?.length !== 0" class="p-4 flex flex-col gap-4 border-b-2 border-gray-900 last:border-b-0">
        <label class="text-lg font-medium text-gray-900">Tech Stack</label>
        <div class="flex flex-col gap-4">
          <div v-for="type in project?.technologies || []" :key="type.slug" class="flex flex-row gap-4">
            <label class="text-md font-medium text-gray-700">{{ type.shortDisplayName || type.displayName }}</label>
            <div class="flex flex-wrap gap-4">
              <span v-for="technology in type.technologies || []" :key="technology.slug" class="text-sm font-medium text-gray-100 bg-gray-800 px-2 py-1 rounded-md">{{ technology.displayName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="project" class="flex flex-col border-2 border-gray-900 rounded-xl lg:min-w-fit lg:w-1/2">
      <div class="p-4 border-b-2 border-gray-900">
        <h1 class="text-xl font-bold whitespace-nowrap">Raw Data</h1>
        <a :href="`/api/v1/projects/${useRoute().params.slug}`" class="text-sm text-blue-600 underline">/api/v1/projects/{{ useRoute().params.slug }}</a>
      </div>
      <div class="p-4 flex flex-row gap-4 items-center border-b-2 border-gray-900 last:border-b-0" v-for="key in Object.keys(project)" :key="key">
        <h1 class="text-md text-gray-700 font-bold whitespace-nowrap">{{ key }}</h1>
        <div class="text-sm text-gray-600 whitespace-nowrap"><pre>{{ project[key] || 'null' }}</pre></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { data: project } = useFetch(`/api/v1/projects/${useRoute().params.slug}`);

const startedHumanReadable = computed(() => {
  if (!project.value) return 'loading..';
  if (!project.value?.startedDate) return null;
  return dayjs(project.value.startedDate).format('D MMMM, YYYY');
});

const releasedHumanReadable = computed(() => {
  if (!project.value) return 'loading..';
  if (!project.value?.releaseDate) return null;
  return dayjs(project.value.releaseDate).format('D MMMM, YYYY');
});
</script>