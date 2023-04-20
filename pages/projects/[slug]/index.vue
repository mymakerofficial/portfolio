<template>
  <main>
    <div class="lg:w-4/5 xl:w-3/6 m-auto mb-40 md:mb-48">
      <div class="flex flex-col gap-16 my-12 lg:my-24 px-8">
        <ProjectPageHero :project="project" />
        <article v-html="bodyHtml" :class="bodyClass" />
        <DetailsPanel>
          <DetailsPanelCard v-for="(disclosure, index) in project.disclosures" :key="index">
            <template #title>{{disclosure.title || 'Info'}}</template>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200 lg:w-3/4">{{ disclosure.text }}</p>
          </DetailsPanelCard>
          <DetailsPanelCard>
            <template #title>Timeline</template>
            <TimelineWrapper>
              <TimelineItem title="started" :text="startedHumanReadable" v-if="project.startedDate !== null" />
              <TimelineItem title="published" :text="releasedHumanReadable" v-if="project.releaseDate !== null" />
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
          <DetailsPanelCardLink v-for="repo in project.repositories" :href="repo.url" target="_blank" :kex="repo.owner + repo.name">
            <template #title><SvgIcon type="mdi" :path="mdiGithub" class="h-8" />{{project.repositories.length > 1 && repo.title ? repo.title : "Repository"}}</template>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ repo.owner }}/{{ repo.name }}</p>
          </DetailsPanelCardLink>
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
import {generateHTML} from "@tiptap/html";
import tiptapDefaultOptions from "~/lib/tiptapDefaultOptions";
import {get, useDateFormat} from "@vueuse/core";
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub } from '@mdi/js';
import {useRoute, createError} from "#app";
import {computed} from "vue";
import ProjectPageHero from "~/components/projectpage/ProjectPageHero.vue";
import DetailsPanel from "~/components/detailspanel/DetailsPanel.vue";
import DetailsPanelCard from "~/components/detailspanel/DetailsPanelCard.vue";
import TimelineWrapper from "~/components/timeline/TimelineWrapper.vue";
import TimelineItem from "~/components/timeline/TimelineItem.vue";
import {useSeoMeta} from "unhead";
import DetailsPanelCardLink from "~/components/detailspanel/DetailsPanelCardLink.vue";
import {useProject} from "~/composables/useProject";

const { data: project, error} = await useProject(useRoute().params.slug as string)

const pageTitle = computed(() => {
  // create list of collaborators
  const collaborators = ["My_Maker", ...get(project)?.collaborators.map((c: any) => c.displayName).sort()];

  // limit to first 3 collaborators
  if (collaborators.length > 3) {
    collaborators.splice(2, collaborators.length - 3, "more");
  }

  // generate human-readable string of collaborators, concat with "," and last with "and"
  const collaboratorsHumanReadable = collaborators.join(", ").replace(/,(?!.*,)/gmi, " and");

  return `${get(project)?.displayName} by ${collaboratorsHumanReadable}`;
});

if (get(error)) {
  throw createError(get(error)!);
}

if (get(project)) {
  useSeoMeta({
    title:  get(pageTitle),
    description:  get(project).summary,
    ogImage: get(project).thumbnailUrl,
  })
}


const startedHumanReadable = useDateFormat(get(project).startedDate, "MMMM D, YYYY");
const releasedHumanReadable = useDateFormat(get(project).releaseDate, "MMMM D, YYYY");
const lastChangedHumanReadable = useDateFormat(get(project).lastCommitDateTime, "MMMM D, YYYY");
const bodyHtml = computed(() => get(project)?.bodyProse ? generateHTML(get(project)?.bodyProse, tiptapDefaultOptions.extensions) : "");
const bodyClass = computed(() => tiptapDefaultOptions.editorProps.attributes.class);
</script>