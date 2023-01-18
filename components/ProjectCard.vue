<template>
  <NuxtLink :to="project.htmlUrl">
    <Card class="p-12 bg-white shadow-neutral-500/10">
      <div class="flex flex-col gap-8">
        <div v-if="project.thumbnailUrl" class="w-full aspect-video rounded-md overflow-hidden">
          <img :src="project.thumbnailUrl" :alt="project.name" class="absolute w-full h-full z-10" />
          <div class="w-full h-full bg-neutral-900/20 animate-pulse" />
        </div>
        <div v-else>
          <span class="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-lg">{{ displayYear }}</span>
        </div>
        <div class="flex flex-row gap-4 items-center">
          <h1 class="text-xl text-neutral-900 font-bold">{{project.displayName}}</h1>
          <span v-if="project.thumbnailUrl" class="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-lg">{{ displayYear }}</span>
        </div>
        <p class="text-sm text-neutral-700">{{project.summary}}</p>
      </div>
    </Card>
  </NuxtLink>
</template>

<script lang="ts">
import dayjs from "dayjs";

export default defineNuxtComponent({
  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  computed: {
    displayYear() {
      return dayjs(this.project.releaseDate).format("YYYY");
    }
  }
})
</script>