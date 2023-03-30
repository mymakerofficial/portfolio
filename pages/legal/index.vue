<template>
  <Container class="2xl:w-5/12 p-8 mb-12">
    <NuxtLink to="/">
      <GenericButton class="flex gap-2 items-center"><SvgIcon type="mdi" :path="mdiArrowLeft" class="h-4" /> Home</GenericButton>
    </NuxtLink>
    <ContentRenderer :value="data" :class="bodyClass" />
  </Container>
</template>
<script setup lang="ts">
import Container from "~/components/generics/Container.vue";
import {useAsyncData} from "#app";
import {queryContent} from "#imports";
import {computed} from "vue";
import tiptapDefaultOptions from "~/lib/tiptapDefaultOptions";
import GenericButton from "~/components/forms/GenericButton.vue";
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft } from '@mdi/js';

const { data } = await useAsyncData("content", () =>
  queryContent().where({ _path: "/legal" }).findOne()
);

const bodyClass = computed(() => tiptapDefaultOptions.editorProps.attributes.class);
</script>