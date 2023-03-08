<template>
  <Container class="2xl:w-1/2">
    <div class="mt-12 mb-40 md:mt-44 md:mb-48 flex flex-col gap-12">
      <ProjectsGroupedList v-if="data.resultType === 'grouped' && data.data.length > 1" :groups="data.data"/>
      <div class="flex flex-col gap-8" v-else-if="data.resultType === 'grouped'">
        <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">Projects made with {{ data.data[0].group.displayName }}</h1>
        <ProjectsList :projects="data.data[0].projects" />
      </div>
      <ProjectsList v-else-if="data.data.length > 0" :projects="data.data"/>
      <div v-else>
        <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">No results found...</h1>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import {get} from "@vueuse/core";
import {useFetch, useHead, useRoute} from "#app";
import {computed} from "vue";
import Container from "~/components/generics/Container.vue";
import ProjectsGroupedList from "~/components/lists/ProjectsGroupedList.vue";
import ProjectsList from "~/components/lists/ProjectsList.vue";

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
})

const requestUrl = computed(() => {
  const url = `/api/v1/projects`

  const params = new URLSearchParams();

  if (get(query)) {
    params.append('q', get(query));
  }

  if (get(groupBy)) {
    params.append('group_by', get(groupBy));
  }

  return `${url}?${params.toString()}`;
})

const { data } = await useFetch(get(requestUrl));

useHead({
  title: 'Projects',
  meta: [
    {
      name: 'description',
      content: 'Projects made by me'
    }
  ]
})
</script>
