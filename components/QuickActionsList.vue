<template>
  <div class="flex flex-col gap-2">
    <QuickActionsListItem v-for="item in items" :key="item.key" ref="itemComponents" :item="item" :group-key="groupKey" :active-combined-key="activeCombinedKey" @update-active-item="updateActiveItem" @action-triggered="onActionTriggered" />
  </div>
</template>

<script setup lang="ts">
import { QuickActionItem } from "~~/lib/quickActions";

const props = defineProps<{
  items: QuickActionItem[];
  groupKey: string;
  activeCombinedKey: string;
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

const itemComponents = ref();

defineExpose({
  itemComponents
})
</script>