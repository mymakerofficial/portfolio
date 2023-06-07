<template>
  <GenericButton @click="openModal" class="select-none h-9 px-2 inline-flex flex-row gap-3 items-center font-medium text-gray-300 dark:text-gray-700 border border-gray-100 dark:border-gray-700 contrast-more:text-gray-500 contrast-more:dark:text-gray-400 contrast-more:border-gray-500 contrast-more:dark:border-gray-400 rounded-lg">
    <span class="flex gap-1 items-center">
      <SvgIcon type="mdi" :path="mdiMagnify" size="20" />
      <span class="font-medium">Search</span>
    </span>
    <span class="font-medium">Ctrl+K</span>
  </GenericButton>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMagnify } from '@mdi/js';
import { useEventBus } from '@vueuse/core'
import GenericButton from "~/components/forms/GenericButton.vue";

const bus = useEventBus<string>('quick-action-modal');

const openModal = () => {
  bus.emit('open');
}
</script>