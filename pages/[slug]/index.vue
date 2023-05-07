<template>
  <Container class="2xl:w-7/12 p-8 mb-12">
    <div class="md:mx-6">
      <NuxtLink to="/">
        <GenericButton class="flex gap-2 items-center"><SvgIcon type="mdi" :path="mdiArrowLeft" class="h-4" /> Home</GenericButton>
      </NuxtLink>
    </div>
    <ContentRenderer :value="data" :class="bodyClass" />
  </Container>
</template>
<script setup lang="ts">
import Container from "~/components/generics/Container.vue";
import {createError, useAsyncData, useRoute} from "#app";
import {defineOgImageScreenshot, queryContent} from "#imports";
import tiptapDefaultOptions from "~/lib/tiptapDefaultOptions";
import GenericButton from "~/components/forms/GenericButton.vue";
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft } from '@mdi/js';
import {get} from "@vueuse/core";
import {useSeoMeta} from "unhead";

const route = useRoute();

const bodyClass = tiptapDefaultOptions.editorProps.attributes.class;

const { data, error } = await useAsyncData("content", () =>
  queryContent().where({ _path: route.path }).findOne()
);

if (get(error)) {
  throw createError({
    statusCode: 404,
    fatal: false,
    message: `Page not found: ${route.path}`
  });
}

if (get(data)) {
  useSeoMeta({
    title:  get(data)?.title,
    description:  get(data)?.description,
  })
}

defineOgImageScreenshot({
  width: 1280,
  height: 720,
  colorScheme: 'dark',
  mask: '.toast, nav',
});
</script>