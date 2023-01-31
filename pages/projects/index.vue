<template>
  <Head>
    <Title>Projects</Title>
  </Head>

  <Container class="2xl:w-1/2">
    <div class="mt-12 mb-40 md:mt-44 md:mb-48 flex flex-col gap-12">
      <input type="text" class="w-full h-16 px-6 bg-gray-100 dark:bg-gray-800 rounded-xl" placeholder="Search projects" v-model="query" />
      <ProjectsGroupedList v-if="groups.resultType === 'grouped' && groups.data.length > 1" :groups="groups.data"/>
      <div class="flex flex-col gap-8" v-else-if="groups.resultType === 'grouped'">
        <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">Projects made with {{ groups.data[0].group.displayName }}</h1>
        <ProjectsList :projects="groups.data[0].projects" />
      </div>
      <ProjectsList v-else-if="groups.data.length > 0" :projects="groups.data"/>
      <div v-else>
        <h1 class="px-4 text-xl font-bold tracking-widest text-gray-200 dark:text-gray-700">No results found...</h1>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
const fetchData = async (query: string, groupBy: string) => {
  const { data, error } = await useFetch(`/api/v1/projects?q=${query}&group_by=${groupBy}`);
  if (error.value) {
    console.error(error.value);
  } else {
    return data.value;
  }
}

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
    const groups = await fetchData("", `${groupByProperty}:${groupByValue}`);

    return {
      groups: ref(groups),
      groupByProperty: ref(groupByProperty),
      groupByValue: ref(groupByValue),
      includeOther: ref(includeOther),
    }
  },

  data () {
    return {
      query: "",
    }
  },

  watch: {
    query: async function (newQuery) {
      // TODO: debounce
      this.groups = await fetchData(newQuery, `auto`);
    }
  },
});
</script>
