<template>
  <div>
    <NuxtLoadingIndicator :color="colorScheme === 'dark' ? '#f6f8fa' : '#14151a'" :height="2" />
    <ClientOnly>
      <QuickActionModal v-model:active="quickActionModalActive" />
    </ClientOnly>
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import {
  get,
  set,
  syncRef,
  useMagicKeys,
  usePreferredColorScheme,
  useStorage,
  useToggle,
  whenever
} from "@vueuse/core";
import {onMounted, watch} from "vue";
import QuickActionModal from "~/components/quickactions/QuickActionModal.vue";
import Footer from "~/components/generics/Footer.vue";
import {useHead} from "unhead";
import {useColorScheme} from "~/composables/states";

// quick action modal toggle

const [quickActionModalActive, toggleActionModal] = useToggle(false);

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    // we need to prevent the default behavior of the browser
    if (e.ctrlKey && e.key === 'k')
      e.preventDefault()
  },
})

whenever(ctrl_k, () => {
  toggleActionModal();
});

// color mode

const preferredColorScheme = usePreferredColorScheme();
const colorScheme = useColorScheme();

onMounted(() => {
  const localStorageColorScheme = useStorage('color-scheme', null, localStorage);

  // sync preferred color with colorScheme
  // this needs to be done before setting the initial value otherwise it will be overwritten
  syncRef(preferredColorScheme, colorScheme)

  // set initial value from localStorage or preferred color scheme
  set(colorScheme, get(localStorageColorScheme) || get(preferredColorScheme));

  // sync localStorage with state
  syncRef(colorScheme, localStorageColorScheme);
})

watch(colorScheme, () => {
  // whenever the color mode changes, we update the html attribute
  useHead({
    htmlAttrs: {
      'data-color-scheme': get(colorScheme),
    }
  });
});

// head

useHead({
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