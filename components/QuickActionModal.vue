<template>
  <div :data-active="active" :data-disabled="disabled" class="data-[disabled=true]:hidden fixed top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-gray-900/90 opacity-0 data-[active=true]:opacity-100 z-50 transition-opacity ease-in-out">
    <div :data-active="active" ref="modal" class="w-10/12 xl:w-2/6 rounded-2xl overflow-hidden shadow-xl shadow-gray-500/10 dark:shadow-gray-600/10 translate-y-6 scale-90 data-[active=true]:translate-y-0 data-[active=true]:scale-100 transition-all ease-in-out">
      <div class="w-full h-full absolute bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
      <div class="m-[2px] p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col gap-2">
        <div>
          <input ref="input" type="text" class="w-full h-16 px-4 text-gray-700 outline-none dark:text-gray-200 bg-transparent rounded-xl placeholder-gray-200 dark:placeholder-gray-600 font-medium text-xl" placeholder="what are you looking for?" v-model="query"/>
        </div>
        <div class="w-full h-[2px] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" v-if="data" />
        <div class="py-2 max-h-96 overflow-y-auto" v-if="data">
          <ProjectsGroupedList v-if="data.resultType === 'grouped'" :groups="data.data" :compact="true" :brighter="true" :show-summary="false" />
          <ProjectsList v-else :projects="data.data"/>
        </div>
        <div class="w-full h-[2px] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
        <div class="px-4 py-2 flex flex-row gap-4 justify-between items-center">
          <p class="text-sm font-medium text-gray-200 dark:text-gray-600">Search projects or technologies...</p>
          <div class="flex flex-row gap-2">
            <SmallKey>esc</SmallKey>
            <SmallKey><SvgIcon type="mdi" :path="mdiArrowDown" size="14" /></SmallKey>
            <SmallKey><SvgIcon type="mdi" :path="mdiArrowUp" size="14" /></SmallKey>
            <SmallKey><SvgIcon type="mdi" :path="mdiArrowLeftBottom" size="14" /></SmallKey>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeftBottom, mdiArrowDown, mdiArrowUp } from '@mdi/js';

import {
  onClickOutside,
  promiseTimeout,
  useEventBus,
  useFocus,
  useMagicKeys,
  watchDebounced,
  whenever
} from "@vueuse/core";

const props = defineProps({
  active: {
    type: Boolean,
    required: true,
    default: false,
  }
});

const emit = defineEmits([
  "update:active"
]);

const bus = useEventBus<string>('quick-action-modal');

let input = ref<HTMLInputElement>();
let modal = ref<HTMLDivElement>();
let data = ref<object | null>(null);
let query = ref("");
let { focused: inputFocused } = useFocus(input);
let disabled = ref(true);

const fetchData = async (query: string, groupBy: string | null) => {
  const { data, error } = await useFetch(`/api/v1/projects?q=${query}&group_by=${groupBy}`);
  if (error.value) {
    console.error(error.value);
  } else {
    return data.value;
  }
};

watchDebounced(
    query,
    async (newQuery) => {
      const res = await fetchData(newQuery, `auto`);
      if (res) {
        data.value = res;
      }
    },
    { debounce: 500, maxWait: 1000 },
)

// whenever escape key is pressed, close the modal
const { escape } = useMagicKeys()

whenever(escape, () => {
  emit("update:active", false);
})

// close the modal when clicking outside of it
onClickOutside(modal, (event) => {
  emit("update:active", false);
})

// whenever the modal becomes active
whenever(() => props.active, async () => {
  disabled.value = false;

  await nextTick();

  input.value?.focus();
})

// whenever the modal becomes inactive
whenever(() => !props.active, async () => {
  await promiseTimeout(500);

  if (!props.active) {
    disabled.value = true;
  }
})

// open the modal when the bus emits the open event
bus.on((e) => {
  if (e === 'open') {
    emit("update:active", true);
  }
})
</script>