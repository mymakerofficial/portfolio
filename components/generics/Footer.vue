<template>
  <footer class="m-12 md:m-16">
    <div class="flex flex-col md:flex-row gap-8 justify-between text-md text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600">
      <div class="flex flex-col gap-8">
        <div class="flex flex-wrap gap-4 underline">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/projects">Projects</NuxtLink>
          <NuxtLink to="/games">Games</NuxtLink>
          <NuxtLink to="/faq">FAQ</NuxtLink>
          <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
          <GenericButton :href="emailUrl">Contact</GenericButton>
        </div>
        <div class="flex flex-col gap-2">
          <p class="flex items-center gap-1">
            Proudly build with <NuxtIcon class="h-4 inline" /> Nuxt and other awesome technologies.
          </p>
          <p>
            © 2023 - {{ year }} My_Maker. All rights reserved. All trademarks are property of their respective owners.
          </p>
        </div>
      </div>
      <div class="flex gap-6 mt-auto">
        <ColorModeSwitcher />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NuxtIcon from "~/components/icons/NuxtIcon.vue";
import ColorModeSwitcher from "~/components/goodies/ColorModeSwitcher.vue";
import GenericButton from "~/components/forms/GenericButton.vue";

const emailUrl = import.meta.env.VITE_EMAIL_URL;
const year = new Date().getFullYear();
</script>
