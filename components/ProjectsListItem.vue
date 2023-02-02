<template>
  <NuxtLink :href="project.htmlUrl" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors ease-in-out duration-200">
    <div class="flex flex-col md:flex-row gap-2 md:items-center">
      <h1 class="text-md font-medium text-gray-600 dark:text-gray-200 truncate">{{project.displayName}}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-500 truncate">{{project.summary}}</p>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import {CompactProjectInfo} from "~/server/api/v1/projects";
import {PropType} from "@vue/runtime-core";

export default defineNuxtComponent({
  props: {
    project: {
      type: Object as PropType<CompactProjectInfo>,
      required: true,
    },
  },
})
</script>