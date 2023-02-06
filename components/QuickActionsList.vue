<template>
  <div class="flex flex-col gap-2">
    <QuickActionsListItem v-for="item in items" :key="item.key" :item="item" :active-item-key="activeItemKey" @update-active-item="updateActiveItem" @action-triggered="onActionTriggered" />
  </div>
</template>

<script setup lang="ts">
import { QuickActionItem } from "~~/lib/quickActions";

const props = defineProps<{
  items: QuickActionItem[];
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