<template>
  <a :href="data.repo?.htmlUrl" target="_blank">
    <Card class="p-8 shadow-gray-500/10 dark:shadow-gray-600/10 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div v-if="data">
        <div class="flex flex-col gap-4">
          <div class="mr-9">
            <h1 class="text-2xl font-bold text-gray-600 dark:text-gray-100 truncate">{{ data.commit.message }}</h1>
          </div>
          <div class="flex flex-wrap gap-2 items-baseline text-sm text-gray-600 dark:text-gray-200">
            <NuxtLink :href="data.actor.htmlUrl" target="_blank" class="text-md font-medium truncate">{{ data.actor.displayLogin }}</NuxtLink>
            <span class="truncate">committed to</span>
            <NuxtLink :href="data.repo.htmlUrl" target="_blank" class="text-md font-medium truncate">{{ data.repo.name }}</NuxtLink>
            <span class="truncate">{{ relativeTime }}</span>
          </div>
        </div>
        <div class="absolute top-0 right-0 z-10">
          <img alt="GitHub" src="~/assets/img/github-mark-white.svg" class="h-6 hidden dark:block" />
          <img alt="GitHub" src="~/assets/img/github-mark.svg" class="h-6 block dark:hidden" />
        </div>
      </div>
      <div v-else class="flex flex-col gap-4">
        <div class="w-3/5 h-9 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
        <div class="flex flex-wrap gap-2 items-center">
          <div class="w-24 h-4 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
          <div class="w-20 h-4 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
          <div class="w-36 h-4 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
          <div class="w-20 h-4 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
        </div>
      </div>
    </Card>
  </a>
</template>

<script lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
</script>

<script setup lang="ts">
import { RecentGithubCommitResponse } from "~/server/api/v1/fun/recent_github_commit";

const props = defineProps<{
  data: RecentGithubCommitResponse
}>();

const relativeTime = computed(() => {
  if (props.data?.createdAt) {
    return dayjs(props.data.createdAt).fromNow();
  }
  return null;
});
</script>
