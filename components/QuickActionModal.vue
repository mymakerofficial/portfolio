<template>
  <div :data-active="activeDelayed" :data-disabled="disabled" class="data-[disabled=true]:hidden fixed top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-gray-900/90 opacity-0 data-[active=true]:opacity-100 z-50 transition-opacity ease-in-out">
    <div :data-active="activeDelayed" ref="modal" class="w-10/12 xl:w-2/6 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shadow-xl shadow-gray-500/10 dark:shadow-gray-600/10 translate-y-6 scale-90 data-[active=true]:translate-y-0 data-[active=true]:scale-100 transition-all ease-in-out">
      <ShinyBackgroundGradient ref="shinyGradientOuter" />
      <div class="m-[2px] p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col gap-2">
        <div>
          <input ref="input" type="text" class="w-full h-16 px-4 text-gray-700 outline-none dark:text-gray-200 bg-transparent rounded-xl placeholder-gray-200 dark:placeholder-gray-600 font-medium text-xl" placeholder="what are you looking for?" v-model="query"/>
        </div>
        <div class="w-full h-[2px]"><ShinyBackgroundGradient ref="shinyGradientTop" /></div>
        <div class="py-2 max-h-96 overflow-y-auto">
          <!--<ProjectsGroupedList v-if="projectsResult.resultType === 'grouped'" :groups="projectsResult.data" :compact="true" :brighter="true" :show-summary="false" />
          <ProjectsList v-else :projects="projectsResult.data" :compact="true" :brighter="true" :show-summary="false" />-->
          <QuickActionsGroupedList :groups="groups" />
        </div>
        <div class="w-full h-[2px]"><ShinyBackgroundGradient ref="shinyGradientBottom" /></div>
        <div class="px-4 py-2 flex flex-row gap-4 justify-end items-center">
          <div class="flex flex-row gap-2">
            <SmallKey>Ctrl K</SmallKey>
            <SmallKey>Esc</SmallKey>
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
import {mdiArrowDown, mdiArrowLeftBottom, mdiArrowUp} from '@mdi/js';
import {QuickActionGroup} from '~/components/QuickActionsGroupedList.vue';
import {onClickOutside, promiseTimeout, useEventBus, useMagicKeys, watchDebounced, whenever} from "@vueuse/core";
import {CompactProjectInfo, ProjectsGroup, ProjectsResponse} from "~/server/api/v1/projects";

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
let shinyGradientOuter = ref();
let shinyGradientTop = ref();
let shinyGradientBottom = ref();
let projectsResult = ref<ProjectsResponse | null>(null);
let groups = ref<QuickActionGroup[]>([]);
let query = ref("");
let disabled = ref(true);
let activeDelayed = ref(false);

const fetchData = async (query: string, groupBy: string | null, limit?: number, featuredFirst?: boolean): Promise<ProjectsResponse> => {
  const params = new URLSearchParams();
  if (query) {
    params.append('q', query);
  }
  if (groupBy) {
    params.append('group_by', groupBy);
  }
  if (limit) {
    params.append('limit', limit.toString());
  }
  if (featuredFirst) {
    params.append('featured_first', featuredFirst.toString());
  }
  const { data, error } = await useFetch(`/api/v1/projects?${params.toString()}`);
  if (error.value) {
    throw new Error(error.value.message);
  } else {
    return data.value as ProjectsResponse;
  }
};

const getProjects = async (query: string): Promise<ProjectsResponse> => {
  return await fetchData(
      query,
      `auto`,
      query === "" ? 4 : 6,
      query === ""
  );
}

watchDebounced(
    query,
    async (newQuery) => {
      await buildResult(newQuery);
    },
    { debounce: 500, maxWait: 1000 },
);

const buildResult = async (query: string) => {
  const result: QuickActionGroup[] = [];

  // deal with projects
  const projects = await getProjects(query);
  if (projects) {
    if (projects.resultType === 'grouped') {
      for (const group of projects.data as ProjectsGroup[]) {
        result.push({
          displayName: `Projects using ${group.group.displayName}`,
          key: `projects-${group.group.slug}`,
          items: group.projects.map((project) => ({
            displayName: project.displayName,
            key: project.slug,
            action: () => {
              useRouter().push(project.htmlUrl);
            }
          }))
        });
      }
    } else {
      result.push({
        displayName: query === "" ? 'Recommended Projects' : 'Projects',
        key: 'projects',
        items: (projects.data as CompactProjectInfo[]).map((project) => ({
          displayName: project.displayName,
          key: project.slug,
          action: () => {
            useRouter().push(project.htmlUrl);
          }
        }))
      });
    }
  }

  result.push({
    displayName: 'Navigation',
    key: 'navigation',
    items: [
      {
        displayName: 'Home',
        key: 'home',
        action: () => {
          useRouter().push('/');
        }
      },
      {
        displayName: 'Projects',
        key: 'projects',
        action: () => {
          useRouter().push('/projects');
        }
      },
    ]
  });

  groups.value = result;
};

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

  activeDelayed.value = true;
  input.value?.focus();

  query.value = "";
  buildResult("");

  if (!projectsResult.value) {
    shinyGradientOuter.value.animate1();
    shinyGradientTop.value?.animate2();
    shinyGradientBottom.value?.animate3();
  }
})

// whenever the modal becomes inactive
whenever(() => !props.active, async () => {
  activeDelayed.value = false;

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

// close modal on route change
useRouter().afterEach(() => {
  emit("update:active", false);
});
</script>