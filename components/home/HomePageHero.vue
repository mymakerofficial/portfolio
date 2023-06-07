<template>
  <Container class="2xl:w-5/12">
    <div class="flex flex-col gap-8 justify-center mx-8 md:mx-12">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-loose">Hai I'm My_Maker.</h1>
        <div class="text-lg font-medium text-gray-900 dark:text-gray-100 leading-loose tracking-wide">
          Making mostly silly websites and games online.
          Developer and designer living in germany. Passionate about all things coding.
          Below you'll find all my projects and some other random stuff about me.
        </div>
      </div>
      <div class="text-gray-600 dark:text-gray-300 flex gap-8">
        <GenericButton class="inline-flex gap-2 font-medium" :href="gitHubUrl"><SvgIcon type="mdi" :path="mdiGithub" />GitHub</GenericButton>
        <GenericButton class="inline-flex gap-2 font-medium" :href="emailUrl"><SvgIcon type="mdi" :path="mdiEmailOutline" />Contact</GenericButton>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from "~/components/generics/Container.vue";
import GenericButton from "~/components/forms/GenericButton.vue";
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub, mdiEmailOutline } from '@mdi/js';

const gitHubUrl = import.meta.env.VITE_GITHUB_URL;
const emailUrl = import.meta.env.VITE_EMAIL_URL;
</script>