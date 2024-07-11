<template>
  <div class="flex flex-col gap-12 md:gap-28 my-12 md:my-36">
    <section>
      <Container class="2xl:w-5/12">
        <div class="mx-8 md:mx-12">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-loose">Games</h1>
          <p class="text-lg font-medium text-gray-900 dark:text-gray-100 leading-loose tracking-wide">
            I worked on some games. You can play them here.
          </p>
        </div>
      </Container>
    </section>
    <main>
      <Container class="2xl:w-5/12">
        <div class="flex flex-col gap-6">
          <ProjectCard v-for="item in games" :key="item.key" :project="item" show-thumbnail />
        </div>
      </Container>
    </main>
  </div>
</template>

<script setup lang="ts">
import Container from "~/components/generics/Container.vue";
import {useProjectsList} from "#imports";
import {useSeoMeta} from "unhead";
import {get, set} from "@vueuse/core";
import {CompactProjectInfo} from "~/lib/projects";
import {computed, ref} from "vue";
import ProjectCard from "~/components/home/ProjectCard.vue";

// fetch projects
const projectsResponse = await useProjectsList({
  featuredFist: true,
  type: 'game',
});

const games = ref<CompactProjectInfo[]>();

if (get(projectsResponse)?.data !== null) {
  set(games, get(projectsResponse).data);
}

// get thumbnail of first game

const firstThumbnailUrl = computed(() => {
  return get(games)?.[0]?.thumbnailUrl ?? undefined;
})

useSeoMeta({
  title: "Games by My_Maker",
  description:  "Hai Im My_Maker. I make games and you can play them here.",
  ogImage: get(firstThumbnailUrl),
});
</script>