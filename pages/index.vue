<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl">
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { v4 as uuid } from "uuid";

enum CardTypes {
  Project,
  CurrentGame,
  MediaPlayer,
  PhoneBattery,
  Clock
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

    list.push({
      type: CardTypes.CurrentGame,
      data: null,
      key: uuid(),
    });

    list.push({
      type: CardTypes.MediaPlayer,
      data: null,
      key: uuid(),
    });

    list.push({
      type: CardTypes.PhoneBattery,
      data: null,
      key: uuid(),
    });

    list.push({
      type: CardTypes.Clock,
      data: null,
      key: uuid(),
    });

    const processedList: CardObject[] = list.sort((a, b) => {
      let val = 0.5 - Math.random();
      if (b.data?.featured) val += 0.1;
      if (b.type !== CardTypes.Project) val += 0.3;
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