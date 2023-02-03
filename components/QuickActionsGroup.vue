<template>
  <div class="flex flex-col gap-2">
    <h1 class="mx-4 text-sm font-medium text-gray-400 dark:text-gray-600">{{ group.displayName }}</h1>
    <QuickActionsList :items="group.items" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {ProjectsGroup} from "~/server/api/v1/grouped_projects";
import {QuickActionGroup} from "~/components/QuickActionsGroupedList.vue";

export default defineNuxtComponent({
  props: {
    group: {
      type: Object as PropType<QuickActionGroup>,
      required: true,
    },
  },
});
</script>