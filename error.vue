<template>
  <main>
    <Container class="2xl:w-11/12 sm:py-12 lg:py-0">
      <div class="h-screen p-6 flex flex-col lg:justify-center gap-6">
        <div class="flex flex-col lg:flex-row gap-3 lg:items-end">
          <h1 class="text-4xl font-bold">{{error.statusCode}}</h1>
          <h2 class="text-2xl font-bold flex gap-3 items-center">{{ statusMessage }}</h2>
        </div>
        <p class="text-gray-800 dark:text-gray-300">message: {{ error.message }}</p>
        <div v-if="error.stack && isDev" v-html="error.stack" class="text-gray-800 dark:text-gray-300 overflow-x-auto"></div>
        <div>
          <FlatButton @click="handleError">Go Home</FlatButton>
        </div>
      </div>
    </Container>
  </main>
</template>

<script setup lang="ts">
import {clearError, NuxtError} from "#app";
import Container from "~/components/generics/Container.vue";
import {computed} from "vue";
import FlatButton from "~/components/forms/FlatButton.vue";
import {useHead, useSeoMeta} from "unhead";
import {get} from "@vueuse/core";

const props = defineProps<{
  error: NuxtError
}>();

const messages: Record<number, string> = {
  401: 'You are not authorized to view this page.',
  403: 'You are not authorized to view this page.',
  404: 'The page you are looking for does not exist.',
  418: 'The server could not respond to your request because it is a teapot.',
  500: 'Something went wrong on our end. Please try again later.',
};

const statusMessage = computed(() => {
  return messages[props.error.statusCode] || 'Whoops! Something went wrong';
});

const isDev = import.meta.env.DEV;

const handleError = () => clearError({ redirect: '/' });

useSeoMeta({
  title: `${props.error.statusCode} - ${get(statusMessage)}`,
  description:  props.error.message,
});

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    }
  ]
})
</script>
