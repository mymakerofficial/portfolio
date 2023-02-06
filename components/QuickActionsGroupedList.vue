<template>
  <div class="flex flex-col gap-4" ref="el">
    <QuickActionListItemHighlight :active-element="activeItemElement" />
    <QuickActionsGroup v-for="group in groups" :key="group.key" ref="groupComponents" :group="group" :active-combined-key="activeCombinedKey" @action-triggered="onActionTriggered" @update-active-item="updateActiveItem" />
  </div>
</template>

<script setup lang="ts">
import {QuickActionGroup, QuickActionItem} from "~/lib/quickActions";
import {get, set, whenever} from "@vueuse/core";

const props = defineProps<{
  groups: QuickActionGroup[];
}>()

const emit = defineEmits([
  "actionTriggered", "overflowTop", "overflowBottom"
]);

const onActionTriggered = (i: QuickActionItem) => {
  emit("actionTriggered", i);
}

const el = ref<HTMLElement>();

const groupComponents = ref();

const activeItemIndex = ref(0);

const itemsFlat = computed((): { combinedKey: string, action: () => void }[] => {
  return props.groups.flatMap(group => {
    return group.items.map(item => {
      return {
        combinedKey: `${group.key}:${item.key}`,
        action: item.action
      }
    })
  })
})

const activeCombinedKey = computed((): string => {
  return get(itemsFlat)[get(activeItemIndex)].combinedKey;
})

const activeItemElement = computed((): HTMLElement | null => {
  if (!get(groupComponents)) return null;

  return get(groupComponents).map((g: any) => {
    return get(g.listComponent.itemComponents).find((i: any) => {
      return get(i.combinedKey) === get(activeCombinedKey);
    })
  }).find((i: any) => {
    return i !== undefined;
  })?.el;
})

const updateActiveItem = (key: string) => {
  const index = get(itemsFlat).findIndex(i => i.combinedKey === key);
  set(activeItemIndex, index);
}

watch(() => props.groups, () => {
  set(activeItemIndex, 0);
})

// if first item is active scroll to top
whenever(() => get(activeItemIndex) === 0, () => {
  // scroll el parent to top
  const parent = get(el)?.parentElement;
  if (!parent) return;

  nextTick(() => {
    parent.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  })
})

const atTop = computed((): boolean => {
  return get(activeItemIndex) <= 0;
})

const atBottom = computed((): boolean => {
  return get(activeItemIndex) >= get(itemsFlat).length - 1;
})

const up = () => {
  if (!get(atTop)) {
    set(activeItemIndex, get(activeItemIndex) - 1);
  } else {
    emit("overflowTop");
  }
}

const down = () => {
  if (!get(atBottom)) {
    set(activeItemIndex, get(activeItemIndex) + 1);
  } else {
    emit("overflowBottom");
  }
}

const trigger = () => {
  const item = get(itemsFlat)[get(activeItemIndex)];
  item.action();
  emit("actionTriggered", item);
}

defineExpose({
  up,
  down,
  trigger,
  activeItemElement,
  activeCombinedKey,
  activeItemIndex,
  atTop,
  atBottom
})
</script>