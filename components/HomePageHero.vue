<template>
  <HomePageHeroBackground />
  <Container class="2xl:w-11/12">
    <div class="flex flex justify-center">
      <div class="mx-8 md:1/2 lg:w-3/5">
        <div class="text-md font-medium text-gray-900 dark:text-gray-100 leading-loose tracking-wide">
          Hai <SvgIcon class="inline-block" type="mdi" :path="mdiHandWaveOutline" size="18" /> Im My_Maker. Making mostly dumb websites <SvgIcon class="inline-block" type="mdi" :path="mdiWeb" size="18" /> and games <SvgIcon class="inline-block" type="mdi" :path="mdiControllerClassicOutline" size="18" /> online.
          Passionate about all tings coding. Living in germany and currently studying <SvgIcon class="inline-block" type="mdi" :path="mdiSchoolOutline" size="18" /> technical computer science.
          Below you'll find some of my projects <SvgIcon class="inline-block" type="mdi" :path="mdiLightbulbOutline" size="18" /> and some other random <SvgIcon class="inline-block" type="mdi" :path="mdiDice5Outline" size="18" /> stuff about me.
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHandWaveOutline, mdiWeb, mdiControllerClassicOutline, mdiDice5Outline, mdiLightbulbOutline, mdiSchoolOutline } from '@mdi/js';
</script>