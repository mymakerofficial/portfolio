<template>
  <div>
    <ClientOnly>
      <QuickActionModal v-model:active="quickActionModalActive" />
    </ClientOnly>
    <NavBarWrapper :options="navBarOptions" :active="navBarActive" />
    <NuxtLoadingIndicator color="#f6f8fa" :height="2" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHandWave, mdiLightbulb } from '@mdi/js';
import {NavBarOption} from "~/components/NavBarWrapper.vue";
import {get, set, useMagicKeys, useScroll, whenever} from "@vueuse/core";

const navBarOptions: NavBarOption[] = [
  { href: '/', label: 'home', iconPath: mdiHandWave },
  { href: '/projects', label: 'projects', iconPath: mdiLightbulb },
]

let quickActionModalActive = ref(false);

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k')
      e.preventDefault()
  },
})

const scrolledDown = ref(false);

whenever(ctrl_k, () => {
  set(quickActionModalActive, !get(quickActionModalActive));
})

let navBarActive = computed(() => {
  return !get(quickActionModalActive) && !get(scrolledDown);
})

onMounted(() => {
  // we need to do this here because the document is not available on the server

  const { y: pageYScroll } = useScroll(document);

  whenever(pageYScroll, (y) => {
    set(scrolledDown, y > 69);
  })
})

useHead({
  bodyAttrs: {
    class: 'dark:bg-gray-900 dark:text-gray-100',
  },
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} by My_Maker` : 'My_Maker';
  },
  meta: [
    {
      name: 'description',
      content: 'Hai im My_Maker, I like making things.',
    },
    {
      name: 'og:title',
      content: 'My_Maker',
    },
    {
      name: 'og:description',
      content: 'Hai im My_Maker, I like making things.',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: 'My_Maker',
    },
    {
      name: 'twitter:description',
      content: 'Hai im My_Maker, I like making things.',
    },
  ]
})
</script>