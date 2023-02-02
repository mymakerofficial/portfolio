<template>
  <div class="flex flex justify-center">
    <div class="mx-8 md:1/2 lg:w-3/5 flex flex-col gap-8">
      <div class="text-md font-medium text-gray-900 dark:text-gray-100 leading-loose tracking-wide">
        Hai <SvgIcon class="inline-block" type="mdi" :path="mdiHandWaveOutline" size="18" /> Im My_Maker. Making mostly dumb websites <SvgIcon class="inline-block" type="mdi" :path="mdiWeb" size="18" /> and games <SvgIcon class="inline-block" type="mdi" :path="mdiControllerClassicOutline" size="18" /> online.
        Passionate about all tings coding. Living in germany and currently studying <SvgIcon class="inline-block" type="mdi" :path="mdiSchoolOutline" size="18" /> technical computer science.
        Below you'll find some of my projects <SvgIcon class="inline-block" type="mdi" :path="mdiLightbulbOutline" size="18" /> and some other random <SvgIcon class="inline-block" type="mdi" :path="mdiDice5Outline" size="18" /> stuff about me.
      </div>
      <div class="flex justify-center">
        <OpenQuickActionModalButton />
      </div>
    </div>
  </div>
  <div class="flex justify-center absolute top-0 left-0 w-full -z-50" ref="halo">
    <div class="w-10/12 h-44 md:h-72 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:-translate-y-32 -rotate-12 scale-125 opacity-0 dark:opacity-[0.13]" style="background: radial-gradient(at center, rgba(236, 238, 242, 0.3), transparent 70%, transparent);" />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHandWaveOutline, mdiWeb, mdiControllerClassicOutline, mdiDice5Outline, mdiLightbulbOutline, mdiSchoolOutline } from '@mdi/js';
import OpenQuickActionModalButton from "~/components/OpenQuickActionModalButton.vue";
</script>