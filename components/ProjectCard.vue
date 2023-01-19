<template>
  <NuxtLink :to="project.htmlUrl">
    <Card class="p-8 md:p-12 bg-white dark:bg-gray-900 shadow-transparent">
      <div class="flex flex-col gap-8">
        <div v-if="project.thumbnailUrl" class="w-full aspect-video rounded-md overflow-hidden">
          <img :src="project.thumbnailUrl" :alt="project.displayName" class="absolute w-full h-full z-10" />
          <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
        </div>
        <div v-else class="flex flex-row gap-2 items-center">
          <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-bold rounded-lg">{{ project.type }}</span>
          <span class="text-gray-700 dark:text-gray-400 text-xs font-medium">{{ displayYear }}</span>
        </div>
        <div class="flex flex-row gap-4 items-center">
          <h1 class="text-xl text-gray-900 dark:text-gray-100 font-bold">{{project.displayName}}</h1>
          <div v-if="project.thumbnailUrl" class="flex flex-row gap-2 items-center">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-bold rounded-lg">{{ project.type }}</span>
            <span class="text-gray-700 dark:text-gray-400 text-xs font-medium">{{ displayYear }}</span>
          </div>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-400">{{project.summary}}</p>
      </div>
    </Card>
  </NuxtLink>
</template>

<script lang="ts">
import dayjs from "dayjs";

export default defineNuxtComponent({
  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  computed: {
    displayYear() {
      return dayjs(this.project.date).format("YYYY");
    }
  }
})
</script>