<template>
  <div>
    <ClientOnly>
      <QuickActionModal v-model:active="quickActionModalActive" />
    </ClientOnly>
    <NavBarWrapper :options="navBarOptions" :active="navBarActive" />
    <NuxtLoadingIndicator color="#f6f8fa" :height="2" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import {NavBarOption} from "~/components/navbar/NavBarWrapper.vue";
import {get, set, useMagicKeys, whenever} from "@vueuse/core";
import {computed, ref} from "vue";
import QuickActionModal from "~/components/quickactions/QuickActionModal.vue";
import NavBarWrapper from "~/components/navbar/NavBarWrapper.vue";

const navBarOptions: NavBarOption[] = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
]

let quickActionModalActive = ref(false);

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k')
      e.preventDefault()
  },
})

whenever(ctrl_k, () => {
  set(quickActionModalActive, !get(quickActionModalActive));
})

let navBarActive = computed(() => {
  return !get(quickActionModalActive);
})
</script>