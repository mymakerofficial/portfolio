<template>
  <component
      :is="$attrs.href || $attrs.to ? NuxtLink : 'button'"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";
</script>