<template>
  <div class="w-full h-full flex text-white bg-blue-500 items-center justify-center">
    <h1 :style="{ fontSize: '70px' }">
      {{ title }} 👋
    </h1>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
})
</script>