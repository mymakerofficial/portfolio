<template>
  <div class="flex flex-col gap-8">
    <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">{{ group.group.displayName }}</h1>
    <ProjectsList :projects="group.projects" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {ProjectsGroup} from "~/server/api/v1/grouped_projects";

export default defineNuxtComponent({
  props: {
    group: {
      type: Object as PropType<ProjectsGroup[]>,
      required: true,
    },
  },
});
</script>