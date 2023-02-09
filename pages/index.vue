<template>
  <Container class="2xl:w-11/12">
    <div class="flex flex-col gap-12 md:gap-16 mt-12 mb-40 md:mt-32 md:mb-48">
      <HomePageHero />
      <div class="flex justify-center">
        <OpenQuickActionModalButton class="mb-4" />
      </div>
      <div v-if="!showGrid" class="flex flex-col gap-4 lg:hidden">
        <template v-for="item in list" :key="item.key">
          <ProjectCard v-if="item.type === CardTypes.Project" :project="item.data" />
          <MediaPlayerCard v-else-if="item.type === CardTypes.MediaPlayer" />
          <GitHubCommitCard v-else-if="item.type === CardTypes.GitHubCommit" />
          <PhoneBatteryCard v-else-if="item.type === CardTypes.PhoneBattery" />
          <ClockCard v-else-if="item.type === CardTypes.Clock" />
        </template>
      </div>
      <div v-if="showGrid" class="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <div class="flex flex-col gap-4 lg:gap-8" v-for="(col, index) in grids[1] || []" :key="index">
          <template v-for="item in col || []" :key="item.key">
            <ProjectCard v-if="item.type === CardTypes.Project" :project="item.data" />
            <MediaPlayerCard v-else-if="item.type === CardTypes.MediaPlayer" />
            <GitHubCommitCard v-else-if="item.type === CardTypes.GitHubCommit" />
            <PhoneBatteryCard v-else-if="item.type === CardTypes.PhoneBattery" />
            <ClockCard v-else-if="item.type === CardTypes.Clock" />
          </template>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { useWindowSize, get } from "@vueuse/core";
// @ts-ignore
import { v4 as uuid } from "uuid";

enum CardTypes {
  Project = "project",
  MediaPlayer = "currently-listening",
  GitHubCommit = "recent-github-commit",
  PhoneBattery = "phone-battery",
  Clock = "current-time",
}

interface CardObject {
  type: CardTypes;
  data: any | null;
  key: string;
}

// fetch projects from api
const { data: projects } = await useFetch('/api/v1/projects?featured_first=true');

// fetch fun cards order from api
const { data: funCards } = await useFetch('/api/v1/fun/home_page_list');

const projectsList = ref<CardObject[]>([]);

// add projects
if (get(projects) !== null) {
  get(projects)!.data.forEach((project: any) => {
    get(projectsList).push({
      type: CardTypes.Project,
      data: project,
      key: uuid(),
    });
  });
}

// make the list
const list = ref<CardObject[]>(get(projectsList));

// add fun cards to the list
if (get(funCards) !== null) {
  let spliceIndex = 0;

  get(funCards)!.forEach((type: any) => {
    get(list).splice(spliceIndex, 0, {
      type: type as CardTypes,
      data: null,
      key: uuid(),
    });

    spliceIndex += 3;
  });
}

// generate grid
const grids = ref<CardObject[][][]>([]);
for (let c = 1; c <= 3; c++) {
  const grid: CardObject[][] = [];
  for (let i = 0; i < c; i++) {
    grid.push([]);
  }
  for (let i = 0; i < get(list).length; i++) {
    grid[i % c].push(get(list)[i]);
  }
  get(grids).push(grid);
}

const { width: windowWidth } = useWindowSize()

const showGrid = computed(() => {
  return get(windowWidth) > 1024
})
</script>