<template>
  <div class="flex flex-col gap-12 md:gap-16 my-12 md:my-36">
    <section class="md:mb-16">
      <HomePageHero />
    </section>
    <main>
      <Container class="2xl:w-5/12">
        <div class="flex flex-col gap-4">
          <template v-for="item in list" :key="item.key">
            <ProjectCard v-if="item.type === CardType.Project" :project="item.data" />
            <PlaceholderCard v-else-if="item.type === CardType.Placeholder" />
            <MediaPlayerCard v-else-if="item.type === CardType.MediaPlayer" :data="item.data" />
            <GitHubCommitCard v-else-if="item.type === CardType.GitHubCommit" :data="item.data" />
            <PhoneBatteryCard v-else-if="item.type === CardType.PhoneBattery" :data="item.data" />
            <ClockCard v-else-if="item.type === CardType.Clock" />
          </template>
        </div>
      </Container>
    </main>
  </div>
</template>

<script setup lang="ts">
import { get, set} from "@vueuse/core";
// @ts-ignore
import { v4 as uuid } from "uuid";
import {useFetch} from "#app";
import {computed, nextTick, onMounted, ref} from "vue";
import HomePageHero from "~/components/home/HomePageHero.vue";
import Container from "~/components/generics/Container.vue";
import ProjectCard from "~/components/home/ProjectCard.vue";
import PlaceholderCard from "~/components/funcards/PlaceholderCard.vue";
import MediaPlayerCard from "~/components/funcards/MediaPlayerCard.vue";
import GitHubCommitCard from "~/components/funcards/GitHubCommitCard.vue";
import PhoneBatteryCard from "~/components/funcards/PhoneBatteryCard.vue";
import ClockCard from "~/components/funcards/ClockCard.vue";
import {defineOgImageScreenshot} from "#imports";
import {useSeoMeta} from "unhead";

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

useSeoMeta({
  title: "My_Maker",
  description:  "Hai Im My_Maker. Making mostly dumb websites and games online. Find all my projects and other random stuff here about me here."
});

defineOgImageScreenshot({
  width: 1280,
  height: 720,
  colorScheme: 'dark',
  mask: '.fun-card, .toast',
});

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