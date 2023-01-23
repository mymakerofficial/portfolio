<template>
  <NavBar :active-index="activeIndex">
    <NavBarButton v-for="option in options" :key="option.label" :href="option.href">
      {{ option.label }}
    </NavBarButton>
  </NavBar>
</template>

<script lang="ts">
import {PropType} from "@vue/runtime-core";

export interface NavBarOption {
  href: string;
  label: string;
}

export default defineNuxtComponent({
  props: {
    options: {
      type: Array as PropType<NavBarOption[]>,
      required: true,
    }
  },

  computed: {
    activeIndex() {
      return this.options.findIndex((option) => option.href === this.$route.path);
    }
  }
})
</script>