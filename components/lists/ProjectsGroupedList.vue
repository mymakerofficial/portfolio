<template>
  <div :data-compact="compact" class="flex flex-col gap-16 data-[compact=true]:gap-4">
    <ProjectsListGroup v-for="group in groups" :key="group.group.slug" :group="group" :compact="compact" :brighter="brighter" :show-summary="showSummary" />
  </div>
</template>

<script setup lang="ts">
import {ProjectsGroup} from "~/server/api/v1/projects";
import ProjectsListGroup from "~/components/lists/ProjectsListGroup.vue";

withDefaults(defineProps<{
  groups: ProjectsGroup[];
  compact?: boolean;
  brighter?: boolean;
  showSummary?: boolean;
}>(), {
  showSummary: true,
});
</script>