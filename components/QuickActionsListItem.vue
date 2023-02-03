<template>
  <button @click="item.action" class="mx-1.5 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ease-in-out duration-200">
    <div class="flex flex-col md:flex-row gap-2 md:items-center">
      <h1 class="text-sm font-medium text-gray-600 dark:text-gray-200 truncate">{{ item.displayName }}</h1>
    </div>
  </button>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";
import {QuickActionItem} from "~/components/QuickActionsGroupedList.vue";

export default defineNuxtComponent({
  props: {
    item: {
      type: Object as PropType<QuickActionItem>,
      required: true,
    },
  },
})
</script>