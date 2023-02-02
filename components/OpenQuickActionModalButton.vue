<template>
  <button @click="openModal" class="select-none px-2 py-1 inline-flex flex-row gap-3 font-medium text-gray-100 dark:text-gray-700 border-2 border-gray-50 dark:border-gray-800 rounded-lg">
    <span class="flex gap-1 items-center">
      <SvgIcon type="mdi" :path="mdiMagnify" size="20" />
      <span class="font-medium">Search</span>
    </span>
    <span class="font-medium">Ctrl K</span>
  </button>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMagnify } from '@mdi/js';
import { useEventBus } from '@vueuse/core'

const bus = useEventBus<string>('quick-action-modal');

const openModal = () => {
  bus.emit('open');
}
</script>