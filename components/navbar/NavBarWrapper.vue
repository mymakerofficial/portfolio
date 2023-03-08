<template>
  <NavBar :active-index="activeIndex" :active="active">
    <NavBarButton v-for="option in options" :key="option.label" :href="option.href">
      <SvgIcon type="mdi" size="19" :path="option.iconPath" v-if="option.iconPath" />{{ option.label }}
    </NavBarButton>
  </NavBar>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import {useRoute} from "#app";
import NavBar from "~/components/navbar/NavBar.vue";
import NavBarButton from "~/components/navbar/NavBarButton.vue";
import {computed} from "vue";

export interface NavBarOption {
  href: string;
  label: string;
  iconPath?: string;
}

const route = useRoute();

const props = defineProps<{
  options: NavBarOption[];
  active: boolean;
}>()

const activeIndex = computed(() => {
  return props.options.findIndex((option) => option.href === route.path);
})
</script>