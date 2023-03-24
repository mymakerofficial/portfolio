<template>
  <div v-if="show" class="toast fixed bottom-8 right-8 left-8 lg:left-auto z-50 md:xl-w-1/2 xl:w-1/4 flex flex-col gap-4 bg-gray-200 dark:bg-gray-800 p-6 rounded-xl shadow-xl shadow-gray-700/25">
    <h3 class="text-lg font-medium flex items-center gap-3"><SvgIcon type="mdi" :path="mdiFlaskOutline" class="h-6"/>Hello there traveler, new stuff ahead.</h3>
    <p>Welcome to my new website. Please keep in mind that you are viewing a <b>development preview</b>. Things <b>will</b> change.</p>
    <div>
      <FlatButton @click="close">Fine with me</FlatButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlatButton from "~/components/forms/FlatButton.vue";
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiFlaskOutline } from '@mdi/js';
import {set, useLocalStorage} from "@vueuse/core";

const show = useLocalStorage("devVersionWarning", true);

const close = () => {
  set(show, false);
}
</script>