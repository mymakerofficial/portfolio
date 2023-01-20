<template>
  <Head>
    <Title>{{ project.displayName }}</Title>
  </Head>
  <Container class="2xl:w-3/5">
    <div class="flex flex-col gap-8 my-12">
      <div>
        <img v-if="project?.thumbnailUrl" :src="project.thumbnailUrl" alt="thumbnail" class="rounded-xl">
      </div>
      <div class="p-4 flex flex-row gap-4 justify-between">
        <div class="flex flex-col gap-4">
          <h1 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{{ project?.displayName || 'loading..' }}</h1>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ project?.summary || 'loading..' }}</p>
        </div>
        <div v-if="project?.websiteUrl">
          <Button>open</Button>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import dayjs from "dayjs";

export default defineNuxtComponent({
  async asyncData() {
    const { data: project } = await useFetch(`/api/v1/projects/${useRoute().params.slug}`);

    return {
      project: ref(project),
    }
  },

  computed: {
    startedHumanReadable() {
      return dayjs(this.project?.startedAt).format('MMMM D, YYYY');
    },
  }
});

/*
const startedHumanReadable = computed(() => {
  if (!project.value) return 'loading..';
  if (!project.value?.startedDate) return null;
  return dayjs(project.value.startedDate).format('D MMMM, YYYY');
});

const releasedHumanReadable = computed(() => {
  if (!project.value) return 'loading..';
  if (!project.value?.releaseDate) return null;
  return dayjs(project.value.releaseDate).format('D MMMM, YYYY');
});
 */
</script>