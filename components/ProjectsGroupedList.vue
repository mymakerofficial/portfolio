<template>
  <div class="flex flex-col gap-16">
    <ProjectsListGroup v-for="group in groups" :key="group.group.slug" :group="group" class="flex flex-col gap-4 md:gap-8" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {ProjectsGroup} from "~/server/api/v1/grouped_projects";

export default defineNuxtComponent({
  props: {
    groups: {
      type: Array as PropType<ProjectsGroup[]>,
      required: true,
    },
  },
})
</script>