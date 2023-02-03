<template>
  <div class="flex flex-col gap-2">
    <QuickActionsListItem v-for="item in items" :key="item.key" :item="item" />
  </div>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import { QuickActionItem } from "~~/lib/quickActions";

export default defineNuxtComponent({
  props: {
    items: {
      type: Array as PropType<QuickActionItem[]>,
      required: true,
    },
  },
});
</script>