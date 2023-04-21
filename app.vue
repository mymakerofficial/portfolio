<template>
  <div>
    <NuxtLoadingIndicator color="#f6f8fa" :height="2" />
    <ClientOnly>
      <QuickActionModal v-model:active="quickActionModalActive" />
    </ClientOnly>
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import {NavBarOption} from "~/components/navbar/NavBarWrapper.vue";
import {get, set, useMagicKeys, whenever} from "@vueuse/core";
import {ref} from "vue";
import QuickActionModal from "~/components/quickactions/QuickActionModal.vue";
import Footer from "~/components/generics/Footer.vue";
import {useHead} from "unhead";

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

let mode: 'light' | 'dark';

if (process.client && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
  mode = 'light'
} else {
  mode = 'dark'
}

useHead({
  htmlAttrs: {
    'data-mode': mode,
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    }
  ]
});
</script>