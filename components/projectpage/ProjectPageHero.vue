<template>
  <div class="w-full flex flex-col-reverse xl:flex-row justify-between gap-12 md:bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 p-4 md:px-4 md:py-12 xl:p-32 2xl:p-44 overflow-hidden">
    <div class="flex flex-wrap sm:flex-row xl:flex-col gap-6 xl:gap-12 justify-between xl:justify-start items-center xl:items-start m-auto w-full max-w-3xl xl:m-0 xl:w-auto px-8 xl:px-0 z-20">
      <div class="flex flex-col gap-6 xl:gap-12">
        <h1 class="text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-gray-800 dark:text-gray-100">{{ project?.displayName }}</h1>
        <p class="hidden xl:block">{{ project?.summary }}</p>
      </div>
      <div v-if="project?.websiteUrl">
        <FlatButton :href="project?.websiteUrl" target="_blank">Visit Website</FlatButton>
      </div>
    </div>
    <div class="m-auto xl:m-0 w-full xl:w-1/2 max-w-3xl aspect-video" v-if="project?.thumbnailUrl">
      <div class="absolute w-full h-full rounded-xl overflow-hidden shadow-xl shadow-gray-400 dark:shadow-black">
        <img :src="project?.thumbnailUrl" :alt="project?.displayName" class="absolute w-full h-full z-10" />
        <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
      </div>
      <div class="absolute w-full h-full">
        <img aria-hidden="true" :src="project?.thumbnailUrl" :alt="project?.displayName" class="absolute w-full h-full blur-3xl" />
        <img aria-hidden="true" :src="project?.thumbnailUrl" :alt="project?.displayName" class="absolute w-full h-full blur-[200px] hidden xl:block saturate-200" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/lib/projects";
import FlatButton from "~/components/forms/FlatButton.vue";

defineProps<{
  project: CompactProjectInfo
}>();
</script>