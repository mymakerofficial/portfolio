<template>
  <div class="flex flex-col gap-4 md:gap-8">
    <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">{{ year.year }}</h1>
    <div class="flex flex-col gap-2">
      <ProjectsListItem v-for="project in year.projects" :key="project.slug" :project="project" />
    </div>
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {ProjectYearSection} from "~/components/ProjectsList.vue";

export default defineNuxtComponent({
  props: {
    year: {
      type: Object as PropType<ProjectYearSection[]>,
      required: true,
    },
  },
});
</script>