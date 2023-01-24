<template>
  <Container>
    <div class="mt-12 mb-40 md:mt-40 md:mb-48">
      <ProjectsList :projects="projects"/>
    </div>
  </Container>
</template>

<script lang="ts">
export default defineNuxtComponent({
  async asyncData () {
    // fetch projects from api
    const { data: projects } = await useFetch('/api/v1/projects');

    return {
      projects,
    }
  },
});
</script>
