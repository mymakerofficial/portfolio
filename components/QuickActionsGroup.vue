<template>
  <div class="flex flex-col gap-2">
    <h1 class="mx-4 text-sm font-medium text-gray-400 dark:text-gray-600">{{ group.displayName }}</h1>
    <QuickActionsList :items="group.items" @action-triggered="onActionTriggered" :active-item-key="activeItemKey" @update-active-item="updateActiveItem" />
  </div>
</template>

<script setup lang="ts">
import {QuickActionGroup, QuickActionItem} from "~/lib/quickActions";

const props = defineProps<{
  group: QuickActionGroup;
  activeItemKey: string;
}>()

const emit = defineEmits([
  "actionTriggered", "updateActiveItem"
]);

const onActionTriggered = (i: QuickActionItem) => {
  emit("actionTriggered", i);
}

const updateActiveItem = (key: string) => {
  emit("updateActiveItem", key);
}
</script>