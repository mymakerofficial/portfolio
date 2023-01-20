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
  Project,
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
    const { data: projects } = await useFetch('/api/v1/projects');

    let list: CardObject[] = [];

    if (projects.value !== null) {
      projects.value.forEach((project: any) => {
        list.push({
          type: CardTypes.Project,
          data: project,
          key: uuid(),
        });
      });
    }

    // add fun cards
    for (let i = 1; i < 6; i++) {
      list.push({
        type: i as CardTypes,
        data: null,
        key: uuid(),
      });
    }

    const processedList: CardObject[] = list.sort((a, b) => {
      let val = 0.5 - Math.random();
      if (b.data?.featured) val += 0.4;
      if (a.data?.featured) val -= 0.4;

      if (b.type !== CardTypes.Project) val += 0.2;
      if (a.type !== CardTypes.Project) val -= 0.2;

      if (b.type === CardTypes.MediaPlayer) val += 0.3;
      if (a.type === CardTypes.MediaPlayer) val -= 0.3;
      return val;
    });

    const grids: CardObject[][][] = [];
    for (let c = 1; c <= 3; c++) {
      const grid: CardObject[][] = [];
      for (let i = 0; i < c; i++) {
        grid.push([]);
      }
      for (let i = 0; i < processedList.length; i++) {
        grid[i % c].push(processedList[i]);
      }
      grids.push(grid);
    }

    return {
      list,
      processedList,
      grids,
    }
  },
});
</script>