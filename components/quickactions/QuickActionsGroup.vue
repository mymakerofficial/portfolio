<template>
  <div class="flex flex-col gap-2">
    <h1 class="mx-4 text-sm font-medium text-gray-400 dark:text-gray-600">{{ group.displayName }}</h1>
    <QuickActionsList :items="group.items" ref="listComponent" @action-triggered="onActionTriggered" :group-key="group.key" :active-combined-key="activeCombinedKey" @update-active-item="updateActiveItem" />
  </div>
</template>

<script setup lang="ts">
import {QuickActionGroup, QuickActionItem} from "~/lib/quickActions";
import QuickActionsList from "~/components/quickactions/QuickActionsList.vue";
import {ref} from "vue";

const props = defineProps<{
  group: QuickActionGroup;
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

const listComponent = ref();

defineExpose({
  listComponent,
  group: props.group
})
</script>