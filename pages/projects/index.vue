<template>
  <Container class="2xl:w-1/2">
    <div class="mt-12 mb-40 md:mt-44 md:mb-48 flex flex-col gap-12">
      <ProjectsList :groups="groups"/>
    </div>
  </Container>
</template>

<script lang="ts">
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
    const { data: groups } = await useFetch(`/api/v1/grouped_projects?group_by_property=${groupByProperty}&group_by_value=${groupByValue}&include_other=${includeOther}`);

    return {
      groups: ref(groups),
      groupByProperty: ref(groupByProperty),
      groupByValue: ref(groupByValue),
      includeOther: ref(includeOther),
    }
  },

  methods: {
    async fetchGroups() {
      const { data, error } = await useFetch(`/api/v1/grouped_projects?group_by_property=${this.groupByProperty}&group_by_value=${this.groupByValue}&include_other=${this.includeOther}`);
      if (error.value) {
        console.error(error.value);
      } else {
        this.groups = data.value;
      }
    },
  },
});
</script>
