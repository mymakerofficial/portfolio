<template>
  <div class="flex flex-col gap-4" ref="el">
    <QuickActionListItemHighlight :active-element="activeItemElement" />
    <QuickActionsGroup v-for="group in groups" :key="group.key" ref="groupComponents" :group="group" :active-item-key="activeItemKey" @action-triggered="onActionTriggered" @update-active-item="updateActiveItem" />
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

const flatItems = computed(() => {
  return props.groups.flatMap(g => g.items);
})

const activeItemKey = computed((): string => {
  return get(flatItems)[get(activeItemIndex)].key;
})

const activeItemElement = computed((): HTMLElement | null => {
  if (!get(groupComponents)) return null;

  return get(groupComponents).map((g: any) => {
    return get(g.listComponent.itemComponents).find((i: any) => {
      return get(i.item).key === get(activeItemKey);
    })
  }).find((i: any) => {
    return i !== undefined;
  })?.el;
})

const updateActiveItem = (key: string) => {
  const index = flatItems.value.findIndex(i => i.key === key);
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

const up = () => {
  if (get(activeItemIndex) > 0) {
    set(activeItemIndex, get(activeItemIndex) - 1);
  } else {
    emit("overflowTop");
  }
}

const down = () => {
  if (get(activeItemIndex) < get(flatItems).length - 1) {
    set(activeItemIndex, get(activeItemIndex) + 1);
  } else {
    emit("overflowBottom");
  }
}

const trigger = () => {
  const item = get(flatItems)[get(activeItemIndex)];
  item.action();
  emit("actionTriggered", item);
}

defineExpose({
  up,
  down,
  trigger,
  activeItemElement,
  activeItemKey,
  activeItemIndex,
})
</script>