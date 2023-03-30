<template>
  <Card :hoverable="true" :to="project.htmlUrl" class="flex flex-col gap-6 p-8">
    <div v-if="showThumbnail" class="w-full aspect-video rounded-lg overflow-hidden">
      <img :src="project.thumbnailUrl" :alt="project.displayName" class="absolute w-full h-full z-10" />
      <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
    </div>
    <div class="flex flex-col gap-3">
      <time :datetime="project.date" class="text-xs text-gray-900 dark:text-gray-100">{{dateFormatted}}</time>
      <h1 class="text-2xl text-gray-900 dark:text-gray-100 font-bold">{{project.displayName}}</h1>
    </div>
    <div>
      <p class="text-sm text-gray-700 dark:text-gray-400 group-hover/card:text-gray-900 group-hover/card:dark:text-gray-100 duration-500 ease-in-out">{{project.summary}}</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/lib/projects";
import Card from "~/components/generics/Card.vue";
import {computed} from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  project: CompactProjectInfo
  showThumbnail?: boolean;
}>();

const dateFormatted = computed(() => dayjs(props.project.date).format('MMMM, YYYY'))
</script>