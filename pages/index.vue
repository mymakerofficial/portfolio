<template>
  <div class="flex flex-col gap-12 md:gap-28 my-12 md:my-36">
    <section>
      <HomePageHero />
    </section>
    <main>
      <Container class="2xl:w-5/12">
        <div class="flex flex-col gap-6">
          <template v-for="(item, index) in list" :key="item.key">
            <ProjectCard
              v-if="item.type === CardType.Project"
              :project="item.data"
              show-stickers
              :show-thumbnail="showThumbnail(index, item.data)"
            />
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
import {defineOgImageScreenshot, useProjectsList} from "#imports";
import {useSeoMeta} from "unhead";
import {CompactProjectInfo} from "~/lib/projects";

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
  description:  "Hai Im My_Maker. Making mostly silly websites and games online. Find all my projects and other random stuff here about me here."
});

defineOgImageScreenshot({
  width: 1280,
  height: 720,
  colorScheme: 'dark',
  mask: '.fun-card, .toast, nav, .header-nav-buttons',
});

// fetch projects
const projects = await useProjectsList({
  limit: 10,
  featuredFist: true,
});

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

  let spliceIndex = 2;
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
  
  // add media player card
  await getMediaPlayerItem().then((mediaPlayerCard) => {
    if (mediaPlayerCard.data?.contentId !== null) {
      cards.push(mediaPlayerCard);
    }
  }).catch(console.error)

  // add github commit card
  await getGitHubCommitItem().then((githubCommitCard) => {
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
  }).catch(console.error)

  // add phone battery card
  await getPhoneBatteryItem().then((phoneBatteryCard) => {
    cards.push(phoneBatteryCard);
  }).catch(console.error)

  // add time card at random position
  await getTimeCardItem().then((timeCard) => {
    cards.splice(Math.floor(Math.random() * (cards.length - 1) + 1), 0, timeCard);
  }).catch(console.error)

  set(funCards, cards);
}

function showThumbnail(index: number, project: CompactProjectInfo) {
  if (index === 0) {
    return true
  }
  if (!project.featured) {
    return false;
  }
  if (project.type === "game") {
    return true
  }
  return false
}

onMounted(async () => {
  await nextTick();
  await createFunCards();
})
</script>
