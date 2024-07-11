<template>
  <NuxtLink :href="data.repo.htmlUrl" target="_blank" class="rounded-2xl">
    <Card class="fun-card p-8">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3 mr-9">
          <p class="text-xs text-gray-900 dark:text-gray-100">Last public commit</p>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{{ data.commit.message }}</h1>
        </div>
        <div class="flex flex-wrap gap-2 items-baseline text-sm text-gray-700 dark:text-gray-400 group-hover/card:text-gray-900 group-hover/card:dark:text-gray-100 duration-500 ease-in-out">
          <NuxtLink :href="data.actor.htmlUrl" target="_blank" class="text-md font-medium truncate rounded-sm">{{ data.actor.displayLogin }}</NuxtLink>
          <span class="truncate">committed to</span>
          <NuxtLink :href="data.repo.htmlUrl" target="_blank" class="text-md font-medium truncate rounded-sm">{{ data.repo.name }}</NuxtLink>
          <span class="truncate">{{ relativeTime }}</span>
        </div>
      </div>
      <div class="absolute top-8 right-8 z-10">
        <img alt="GitHub" src="~/assets/img/github-mark-white.svg" class="h-6 invert dark:invert-0" />
      </div>
    </Card>
  </NuxtLink>
</template>

<script lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
</script>

<script setup lang="ts">
import { RecentGithubCommitResponse } from "~/server/api/v1/fun/recent_github_commit";
import Card from "~/components/generics/Card.vue";
import {computed} from "vue";

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
