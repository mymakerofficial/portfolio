<template>
  <button
    @click="toggleMode"
    aria-label="Change color mode"
    class="select-none h-9 aspect-square flex justify-center items-center text-gray-300 dark:text-gray-700 border border-gray-100 dark:border-gray-700 contrast-more:text-gray-500 contrast-more:dark:text-gray-400 contrast-more:border-gray-500 contrast-more:dark:border-gray-400 rounded-full"
  >
    <SvgIcon type="mdi" :path="mode === 'light' ? mdiLightbulbOnOutline : mdiLightbulbOutline" class="h-5"/>
  </button>
</template>

<script setup lang="ts">
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLightbulbOutline, mdiLightbulbOnOutline } from '@mdi/js';
import {useColorMode} from "~/composables/states";
import {get, set} from "@vueuse/core";

const mode = useColorMode();

function toggleMode() {
  if (get(mode) === 'light') {
    set(mode, 'dark')
  } else {
    set(mode, 'light')
  }
}
</script>