<template>
  <Head>
    <Title>{{ project.displayName }}</Title>
    <Meta name="description" :content="project?.summary" />
    <Meta name="og:title" :content="project?.displayName" />
    <Meta name="og:description" :content="project?.summary" />
    <Meta name="og:image" :content="project?.thumbnailUrl" v-if="project?.thumbnailUrl"/>
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" :content="project?.displayName" />
    <Meta name="twitter:description" :content="project?.summary" />
    <Meta name="twitter:image" :content="project?.thumbnailUrl" v-if="project?.thumbnailUrl"/>
  </Head>

  <Container class="2xl:w-3/5 mb-40 md:mb-48">
    <div class="flex flex-col gap-16 my-12">
      <div class="flex flex-col gap-8">
        <div v-if="project?.thumbnailUrl" class="w-full aspect-video rounded-xl overflow-hidden">
          <img :src="project?.thumbnailUrl" :alt="project?.displayName" class="absolute w-full h-full z-10" />
          <div class="w-full h-full bg-gray-600/20 dark:bg-gray-100/20 animate-pulse" />
        </div>
        <div class="px-8 md:px-12 flex flex-col lg:flex-row gap-8 justify-between lg:items-center">
          <div>
            <h1 class="text-2xl md:text-4xl xl:text-6xl font-extrabold text-gray-800 dark:text-gray-100">{{ project?.displayName }}</h1>
          </div>
          <div class="lg:basis-1/3 lg:flex lg:justify-end" v-if="project?.websiteUrl">
            <a :href="project?.websiteUrl" target="_blank">
              <Button>Visit Website</Button>
            </a>
          </div>
        </div>
      </div>
      <div class="px-8 md:px-12">
        <article v-html="bodyHtml" :class="bodyClass" />
      </div>
      <DetailsPanel>
        <DetailsPanelSection :title="project?.disclosure?.heading || 'Info'" v-if="project?.disclosure?.text">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200 lg:w-3/4">{{ project.disclosure.text }}</p>
        </DetailsPanelSection>
        <DetailsPanelSection title="Timeline">
          <TimelineWrapper>
            <TimelineItem title="started" :text="startedHumanReadable" v-if="project?.startedDate !== null" />
            <TimelineDash v-if="project?.startedDate !== null && project?.releaseDate !== null" />
            <TimelineItem title="published" :text="releasedHumanReadable" v-if="project?.releaseDate !== null" />
            <TimelineDash v-if="project?.startedDate !== null && project?.lastCommitDateTime !== null" />
            <TimelineItem title="last changed" :text="lastChangedHumanReadable" v-if="project?.lastCommitDateTime !== null" />
          </TimelineWrapper>
        </DetailsPanelSection>
        <DetailsPanelSection title="Collaborators" v-if="project?.collaborators?.length > 0">
          <div class="flex flex-wrap gap-4 items-center">
            <div v-for="collaborator in project?.collaborators" :key="collaborator.slug">
              <a :href="collaborator.websiteUrl" target="_blank" class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ collaborator.displayName }}</a>
            </div>
          </div>
        </DetailsPanelSection>
        <DetailsPanelSection title="Tech Stack" v-if="project?.technologies?.length > 0">
          <div class="flex flex-col gap-4">
            <div v-for="type in project?.technologies" :key="type.slug" class="flex flex-col md:flex-row gap-4">
              <div>
                <span class="text-md md:text-sm font-medium text-gray-500">{{ type.displayName }}</span>
              </div>
              <div class="flex flex-wrap gap-2 md:gap-4">
                <div v-for="tech in type.technologies" :key="tech.slug">
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ tech.displayName }}</span>
                </div>
              </div>
            </div>
          </div>
        </DetailsPanelSection>
        <DetailsPanelSection title="GitHub Repo" v-if="project?.githubRepo">
          <a :href="project.githubRepoUrl" target="_blank" class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ project.githubRepo }}</a>
        </DetailsPanelSection>
        <DetailsPanelSection title="Tags" v-if="project?.tags?.length > 0">
          <div class="flex flex-wrap gap-4 items-center">
            <div v-for="tag in project?.tags" :key="tag.slug">
              <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ tag.displayName }}</span>
            </div>
          </div>
        </DetailsPanelSection>
      </DetailsPanel>
    </div>
  </Container>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { generateHTML } from '@tiptap/html'
import tiptapDefaultOptions from "~/lib/tiptapDefaultOptions";

export default defineNuxtComponent({
  async setup() {
    const { data: project } = await useFetch(`/api/v1/projects/${useRoute().params.slug}`);

    return {
      project,
    }
  },

  computed: {
    startedHumanReadable(): string | null {
      return dayjs(this.project?.startedDate).format('MMMM D, YYYY');
    },
    releasedHumanReadable(): string | null {
      return dayjs(this.project?.releaseDate).format('MMMM D, YYYY');
    },
    lastChangedHumanReadable(): string | null {
      return dayjs(this.project?.lastCommitDateTime).format('MMMM D, YYYY');
    },
    bodyHtml(): string | null {
      if (!this.project?.bodyProse) return null;
      return generateHTML(this.project.bodyProse, tiptapDefaultOptions.extensions);
    },
    bodyClass(): string | null {
      return tiptapDefaultOptions.editorProps.attributes.class
    }
  },
});
</script>