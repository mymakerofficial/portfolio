<template>
  <div class="mx-3 sm:mx-auto sm:w-3/4 lg:w-2/3 2xl:w-11/12 max-w-7xl">
    <div class="flex flex-col gap-12 my-12">
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-extrabold">My_Maker</h1>
        <div class="text-sm font-medium text-neutral-600">Hai im My_Maker, I like making things</div>
      </div>
      <div class="flex flex-col xl:grid xl:grid-cols-3 gap-4 md:gap-8">
        <div class="flex flex-col gap-4 md:gap-8" v-for="(col, index) in grid || []" :key="index">
          <div v-for="(item, index) in col || []" :key="index">
            <ProjectCard v-if="item.type === 0" :project="item.data" />
            <CurrentGameCard v-else-if="item.type === 1"/>
            <MediaPlayerCard v-else-if="item.type === 2" />
            <PhoneBatteryCard v-else-if="item.type === 3" />
            <ClockCard v-else-if="item.type === 4" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
        });
      });
    }

    list.push({
      type: CardTypes.CurrentGame,
      data: null,
    });

    list.push({
      type: CardTypes.MediaPlayer,
      data: null,
    });

    list.push({
      type: CardTypes.PhoneBattery,
      data: null,
    });

    list.push({
      type: CardTypes.Clock,
      data: null,
    });

    const shuffledList: CardObject[] = list.sort(() => 0.5 - Math.random());

    const grid: CardObject[][] = [[], [], []];
    for (let i = 0; i < shuffledList.length; i++) {
      grid[i%3].push(shuffledList[i]);
    }

    return {
      list,
      shuffledList,
      grid,
    }
  },
});
</script>