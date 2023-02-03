<template>
  <div class="flex flex-col gap-4">
    <QuickActionsGroup v-for="group in groups" :key="group.key" :group="group" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {QuickActionGroup} from "~/lib/quickActions";

export default defineNuxtComponent({
  props: {
    groups: {
      type: Array as PropType<QuickActionGroup[]>,
      required: true,
    },
  },
})
</script>