<template>
  <NavBar :active-index="activeIndex" :active="active">
    <NavBarButton v-for="option in options" :key="option.label" :href="option.href">
      <SvgIcon type="mdi" :path="option.iconPath" v-if="option.iconPath" />{{ option.label }}
    </NavBarButton>
  </NavBar>
</template>

<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import {PropType} from "@vue/runtime-core";

export interface NavBarOption {
  href: string;
  label: string;
  iconPath?: string;
}

export default defineNuxtComponent({
  components: {
    SvgIcon
  },

  props: {
    options: {
      type: Array as PropType<NavBarOption[]>,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    activeIndex() {
      return this.options.findIndex((option) => option.href === this.$route.path);
    }
  }
})
</script>