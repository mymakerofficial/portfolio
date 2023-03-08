<template>
  <div :data-compact="compact" class="flex flex-col gap-4 md:gap-8 data-[compact=true]:gap-2">
    <h1 v-if="!compact" class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">{{ group.group.displayName }}</h1>
    <h1 v-else class="mx-4 text-sm font-medium text-gray-400 dark:text-gray-600">{{ group.group.displayName }}</h1>
    <ProjectsList :projects="group.projects" :compact="compact" :brighter="brighter" :show-summary="showSummary" />
  </div>
</template>

<script setup lang="ts">
import {ProjectsGroup} from "~/server/api/v1/projects";
import ProjectsList from "~/components/lists/ProjectsList.vue";

defineProps<{
  group: ProjectsGroup[];
  compact: boolean;
  brighter: boolean;
  showSummary: boolean;
}>();
</script>