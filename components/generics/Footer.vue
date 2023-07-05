<template>
  <footer class="m-12 md:m-16">
    <div class="text-md text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600">
      <hr class="w-8 h-1 mb-16 bg-gray-300 dark:bg-gray-800 border-none rounded-full" />
      <div class="flex flex-col md:flex-row gap-8 justify-between">
        <div class="flex flex-col gap-8">
          <div class="flex flex-wrap gap-4 underline">
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/projects">Projects</NuxtLink>
            <NuxtLink to="/games">Games</NuxtLink>
            <NuxtLink to="/faq">FAQ</NuxtLink>
            <NuxtLink to="/services">Services</NuxtLink>
            <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
          </div>
          <div class="flex flex-col gap-2">
            <p>
              Proudly build with <NuxtIcon class="h-4 inline" /> Nuxt and other awesome technologies.
            </p>
            <p>
              © 2023 My_Maker. All rights reserved.
            </p>
          </div>
        </div>
        <div class="flex gap-6 mt-auto">
          <QuickactionsOpenQuickActionModalButton />
          <ColorModeSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NuxtIcon from "~/components/icons/NuxtIcon.vue";
import ColorModeSwitcher from "~/components/goodies/ColorModeSwitcher.vue";
</script>
