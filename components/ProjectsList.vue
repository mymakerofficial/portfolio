<template>
  <div class="flex flex-col gap-2">
    <ProjectsListItem v-for="project in projects" :key="project.slug" :project="project" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {CompactProjectInfo} from "~/server/api/v1/projects";

export default defineNuxtComponent({
  props: {
    projects: {
      type: Object as PropType<CompactProjectInfo[]>,
      required: true,
    },
  },
});
</script>