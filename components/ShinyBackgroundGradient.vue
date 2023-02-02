<template>
  <div ref="el" class="w-full h-full absolute bg-gradient-to-r from-transparent via-gray-100 to-transparent dark:from-transparent dark:via-gray-700 dark:to-transparent" />
</template>

<script lang="ts">
import gsap from "gsap";

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
          .to(el, 1, {
            duration: 0.2,
            translateX: `-50%`,
            scaleX: `200%`,
            ease: "power1.inOut"
          })
          .to(el, 1, {
            duration: 0.2,
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
            translateX: `-100%`,
            scaleX: `100%`,
          })
          .to(el, {
            duration: 0.2,
          })
          .to(el, 1, {
            duration: 0.2,
            translateX: `30%`,
            scaleX: `30%`,
            ease: "power1.inOut"
          })
          .to(el, 1, {
            duration: 0.2,
            translateX: '0%',
            scaleX: `100%`,
            ease: "power1.inOut"
          });

      timeline.play();
    }
  }
})
</script>