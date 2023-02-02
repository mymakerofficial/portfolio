<template>
  <Head>
    <Title>Projects</Title>
  </Head>

  <Container class="2xl:w-1/2">
    <div class="mt-12 mb-40 md:mt-44 md:mb-48 flex flex-col gap-12">
      <!--<input type="text" class="w-full h-16 px-6 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-xl placeholder-gray-200 dark:placeholder-gray-700 font-medium text-xl" placeholder="Search" v-model="query" />-->
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

<script lang="ts">
import { useDebounceFn } from "@vueuse/core";

const fetchData = async (query: string, groupBy: string) => {
  const { data, error } = await useFetch(`/api/v1/projects?q=${query}&group_by=${groupBy}`);
  if (error.value) {
    console.error(error.value);
  } else {
    return data.value;
  }
}

const debouncedSearch = useDebounceFn(async (query: string, groupBy: string) => {
  return await fetchData(query, groupBy);
}, 500)

export default defineNuxtComponent({
  async setup () {
    let groupByProperty = 'date';
    let groupByValue = 'year';
    let includeOther = false;

    if (useRoute().query.group_by) {
      const groupBy = useRoute().query.group_by as string;

      if (groupBy === 'date') {
        groupByProperty = 'date';
        groupByValue = 'year';
      } else if (groupBy === 'language') {
        groupByProperty = 'technology-type';
        groupByValue = 'programming-language';
        includeOther = true;
      } else if (groupBy === 'framework') {
        groupByProperty = 'technology-type';
        groupByValue = 'frontend-framework';
      }
    } else if (useRoute().query.group_by_property && useRoute().query.group_by_value) {
      groupByProperty = useRoute().query.group_by_property as string;
      groupByValue = useRoute().query.group_by_value as string;

      if (useRoute().query.include_other) {
        includeOther = useRoute().query.include_other === "true";
      }
    }

    // fetch projects from api
    const data = await fetchData("", `${groupByProperty}:${groupByValue}`);

    return {
      data: ref(data),
    }
  },

  data () {
    return {
      query: "",
    }
  },

  watch: {
    query: async function (newQuery) {
      const res = await debouncedSearch(newQuery, `auto`);
      if (res) {
        this.data = res;
      }
    }
  },
});
</script>
