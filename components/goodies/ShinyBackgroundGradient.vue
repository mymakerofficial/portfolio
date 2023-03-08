<template>
  <div ref="el" class="w-full h-full absolute bg-gradient-to-r from-transparent via-gray-100 to-transparent dark:from-transparent dark:via-gray-700 dark:to-transparent" />
</template>

<script lang="ts">
import gsap from "gsap";
import {defineNuxtComponent} from "#app";

export default defineNuxtComponent({
  methods: {
    animate1() {
      const el = this.$refs.el as HTMLElement;

      const timeline = gsap.timeline();

      timeline
        .set(el, {
          translateX: `80%`,
          scaleX: `100%`,
        })
        .to(el, 0.5, {
          translateX: `-50%`,
          scaleX: `200%`,
          ease: "power1.inOut"
        })
        .to(el, 1, {
          translateX: '0%',
          scaleX: `100%`,
          ease: "power1.inOut"
        });

      timeline.play();
    },
    animate2() {
      const el = this.$refs.el as HTMLElement;

      const timeline = gsap.timeline();

      timeline
        .set(el, {
          translateX: `80%`,
          scaleX: `100%`,
        })
        .to(el, 0.5, {
          translateX: `-40%`,
          scaleX: `50%`,
          ease: "power1.inOut"
        })
        .to(el, 1.4, {
          translateX: '-10%',
          scaleX: `80%`,
          ease: "power1.inOut"
        });

      timeline.play();
    },
    animate3() {
      const el = this.$refs.el as HTMLElement;

      const timeline = gsap.timeline();

      timeline
        .set(el, {
          translateX: `80%`,
          scaleX: `100%`,
        })
        .to(el, 0.5, {
          translateX: `-40%`,
          scaleX: `200%`,
          ease: "power1.inOut"
        })
        .to(el, 0.8, {
          translateX: `40%`,
          ease: "power1.inOut"
        })
        .to(el, 1, {
          translateX: '5%',
          scaleX: `90%`,
          ease: "power1.inOut"
        });

      timeline.play();
    },
  }
})
</script>