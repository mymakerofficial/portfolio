<template>
  <Container class="2xl:w-11/12">
    <div class="flex flex-col gap-12 my-12">
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-extrabold">My_Maker</h1>
        <div class="text-sm font-medium text-gray-600 dark:text-gray-200">Hai im My_Maker, I like making things</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div class="flex flex-col gap-4 md:gap-8" v-for="(col, index) in grids[1] || []" :key="index">
          <template v-for="item in col || []" :key="item.key">
            <ProjectCard v-if="item.type === 0" :project="item.data" />
            <CurrentGameCard v-else-if="item.type === 1"/>
            <MediaPlayerCard v-else-if="item.type === 2" />
            <PhoneBatteryCard v-else-if="item.type === 3" />
            <ClockCard v-else-if="item.type === 4" />
            <GitHubCommitCard v-else-if="item.type === 5" />
          </template>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
// @ts-ignore
import { v4 as uuid } from "uuid";

enum CardTypes {
  Project, // first entry must be project
  CurrentGame,
  MediaPlayer,
  PhoneBattery,
  Clock,
  GitHubCommit,
}

interface CardObject {
  type: CardTypes;
  data: any | null;
  key: string;
}

export default defineNuxtComponent({
  async asyncData () {
    // fetch projects from api
    const { data: projects } = await useFetch('/api/v1/projects');

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

    // sort by date
    let sortedProjectsList: CardObject[] = projectsList.sort((a, b) => {
      return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });

    // sort featured projects to the top
    const featuredProjects = sortedProjectsList.filter((item) => item.data.featured);
    const nonFeaturedProjects = sortedProjectsList.filter((item) => !item.data.featured);
    sortedProjectsList = [...featuredProjects, ...nonFeaturedProjects];

    // figure out how many fun cards there are
    let funCardsCount = Object.keys(CardTypes).length / 2;

    // generate random order for fun cards
    let funCardsOrder: number[] = [];
    for (let i = 1; i < funCardsCount; i++) {
      funCardsOrder.push(i);
    }
    funCardsOrder.sort((a) => {
      let val = Math.random() - 0.5

      // make media player, clock, and github card commit more likely to be on top
      if (a === CardTypes.MediaPlayer || a === CardTypes.Clock || a === CardTypes.GitHubCommit) {
        val -= 0.1;
      }

      return val;
    });

    // add fun cards to the list
    let list: CardObject[] = sortedProjectsList;
    let spliceIndex = Math.floor(Math.random() + 0.5); // add first card at either first or second position
    for (let i = 0; i < funCardsOrder.length; i++) {
      list.splice(spliceIndex, 0, {
        type: funCardsOrder[i] as CardTypes,
        data: null,
        key: uuid(),
      });

      spliceIndex += 3 + Math.floor(Math.random() + 0.5); // add next card either 3 or 4 position later
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

    return {
      projectsList,
      sortedProjectsList,
      list,
      grids,
    }
  },
});
</script>