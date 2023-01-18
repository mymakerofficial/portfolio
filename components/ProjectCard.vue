<template>
  <NuxtLink :to="project.htmlUrl">
    <Card>
      <div class="flex flex-col gap-2">
        <h1 class="text-md text-neutral-700 font-bold">{{project.displayName}}</h1>
        <p class="text-sm text-neutral-600">{{project.summary}}</p>
      </div>
    </Card>
  </NuxtLink>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    project: {
      type: Object,
      required: true,
    },
  }
})
</script>