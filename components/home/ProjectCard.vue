<template>
  <div>
    <DraggableSticker v-if="stickers.isJs" class="absolute right-[10%] top-10 z-10" :rotation-randomize="30" :x-randomize="30" :y-randomize="30">
      <JsSticker class="h-16 md:h-20 pointer-events-none" />
    </DraggableSticker>
    <DraggableSticker v-if="stickers.isTs" class="absolute right-[10%] top-10 z-10" :rotation-randomize="30" :x-randomize="30" :y-randomize="30">
      <TsSticker class="h-16 md:h-20 pointer-events-none" />
    </DraggableSticker>
    <DraggableSticker v-if="stickers.isVue" class="absolute right-8 md:-right-4 bottom-0 z-10" :rotation="-10" :rotation-randomize="4" :x-randomize="30" :y-randomize="20">
      <VueSticker class="h-16 md:h-20 pointer-events-none" />
    </DraggableSticker>
    <DraggableSticker v-if="stickers.isNuxt" class="absolute right-8 bottom-0 z-10" :rotation="-10" :rotation-randomize="4" :x-randomize="30" :y-randomize="20">
      <NuxtSticker class="h-16 md:h-20 pointer-events-none" />
    </DraggableSticker>
    <DraggableSticker v-if="stickers.isChess" class="absolute right-[5%] -top-2 z-10" :rotation="-14">
      <ChessSticker class="h-16 md:h-20 pointer-events-none" />
    </DraggableSticker>
    <NuxtLink :to="project.htmlUrl" class="rounded-2xl">
      <Card :hoverable="true" class="flex flex-col gap-6 p-8">
        <div v-if="showThumbnail" class="w-full aspect-video rounded-lg overflow-hidden">
          <img :src="project.thumbnailUrl" :alt="project.displayName" class="absolute w-full h-full z-10" />
          <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
        </div>
        <div class="flex flex-col gap-3">
          <time :datetime="project.date" class="text-xs text-gray-900 dark:text-gray-100">{{dateFormatted}}</time>
          <h1 class="text-2xl text-gray-900 dark:text-gray-100 font-bold">{{project.displayName}}</h1>
        </div>
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-400 group-hover/card:text-gray-900 group-hover/card:dark:text-gray-100 duration-500 ease-in-out">{{project.summary}}</p>
        </div>
      </Card>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import {CompactProjectInfo} from "~/lib/projects";
import Card from "~/components/generics/Card.vue";
import {computed, reactive} from "vue";
import dayjs from "dayjs";
import DraggableSticker from "~/components/stickers/DraggableSticker.vue";
import ChessSticker from "~/components/stickers/ChessSticker.vue";
import JsSticker from "~/components/stickers/JsSticker.vue";
import TsSticker from "~/components/stickers/TsSticker.vue";
import VueSticker from "~/components/stickers/VueSticker.vue";
import NuxtSticker from "~/components/stickers/NuxtSticker.vue";

const props = defineProps<{
  project: CompactProjectInfo
  showThumbnail?: boolean;
}>();

const dateFormatted = computed(() => dayjs(props.project.date).format('MMMM, YYYY'))

const stickers = reactive({
  isChess: computed(() => props.project.tags.includes('chess')),
  isJs: computed(() => props.project.technologies.includes('js') && !props.project.technologies.includes('ts')),
  isTs: computed(() => props.project.technologies.includes('ts')),
  isVue: computed(() => (props.project.technologies.includes('vue-2') || props.project.technologies.includes('vue-3')) && !props.project.technologies.includes('nuxt-3')),
  isNuxt: computed(() => props.project.technologies.includes('nuxt-3')),
});
</script>