<template>
  <Container class="2xl:w-1/2">
    <div class="mt-12 md:mt-44 flex flex-col gap-12">
      <ProjectsGroupedList v-if="projects.resultType === 'grouped' && projects.data.length > 1" :groups="projects.data"/>
      <div class="flex flex-col gap-8" v-else-if="projects.resultType === 'grouped'">
        <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">Projects made with
          {{ projects.data[0].group.displayName }}</h1>
        <ProjectsList :projects="projects.data[0].projects" />
      </div>
      <ProjectsList v-else-if="projects.data.length > 0" :projects="projects.data"/>
      <div v-else>
        <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">No results found...</h1>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import {get} from "@vueuse/core";
import {useRoute} from "#app";
import {computed} from "vue";
import Container from "~/components/generics/Container.vue";
import ProjectsGroupedList from "~/components/lists/ProjectsGroupedList.vue";
import ProjectsList from "~/components/lists/ProjectsList.vue";
import {useSeoMeta} from "unhead";
import {defineOgImageScreenshot, useProjectsList} from "#imports";

const route = useRoute();

const query = computed(() => {
  if (route.query.q) {
    return route.query.q as string;
  } else {
    return '';
  }
});

const groupBy = computed(() => {
  if (get(query) !== '') {
    return 'auto';
  }

  if (route.query.group_by) {
    switch (route.query.group_by) {
      case 'date':
        return 'date:year';
      case 'language':
        return 'technology-type:programming-language';
      case 'framework':
        return 'technology-type:frontend-framework';
    }
  }

  return 'date:year';
});

const projects = await useProjectsList({
  query: get(query),
  groupBy: get(groupBy),
});

useSeoMeta({
  title: "Projects by My_Maker",
  description: "Find all my projects here.",
});

defineOgImageScreenshot({
  width: 1280,
  height: 720,
  colorScheme: 'dark',
  mask: '.fun-card, .toast, nav',
});
</script>
