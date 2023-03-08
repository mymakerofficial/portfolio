<template>
  <Card class="shadow-gray-500/10 dark:shadow-gray-600/10 bg-gray-50 dark:bg-gray-800 overflow-hidden">
    <div class="p-8 flex flex-col gap-4">
      <div class="w-28 h-5 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
      <div class="w-48 h-11 bg-gray-600/20 dark:bg-gray-100/20 animate-pulse rounded-md" />
    </div>
  </Card>
</template>
<script setup lang="ts">
import Card from "~/components/generics/Card.vue";
</script>