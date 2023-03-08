<template>
  <div class="flex flex-col gap-2">
    <ProjectsListItem v-for="project in projects" :key="project.slug" :project="project" :compact="compact" :brighter="brighter" :show-summary="showSummary" />
  </div>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/server/api/v1/projects";
import ProjectsListItem from "~/components/lists/ProjectsListItem.vue";

defineProps<{
  projects: CompactProjectInfo[];
  compact?: boolean;
  brighter?: boolean;
  showSummary?: boolean;
}>();
</script>