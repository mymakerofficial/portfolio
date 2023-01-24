<template>
  <Container>
    <div class="mt-12 mb-40 md:mt-32 md:mb-48 flex flex-col gap-12">
      <div class="flex flex-row gap-2">
        <Button @click="groupByProperty = 'date';groupByValue = 'year';this.fetchGroups();">Year</Button>
        <Button @click="groupByProperty = 'technology-type';groupByValue = 'programming-language';this.fetchGroups();">Language</Button>
        <Button @click="groupByProperty = 'technology-type';groupByValue = 'frontend-framework';this.fetchGroups();">Framework</Button>
      </div>
      <ProjectsList :groups="groups"/>
    </div>
  </Container>
</template>

<script lang="ts">
export default defineNuxtComponent({
  async setup () {
    const groupByProperty = 'date';
    const groupByValue = 'year';

    // fetch projects from api
    const { data: groups } = await useFetch(`/api/v1/grouped_projects?group_by_property=${groupByProperty}&group_by_value=${groupByValue}`);

    return {
      groups: ref(groups),
      groupByProperty: ref(groupByProperty),
      groupByValue: ref(groupByValue),
    }
  },

  methods: {
    async fetchGroups() {
      const { data, error } = await useFetch(`/api/v1/grouped_projects?group_by_property=${this.groupByProperty}&group_by_value=${this.groupByValue}`);
      if (error.value) {
        console.error(error.value);
      } else {
        this.groups = data.value;
      }
    },
  },
});
</script>
