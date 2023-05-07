<template>
  <footer class="mx-auto px-8 my-24">
    <div class="flex flex-col gap-8 text-center text-md text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600">
      <div class="flex flex-col gap-8">
        <div class="flex flex-row gap-8 justify-center items-center">
          <QuickactionsOpenQuickActionModalButton />
          <ColorModeSwitcher />
        </div>
        <div class="flex gap-4 justify-center underline">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/projects">Projects</NuxtLink>
          <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p>
          Proudly build with <NuxtIcon class="h-4 inline" /> Nuxt and other awesome technologies.
        </p>
        <p>
          © 2023 My_Maker. All rights reserved. All trademarks are property of their respective owners.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NuxtIcon from "~/components/icons/NuxtIcon.vue";
import ColorModeSwitcher from "~/components/goodies/ColorModeSwitcher.vue";
</script>
