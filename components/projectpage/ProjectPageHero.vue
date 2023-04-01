<template>
  <div class="flex flex-col gap-16">
    <div class="sm:px-8 flex flex-col gap-4">
      <h1 class="text-2xl md:text-4xl xl:text-5xl font-extrabold text-gray-800 dark:text-gray-100">{{ project.displayName }}</h1>
      <p class="font-medium text-gray-600 dark:text-gray-300">{{ project.summary }}</p>
    </div>
    <div class="relative w-full aspect-video rounded-xl overflow-hidden" v-if="project.thumbnailUrl">
      <img :src="project.thumbnailUrl" :alt="project.displayName" class="absolute w-full h-full z-10" />
      <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
    </div>
    <div class="sm:px-8">
      <div v-if="project.websiteUrl">
        <FlatButton :href="project.websiteUrl" target="_blank"><SvgIcon type="mdi" :path="mdiWeb" class="h-5" />Visit Website</FlatButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/lib/projects";
import FlatButton from "~/components/forms/FlatButton.vue";
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiWeb } from '@mdi/js';

defineProps<{
  project: CompactProjectInfo
}>();
</script>