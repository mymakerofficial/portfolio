<template>
  <div class="flex flex-col gap-2">
    <ProjectsListItem v-for="project in projects" :key="project.slug" :project="project" :compact="compact" :brighter="brighter" :show-summary="showSummary" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {CompactProjectInfo} from "~/server/api/v1/projects";
import {defineNuxtComponent} from "#app";
import ProjectsListItem from "~/components/lists/ProjectsListItem.vue";

export default defineNuxtComponent({
  components: {
    ProjectsListItem,
  },

  props: {
    projects: {
      type: Object as PropType<CompactProjectInfo[]>,
      required: true,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    brighter: {
      type: Boolean,
      default: false,
    },
    showSummary: {
      type: Boolean,
      default: true,
    },
  },
});
</script>