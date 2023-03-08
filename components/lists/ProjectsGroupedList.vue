<template>
  <div :data-compact="compact" class="flex flex-col gap-16 data-[compact=true]:gap-4">
    <ProjectsListGroup v-for="group in groups" :key="group.group.slug" :group="group" :compact="compact" :brighter="brighter" :show-summary="showSummary" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {ProjectsGroup} from "~/server/api/v1/projects";
import {defineNuxtComponent} from "#app";
import ProjectsListGroup from "~/components/lists/ProjectsListGroup.vue";

export default defineNuxtComponent({
  components: {
    ProjectsListGroup,
  },

  props: {
    groups: {
      type: Array as PropType<ProjectsGroup[]>,
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
})
</script>