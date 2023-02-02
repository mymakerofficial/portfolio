<template>
  <div>
    <ClientOnly>
      <QuickActionModal v-model:active="quickActionModalActive" />
    </ClientOnly>
    <NavBarWrapper :options="navBarOptions" :active="navBarActive" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import {NavBarOption} from "~/components/NavBarWrapper.vue";
import {useMagicKeys, whenever} from "@vueuse/core";

const navBarOptions: NavBarOption[] = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
]

let quickActionModalActive = ref(false);

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k')
      e.preventDefault()
  },
})

whenever(ctrl_k, () => {
  quickActionModalActive.value = !quickActionModalActive.value;
})

let navBarActive = computed(() => {
  return navBarOptions.some(option => option.href === useRoute().path) && !quickActionModalActive.value;
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