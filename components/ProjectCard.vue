<template>
  <NuxtLink :to="project.htmlUrl" class="rounded-lg">
    <Card class="p-8 md:p-12">
      <div class="flex flex-col gap-8">
        <div v-if="showThumbnail" class="w-full aspect-video rounded-md overflow-hidden">
          <img :src="project.thumbnailUrl" :alt="project.displayName" class="absolute w-full h-full z-10" />
          <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
        </div>
        <h1 v-if="!showThumbnail" class="text-xl text-gray-900 dark:text-gray-100 font-bold">{{project.displayName}}</h1>
        <p v-if="!showThumbnail" class="text-sm text-gray-700 dark:text-gray-400">{{project.summary}}</p>
      </div>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/lib/projects";

const props = defineProps<{
  project: CompactProjectInfo
}>();

const showThumbnail = computed(() => {
  return props.project.thumbnailUrl && props.project.featured;
});
</script>