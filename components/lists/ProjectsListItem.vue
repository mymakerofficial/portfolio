<template>
  <NuxtLink :href="project.htmlUrl" :data-compact="compact" :data-brighter="brighter" class="p-4 data-[compact=true]:mx-1.5 data-[compact=true]:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 data-[brighter=true]:hover:bg-gray-100 data-[brighter=true]:dark:hover:bg-gray-700 rounded-xl data-[compact=true]:rounded-lg transition-colors ease-in-out duration-200">
    <div class="flex flex-col md:flex-row gap-2 md:items-center">
      <SvgIcon type="mdi" :path="mdiController" v-if="project.type === 'game'" />
      <h1 v-if="!compact" class="text-md font-medium text-gray-600 dark:text-gray-200 truncate">{{project.displayName}}</h1>
      <h1 v-else class="text-sm font-medium text-gray-600 dark:text-gray-200 truncate">{{project.displayName}}</h1>
      <p v-if="project.summary && showSummary" class="text-sm text-gray-500 dark:text-gray-500 truncate">{{project.summary}}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiController } from '@mdi/js';
import {CompactProjectInfo} from "~/server/api/v1/projects";

defineProps<{
  project: CompactProjectInfo
  compact: boolean
  brighter: boolean
  showSummary: boolean
}>();
</script>