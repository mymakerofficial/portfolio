<template>
  <div class="flex flex-col gap-12 md:gap-16 my-12 md:my-36">
    <section class="md:mb-16">
      <HomePageHero />
    </section>
    <main>
      <Container class="2xl:w-11/12">
        <div v-if="!showGrid || windowWidth === Infinity" class="flex flex-col gap-4 lg:hidden">
          <template v-for="item in list" :key="item.key">
            <ProjectCard v-if="item.type === CardType.Project" :project="item.data" />
            <PlaceholderCard v-else-if="item.type === CardType.Placeholder" />
            <MediaPlayerCard v-else-if="item.type === CardType.MediaPlayer" :data="item.data" />
            <GitHubCommitCard v-else-if="item.type === CardType.GitHubCommit" :data="item.data" />
            <PhoneBatteryCard v-else-if="item.type === CardType.PhoneBattery" :data="item.data" />
            <ClockCard v-else-if="item.type === CardType.Clock" />
          </template>
        </div>
        <div v-if="showGrid || windowWidth === Infinity" class="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div class="flex flex-col gap-4 lg:gap-6" v-for="(col, index) in grid || []" :key="index">
            <template v-for="item in col || []" :key="item.key">
              <ProjectCard v-if="item.type === CardType.Project" :project="item.data" />
              <PlaceholderCard v-else-if="item.type === CardType.Placeholder" />
              <div v-else-if="item.type === CardType.Spacer" class="h-24" />
              <MediaPlayerCard v-else-if="item.type === CardType.MediaPlayer" :data="item.data" />
              <GitHubCommitCard v-else-if="item.type === CardType.GitHubCommit" :data="item.data" />
              <PhoneBatteryCard v-else-if="item.type === CardType.PhoneBattery" :data="item.data" />
              <ClockCard v-else-if="item.type === CardType.Clock" />
            </template>
          </div>
        </div>
      </Container>
    </main>
  </div>
</template>

<script setup lang="ts">
import {useWindowSize, get, set} from "@vueuse/core";
// @ts-ignore
import { v4 as uuid } from "uuid";

enum CardType {
  Project = "project",
  Placeholder = "placeholder",
  Spacer = "spacer",
  MediaPlayer = "currently-listening",
  GitHubCommit = "recent-github-commit",
  PhoneBattery = "phone-battery",
  Clock = "current-time",
}

interface CardItem {
  type: CardType;
  data: any | null;
  key: string;
}

// fetch projects from api
const { data: projects } = await useFetch('/api/v1/projects?featured_first=true');

// create project cards
const projectCards = ref<CardItem[]>([]);
if (get(projects)?.data !== null) {
  set(projectCards, get(projects)!.data.map(project => ({
    type: CardType.Project,
    data: project,
    key: uuid(),
  })))
}

// create placeholder cards
const funCards = ref<CardItem[]>();
set(funCards, Array(4).fill({
  type: CardType.Placeholder,
  data: null,
  key: uuid(),
}));

const list = computed(() => {
  const list: CardItem[] = [...get(projectCards)];

  let spliceIndex = 1;
  get(funCards)!.forEach((card: CardItem) => {
    list.splice(spliceIndex, 0, card);

    spliceIndex += 3;
  });

  return list;
})

const grid = computed(() => {
  const cols = 2;
  let grid: CardItem[][] = [];

  for (let i = 0; i < cols; i++) {
    grid.push([]);
  }
  for (let i = 0; i < get(list).length; i++) {
    grid[i % cols].push(get(list)[i]);
  }

  grid[1].unshift({
    type: CardType.Spacer,
    data: null,
    key: uuid(),
  });

  return grid;
})

const { width: windowWidth } = useWindowSize()

const showGrid = computed(() => {
  return get(windowWidth) > 1024
})

const getMediaPlayerItem = async () => {
  const { data } = await useFetch("/api/v1/fun/currently_listening");

  return {
    type: CardType.MediaPlayer,
    data: get(data),
    key: uuid(),
  } as CardItem;
}

const getGitHubCommitItem = async () => {
  const { data } = await useFetch("/api/v1/fun/recent_github_commit");

  return {
    type: CardType.GitHubCommit,
    data: get(data),
    key: uuid(),
  } as CardItem;
}

const getPhoneBatteryItem = async () => {
  const { data } = await useFetch("/api/v1/fun/phone_battery");

  return {
    type: CardType.PhoneBattery,
    data: get(data),
    key: uuid(),
  } as CardItem;
}

const getTimeCardItem = async () => {
  return {
    type: CardType.Clock,
    data: null,
    key: uuid(),
  } as CardItem;
}

const createFunCards = async () => {
  const cards: CardItem[] = [];

  const mediaPlayerCard = await getMediaPlayerItem();
  const githubCommitCard = await getGitHubCommitItem();
  const phoneBatteryCard = await getPhoneBatteryItem();
  const timeCard = await getTimeCardItem();

  // add media player card
  if (mediaPlayerCard.data?.contentId !== null) {
    cards.push(mediaPlayerCard);
  }

  // add github commit card
  if (githubCommitCard.data?.eventId !== null) {
    // add github commit card on top if it's less than 4 hours old
    if (
        new Date(githubCommitCard.data.createdAt).getTime() > (Date.now() - (1000 * 60 * 60 * 4)) // 4 hours
    ) {
      // add on top
      cards.unshift(githubCommitCard);
    } else {
      // add next
      cards.push(githubCommitCard);
    }
  }

  // add phone battery card
  cards.push(phoneBatteryCard);

  // add time card at random position
  cards.splice(Math.floor(Math.random() * (cards.length - 1) + 1), 0, timeCard);

  set(funCards, cards);
}

onMounted(async () => {
  await nextTick();
  await createFunCards();
})
</script>