<template>
  <Container class="2xl:w-11/12">
    <div class="flex flex-col gap-12 md:gap-32 mt-12 mb-40 md:mt-32 md:mb-48">
      <HomePageHero />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <div class="flex flex-col gap-4 lg:gap-8" v-for="(col, index) in grids[1] || []" :key="index">
          <template v-for="item in col || []" :key="item.key">
            <ProjectCard v-if="item.type === CardTypes.Project" :project="item.data" />
            <MediaPlayerCard v-else-if="item.type === CardTypes.MediaPlayer" />
            <GitHubCommitCard v-else-if="item.type === CardTypes.GitHubCommit" />
            <PhoneBatteryCard v-else-if="item.type === CardTypes.PhoneBattery" />
            <ClockCard v-else-if="item.type === CardTypes.Clock" />
            <CurrentGameCard v-else-if="item.type === CardTypes.CurrentGame"/>
          </template>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
// @ts-ignore
import { v4 as uuid } from "uuid";

enum CardTypes {
  Project = "project",
  MediaPlayer = "currently-listening",
  GitHubCommit = "recent-github-commit",
  PhoneBattery = "phone-battery",
  Clock = "current-time",
  CurrentGame = "currently-playing",
}

interface CardObject {
  type: CardTypes;
  data: any | null;
  key: string;
}

// fetch projects from api
const { data: projects } = await useFetch('/api/v1/projects');

// fetch fun cards order from api
const { data: funCards } = await useFetch('/api/v1/fun/home_page_list');

let projectsList: CardObject[] = [];

// add projects
if (projects.value !== null) {
  projects.value.forEach((project: any) => {
    projectsList.push({
      type: CardTypes.Project,
      data: project,
      key: uuid(),
    });
  });
}

// sort featured projects to the top
const featuredProjects = projectsList.filter((item) => item.data.featured);
const nonFeaturedProjects = projectsList.filter((item) => !item.data.featured);
const sortedProjectsList = [...featuredProjects, ...nonFeaturedProjects];

// make the list
let list: CardObject[] = sortedProjectsList;

// add fun cards to the list
if (funCards.value) {
  let spliceIndex = 0;

  funCards.value.forEach((type: any) => {
    list.splice(spliceIndex, 0, {
      type: type as CardTypes,
      data: null,
      key: uuid(),
    });

    spliceIndex += 3;
  });
}

// generate grid
const grids: CardObject[][][] = [];
for (let c = 1; c <= 3; c++) {
  const grid: CardObject[][] = [];
  for (let i = 0; i < c; i++) {
    grid.push([]);
  }
  for (let i = 0; i < list.length; i++) {
    grid[i % c].push(list[i]);
  }
  grids.push(grid);
}
</script>