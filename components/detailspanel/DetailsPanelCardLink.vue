<template>
  <NuxtLink>
    <DetailsPanelCard class="h-full">
      <template #title><slot name="title" /></template>
      <template #default><slot /></template>
    </DetailsPanelCard>
  </NuxtLink>

</template>
<script setup lang="ts">
import DetailsPanelCard from "~/components/detailspanel/DetailsPanelCard.vue";
</script>