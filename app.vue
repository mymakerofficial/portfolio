<template>
  <div>
    <NavBarWrapper :options="navBarOptions" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import {NavBarOption} from "~/components/NavBarWrapper.vue";

const navBarOptions: NavBarOption[] = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
]

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