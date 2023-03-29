<template>
  <NuxtLink :to="project.htmlUrl" class="rounded-xl">
    <Card class="group/project-card hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border border-gray-100/80 dark:border-gray-800/80 overflow-hidden duration-500 ease-in-out">
      <ClientOnly>
        <SpotlightEffectElement class="opacity-[.025] group-hover/project-card:opacity-5 duration-500 ease-in-out" />
      </ClientOnly>
      <div class="flex flex-col gap-6 p-8">
        <div v-if="showThumbnail" class="w-full aspect-video rounded-lg overflow-hidden">
          <img :src="project.thumbnailUrl" :alt="project.displayName" class="absolute w-full h-full z-10" />
          <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
        </div>
        <div class="flex flex-col gap-3">
          <time :datetime="project.date" class="text-xs text-gray-900 dark:text-gray-100">{{dateFormatted}}</time>
          <h1 class="text-2xl text-gray-900 dark:text-gray-100 font-bold">{{project.displayName}}</h1>
        </div>
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-400 group-hover/project-card:text-gray-900 group-hover/project-card:dark:text-gray-100 duration-500 ease-in-out">{{project.summary}}</p>
        </div>
      </div>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/lib/projects";
import Card from "~/components/generics/Card.vue";
import {computed} from "vue";
import SpotlightEffectElement from "~/components/generics/SpotlightEffectElement.vue";
import dayjs from "dayjs";

const props = defineProps<{
  project: CompactProjectInfo
  showThumbnail?: boolean;
}>();

const dateFormatted = computed(() => dayjs(props.project.date).format('MMMM, YYYY'))
</script>