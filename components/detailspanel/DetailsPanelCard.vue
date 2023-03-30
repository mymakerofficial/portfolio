<template>
  <Card is="div" hoverable class="p-8 md:p-12 flex flex-col gap-4">
    <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex gap-3 items-center" v-if="$slots.title"><slot name="title" /></h1>
    <slot />
  </Card>
</template>

<script setup lang="ts">
import Card from "~/components/generics/Card.vue";
</script>