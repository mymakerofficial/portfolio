<template>
  <div>
    <NuxtLoadingIndicator color="#f6f8fa" :height="2" />
    <ClientOnly>
      <QuickActionModal v-model:active="quickActionModalActive" />
      <DevVersionWarningMessage />
    </ClientOnly>
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import {NavBarOption} from "~/components/navbar/NavBarWrapper.vue";
import {get, set, useMagicKeys, whenever} from "@vueuse/core";
import {computed, ref} from "vue";
import QuickActionModal from "~/components/quickactions/QuickActionModal.vue";
import DevVersionWarningMessage from "~/components/goodies/DevVersionWarningMessage.vue";
import Footer from "~/components/generics/Footer.vue";

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