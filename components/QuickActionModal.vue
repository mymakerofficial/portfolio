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
          <QuickActionsGroupedList :groups="groups" ref="groupedList" @action-triggered="onActionTriggered" @overflow-top="onOverflowTop" @overflow-bottom="onOverflowBottom" />
        </div>
        <div class="w-full h-[2px]"><ShinyBackgroundGradient ref="shinyGradientBottom" /></div>
        <div class="px-4 py-2 flex flex-row gap-4 justify-end items-center">
          <div class="flex flex-row gap-2">
            <SmallKey @click="close()">Ctrl K</SmallKey>
            <SmallKey @click="close()">Esc</SmallKey>
            <SmallKey key-code="arrowup" @click="up"><SvgIcon type="mdi" :path="mdiArrowUp" size="14" /></SmallKey>
            <SmallKey key-code="arrowdown" @click="down"><SvgIcon type="mdi" :path="mdiArrowDown" size="14" /></SmallKey>
            <SmallKey key-code="enter" @click="trigger"><SvgIcon type="mdi" :path="mdiArrowLeftBottom" size="14" /></SmallKey>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiArrowDown, mdiArrowLeftBottom, mdiArrowUp} from '@mdi/js';
import {
  onClickOutside,
  promiseTimeout,
  useEventBus,
  useMagicKeys,
  watchDebounced,
  whenever,
  get,
  set,
  useScrollLock,
  useIntervalFn,
  useTimeoutFn
} from "@vueuse/core";
import {CompactProjectInfo, ProjectsGroup, ProjectsResponse} from "~/server/api/v1/projects";
import {QuickActionExtendedGroup, QuickActionGroup} from "~/lib/quickActions";
import Fuse from "fuse.js";
import gsap from "gsap";

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

// input
let input = ref<HTMLInputElement>();
let query = ref("");
// other refs
let modal = ref<HTMLDivElement>();
let groupedList = ref();
// the gradient things
let shinyGradientOuter = ref();
let shinyGradientTop = ref();
let shinyGradientBottom = ref();
// data
let groups = ref<QuickActionGroup[]>([]);
// state
let disabled = ref(true);
let activeDelayed = ref(false);
// scroll lock
let scrollLock = useScrollLock(ref(document.body));
// keys
const { arrowup, arrowdown, enter, escape } = useMagicKeys()

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
    return get(data) as ProjectsResponse;
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
    { debounce: 500, maxWait: 2000 },
);

const buildResult = async (query: string) => {
  const items: QuickActionExtendedGroup[] = [];
  const projectsResult: QuickActionGroup[] = [];
  const result: QuickActionGroup[] = [];

  // deal with projects
  const projects = await getProjects(query);
  if (projects) {
    if (projects.resultType === 'grouped') {
      for (const group of projects.data as ProjectsGroup[]) {
        projectsResult.push({
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
      projectsResult.push({
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

  // register all items

  items.push({
    displayName: 'Quick Actions',
    key: 'quick-actions',
    items: [
      {
        displayName: 'Copy Link to Clipboard',
        key: 'copy-link',
        keyWords: ['copy', 'link', 'share', 'url'],
        action: () => {
          navigator.clipboard.writeText(window.location.href);
        }
      },
    ]
  });

  items.push({
    displayName: 'Navigation',
    key: 'navigation',
    items: [
      {
        displayName: 'Home',
        key: 'home',
        keyWords: ['home', 'dashboard'],
        action: () => {
          useRouter().push('/');
        }
      },
      {
        displayName: 'Projects',
        key: 'projects',
        keyWords: ['projects', 'project', 'list'],
        action: () => {
          useRouter().push('/projects');
        }
      },
    ]
  });

  if (query !== "") {
    // make list of items
    const itemsFlat = items.flatMap((group) => group.items);

    // search in items
    const searchRes = new Fuse(itemsFlat, {
      keys: [
        { name: 'displayName', weight: 2, getFn: (item) => item.displayName },
        { name: 'keyWords', weight: 0.5, getFn: (item) => item.keyWords },
      ],
      threshold: 0.4,
    }).search(query);

    // rebuild groups with search results
    const filteredList = items.map((group) => ({
      ...group,
      items: group.items.filter((item) => searchRes.map((res) => res.item.key).includes(item.key))
    })).filter((group) => group.items.length > 0);

    // add groups to result
    result.push(...filteredList);

    // add projects in second position if any exist
    if (projectsResult.length > 0 && projectsResult[0].items.length > 0) {
      result.splice(1, 0, ...projectsResult);
    }
  }

  // if no results, add projects and all items
  if (result.length === 0) {
    result.push(...projectsResult);
    result.push(...items);
  }

  set(groups, result as QuickActionGroup[]);
};

// handle up event
whenever(arrowup, () => {
  up();
  useTimeoutFn(() => {
    resumeUpInterval();
  }, 300)
});
whenever(() => !get(arrowup), () => pauseUpInterval());

// handle down event
whenever(arrowdown, () => {
  down();
  useTimeoutFn(() => {
    resumeDownInterval();
  }, 300)
});
whenever(() => !get(arrowdown), () => pauseDownInterval());

// handle enter event
whenever(enter, () => trigger());

// register up interval
const { pause: pauseUpInterval, resume: resumeUpInterval } = useIntervalFn(() => {
  if (get(arrowup)) {
    up();
  } else {
    pauseUpInterval();
  }
}, 100, { immediate: false });

// register down interval
const { pause: pauseDownInterval, resume: resumeDownInterval } = useIntervalFn(() => {
  if (get(arrowdown)) {
    down();
  } else {
    pauseDownInterval();
  }
}, 100, { immediate: false });

const onOverflowTop = () => {
  animateShake(-1);
  pauseUpInterval();
}

const onOverflowBottom = () => {
  animateShake(1);
  pauseDownInterval();
}

const onActionTriggered = () => {
  close();
};

const up = () => {
  get(groupedList).up();
};

const down = () => {
  get(groupedList).down();
};

const trigger = () => {
  get(groupedList).trigger();
};

const close = () => {
  emit("update:active", false);
}

const animateShake = (direction: number) => {
  const el = get(modal) as HTMLElement;

  gsap.timeline()
      .set(el, {
        translateY: `0%`,
      })
      .to(el, 0.05, {
        translateY: `${5 * direction}%`,
        ease: "spring",
      })
      .to(el, 0.05, {
        translateY: `0%`,
        ease: "Bounce.easeOut",
      });
}

// whenever escape key is pressed, close the modal
whenever(escape, () => {
  close();
})

// close the modal when clicking outside of it
onClickOutside(modal, () => {
  close();
})

// whenever the modal becomes active
whenever(() => props.active, async () => {
  set(disabled, false);

  await nextTick();

  set(activeDelayed, true);
  get(input)?.focus();

  get(shinyGradientOuter).animate1();
  get(shinyGradientTop).animate2();
  get(shinyGradientBottom).animate3();

  set(query, "");
  await buildResult("");
})

// whenever the modal becomes inactive
whenever(() => !props.active, async () => {
  set(activeDelayed, false);

  await promiseTimeout(500);

  if (!props.active) {
    set(disabled, true);
  }
})

watch(() => props.active, (v) => {
  set(scrollLock, v);
})

// open the modal when the bus emits the open event
bus.on((e) => {
  if (e === 'open') {
    emit("update:active", true);
  }
})

// close modal on route change
useRouter().afterEach(() => {
  close();
});
</script>