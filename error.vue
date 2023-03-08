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
          <Button @click="handleError">Go Home</Button>
        </div>
      </div>
    </Container>
  </main>
</template>

<script setup lang="ts">
import {clearError, NuxtError, useHead} from "#app";
import Container from "~/components/generics/Container.vue";
import {computed} from "vue";

const props = defineProps<{
  error: NuxtError
}>();

useHead({
  bodyAttrs: {
    class: 'dark:bg-gray-900 dark:text-gray-100',
  },
  htmlAttrs: {
    lang: 'en',
  },
  title: props.error.message,
});

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

const handleError = () => clearError({ redirect: '/' })
</script>
