<template>
  <div class="flex flex-col gap-4 md:gap-16">
    <ProjectsListYearSection v-for="year in projectsByYear" :key="year.year" :year="year" class="flex flex-col gap-4 md:gap-8" />
  </div>
</template>

<script lang="ts">
import {CompactProjectInfo} from "~/server/api/v1/projects";
import {PropType} from "@vue/runtime-core";

export interface ProjectYearSection {
  year: number;
  projects: CompactProjectInfo[];
}

export default defineNuxtComponent({
  props: {
    projects: {
      type: Array as PropType<CompactProjectInfo[]>,
      required: true,
    },
  },

  computed: {
    projectsByYear(): ProjectYearSection[] {
      const projectsByYear: ProjectYearSection[] = [];

      // group projects by year
      for (const project of this.projects) {
        const year = new Date(project.date).getFullYear();
        // find year section
        const yearSection = projectsByYear.find((section) => section.year === year);

        if (yearSection) {
          // add project to year section
          yearSection.projects.push(project);
        } else {
          // create new year section
          projectsByYear.push({
            year,
            projects: [project],
          });
        }
      }

      return projectsByYear;
    },
  }
})
</script>