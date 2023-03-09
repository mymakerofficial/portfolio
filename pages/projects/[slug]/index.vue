<template>
  <main>
    <ProjectPageHero :project="project" v-if="project.thumbnailUrl" />
    <div class="lg:w-4/5 2xl:w-3/5 m-auto mb-40 md:mb-48">
      <div class="flex flex-col gap-16 my-12 lg:my-24">
        <div v-if="!project.thumbnailUrl" class="px-8 md:px-12">
          <div class="flex flex-wrap lg:flex-row gap-8 justify-between items-center" :class="{'sm:px-8 md:w-4/5 lg:w-auto xl:w-4/5 lg:m-auto': !!bodyHtml}">
            <div>
              <h1 class="text-2xl md:text-4xl xl:text-5xl font-extrabold text-gray-800 dark:text-gray-100">{{ project.displayName }}</h1>
            </div>
            <div class="lg:basis-1/3 lg:flex lg:justify-end" v-if="project.websiteUrl">
              <FlatButton :href="project.websiteUrl" target="_blank">Visit Website</FlatButton>
            </div>
          </div>
        </div>
        <div class="px-8 md:px-12">
          <article v-html="bodyHtml" :class="bodyClass" />
        </div>
        <DetailsPanel class="mx-8 md:mx-0">
          <DetailsPanelCard v-if="project.disclosure.text">
            <template #title>{{project.disclosure.heading || 'Info'}}</template>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200 lg:w-3/4">{{ project.disclosure.text }}</p>
          </DetailsPanelCard>
          <DetailsPanelCard>
            <template #title>Timeline</template>
            <TimelineWrapper>
              <TimelineItem title="started" :text="startedHumanReadable" v-if="project.startedDate !== null" />
              <TimelineDash v-if="project.startedDate !== null && project.releaseDate !== null" />
              <TimelineItem title="published" :text="releasedHumanReadable" v-if="project.releaseDate !== null" />
              <TimelineDash v-if="project.startedDate !== null && project.lastCommitDateTime !== null" />
              <TimelineItem title="last changed" :text="lastChangedHumanReadable" v-if="project.lastCommitDateTime !== null" />
            </TimelineWrapper>
          </DetailsPanelCard>
          <DetailsPanelCard v-if="project.collaborators.length > 0">
            <template #title>Collaborators</template>
            <div class="flex flex-wrap gap-4 items-center">
              <div v-for="collaborator in project.collaborators" :key="collaborator.slug">
                <NuxtLink :href="collaborator.websiteUrl || `/projects?q=%3D${collaborator.displayName}`" :target="collaborator.websiteUrl ? '_blank' : null" class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ collaborator.displayName }}</NuxtLink>
              </div>
            </div>
          </DetailsPanelCard>
          <DetailsPanelCard v-if="project.technologies.length > 0" class="row-span-2">
            <template #title>Tech Stack</template>
            <div class="flex flex-col gap-4">
              <div v-for="type in project.technologies" :key="type.slug" class="flex flex-col md:flex-row gap-4">
                <div>
                  <NuxtLink :href="`/projects?group_by=technology-type:${type.slug}`" class="text-md md:text-sm font-medium text-gray-500">{{ type.displayName }}</NuxtLink>
                </div>
                <div class="flex flex-wrap gap-2 md:gap-4">
                  <div v-for="tech in type.technologies" :key="tech.slug">
                    <NuxtLink :href="`/projects?q=%3D${tech.slug}`" class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ tech.displayName }}</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </DetailsPanelCard>
          <DetailsPanelCard v-for="repo in project.repositories" :href="repo.url" target="_blank" :kex="repo.owner + repo.name">
            <template #title><SvgIcon type="mdi" :path="mdiGithub" class="h-8" />{{project.repositories.length > 1 && repo.title ? repo.title : "Repository"}}</template>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ repo.owner }}/{{ repo.name }}</p>
          </DetailsPanelCard>
          <DetailsPanelCard v-if="project.tags.length > 0">
            <div class="flex flex-wrap gap-x-2 gap-y-3 items-center">
              <div v-for="tag in project.tags" :key="tag.slug">
                <NuxtLink :href="`/projects?q=%3D${tag.displayName}`" class="py-1 px-3 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">{{ tag.displayName }}</NuxtLink>
              </div>
            </div>
          </DetailsPanelCard>
        </DetailsPanel>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import {generateHTML} from "@tiptap/html";
import tiptapDefaultOptions from "~/lib/tiptapDefaultOptions";
import {get} from "@vueuse/core";
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub } from '@mdi/js';
import {useFetch, useHead, useRoute} from "#app";
import {computed} from "vue";
import ProjectPageHero from "~/components/projectpage/ProjectPageHero.vue";
import DetailsPanel from "~/components/detailspanel/DetailsPanel.vue";
import DetailsPanelCard from "~/components/detailspanel/DetailsPanelCard.vue";
import TimelineWrapper from "~/components/timeline/TimelineWrapper.vue";
import TimelineItem from "~/components/timeline/TimelineItem.vue";
import FlatButton from "~/components/forms/FlatButton.vue";

const { data: project, error} = await useFetch(`/api/v1/projects/${useRoute().params.slug}`)

if (get(error)) {
  throw createError(get(error)!);
}

if (get(project)) {
  useHead({
    title: get(project).displayName,
    meta: [
      {
        name: 'description',
        content: get(project).summary,
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:site_name',
        content: 'maiker.de',
      },
      {
        name: 'og:title',
        content: get(project).displayName,
      },
      {
        name: 'og:description',
        content: get(project).summary,
      },
      {
        name: 'og:image',
        content: get(project).thumbnailUrl,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: get(project).displayName,
      },
      {
        name: 'twitter:description',
        content: get(project).summary,
      },
      {
        name: 'twitter:image',
        content: get(project).thumbnailUrl,
      }
    ]
  })
} else {
  useHead({
    title: "Project not found",
  })
}


const startedHumanReadable = computed(() => dayjs(get(project)?.startedDate).format('MMMM D, YYYY'));
const releasedHumanReadable = computed(() => dayjs(get(project)?.releaseDate).format('MMMM D, YYYY'));
const lastChangedHumanReadable = computed(() => dayjs(get(project)?.lastCommitDateTime).format('MMMM D, YYYY'));
const bodyHtml = computed(() => get(project)?.bodyProse ? generateHTML(get(project)?.bodyProse, tiptapDefaultOptions.extensions) : "");
const bodyClass = computed(() => tiptapDefaultOptions.editorProps.attributes.class);
</script>