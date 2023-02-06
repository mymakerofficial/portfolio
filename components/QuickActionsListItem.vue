<template>
  <div @click="trigger" :data-active="active" @mouseover="onMouseOver" ref="el" class="mx-1.5 p-3 focus:outline-0 rounded-lg transition-colors ease-in-out duration-200 cursor-pointer">
    <span class="flex flex-col md:flex-row gap-2 md:items-center">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-200 truncate">{{ item.displayName }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import {QuickActionItem} from "~/lib/quickActions";
import {get, whenever} from "@vueuse/core";

const props = defineProps<{
  item: QuickActionItem;
  groupKey: string;
  activeCombinedKey: string;
}>()

const emit = defineEmits([
  "actionTriggered", "updateActiveItem"
]);

const el = ref<HTMLElement>();

const trigger = () => {
  // activate action
  props.item.action();
  // emit event
  emit("actionTriggered", props.item);
}

const active = computed(() => {
  return props.item.key === props.activeCombinedKey.split(':')[1];
})

const combinedKey = computed(() => {
  return `${props.groupKey}:${props.item.key}`;
})

whenever(active, () => {
  // scroll into view
  get(el)?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
})

const onMouseOver = () => {
  emit("updateActiveItem", combinedKey);
}

defineExpose({
  el,
  item: props.item,
  combinedKey
})
</script>