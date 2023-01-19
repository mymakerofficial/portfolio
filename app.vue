<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'dark:bg-gray-900 dark:text-gray-100',
  },
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: '%s - My_Maker',
  title: 'Home',
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