<template>
  <footer class="mx-auto px-8 my-24">
    <div class="flex flex-col gap-4 text-center text-md text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600">
      <p>
        Proudly build with <NuxtIcon class="h-4 inline" /> Nuxt and other awesome technologies.
      </p>
      <div class="flex gap-4 justify-center underline">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/projects">Projects</NuxtLink>
        <NuxtLink to="/legal">Privacy Policy</NuxtLink>
      </div>
      <p>
        © 2023 My_Maker. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NuxtIcon from "~/components/icons/NuxtIcon.vue";
</script>
