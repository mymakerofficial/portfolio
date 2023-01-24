<template>
  <div class="z-50 fixed bottom-12 left-1/2 -translate-x-1/2 shadow-xl shadow-gray-500/10 dark:shadow-gray-600/10 rounded-full" ref="container">
    <div class="w-full h-full absolute bg-gradient-to-br from-gray-50 via-gray-200 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full" />
    <nav class="m-[2px] h-16 p-2 m-px bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden" ref="navbar">
      <div :data-active="hoverActive" class="absolute bottom-0 w-48 h-full scale-150 opacity-0 data-[active=true]:opacity-100 transition-opacity ease-in-out duration-250" ref="spotlight" style="background: radial-gradient(ellipse at bottom, rgb(99 105 121 / 0.3), transparent 50%, transparent)"/>
      <div :data-active="highlightTransforms.width !== 0" class="absolute bottom-2 h-12 rounded-full bg-gray-100/60 dark:bg-gray-700/80 opacity-0 data-[active=true]:opacity-100 transition-opacity ease-in-out duration-250" ref="highlight"/>
      <div class="flex flex-row h-full" ref="buttonsContainer">
        <slot />
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import {gsap} from "gsap";

interface Transforms {
  x: number;
  width: number | undefined;
}

export default defineNuxtComponent({
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      hoverActive: false,
      spotlightTransforms: { x: 0 } as Transforms,
      highlightTransforms: { x: 0, width: 0 } as Transforms,
      spotlight: null as HTMLElement | null,
      highlight: null as HTMLElement | null,
      navbar: null as HTMLElement | null,
      navbarRect: null as DOMRect | null,
      buttonElements: null as HTMLCollection | null,
    }
  },

  methods: {
    handleMove(e: MouseEvent) {
      const { x } = e;

      this.spotlightTransforms = this.getSpotlightTransforms(x) as Transforms;

      const closestButton = this.getClosestButton(x);
      if (closestButton) {
        this.highlightTransforms = this.getHighlightTransforms(closestButton) as Transforms;
      }
    },
    handleEnter(e: MouseEvent) {
      const { x } = e;

      this.spotlightTransforms = this.getSpotlightTransforms(x) as Transforms;
      this.hoverActive = true;
    },
    handleLeave() {
      this.hoverActive = false;

      this.resetTransforms();
    },
    resetTransforms() {
      // Reset the spotlight and highlight
      if (this.buttonElements) {
        if (this.activeIndex >= 0) {
          // If there is an active index, reset the spotlight and highlight to that button
          this.highlightTransforms = this.getHighlightTransforms(
              this.buttonElements[this.activeIndex] as HTMLElement
          ) as Transforms;
        } else {
          // Otherwise, hide the highlight
          this.highlightTransforms = { x: 0, width: 0 } as Transforms;
        }

        if (!this.hoverActive && this.activeIndex >= 0) {
          // calculate the spotlight return position
          const buttonRect = (this.buttonElements[this.activeIndex] as HTMLElement).getBoundingClientRect();
          const x = buttonRect.x + buttonRect.width / 2;
          // set the spotlight return position
          this.spotlightTransforms = this.getSpotlightTransforms(x) as Transforms;
        }
      }
    },
    getSpotlightTransforms(centerX: number): Transforms | undefined {
      const { spotlight, navbar } = this;

      if (!spotlight || !navbar) return;

      const navbarRect = navbar.getBoundingClientRect();

      // calculate the horizontal position of the spotlight
      const spotlightPosition = centerX - navbarRect.left - spotlight.offsetWidth / 2;

      return { x: spotlightPosition } as Transforms;
    },
    setSpotlightTransform(transforms: Transforms): void {
      // set the horizontal position of the spotlight
      gsap.to(this.spotlight, {
        duration: 0.5,
        left: transforms.x ? `${transforms.x}px` : undefined,
        ease: "power3.out"
      });
    },
    getClosestButton(centerX: number): HTMLElement | undefined {
      const { buttonElements } = this;

      if (!buttonElements) return;

      // find the button that the mouse is closest to
      let closestButton = buttonElements[0] as HTMLElement;
      let closestButtonDistance = Math.abs(centerX - closestButton.getBoundingClientRect().left);

      for (let i = 1; i < buttonElements.length; i++) {
        const button = buttonElements[i] as HTMLElement;
        // calculate the distance between the mouse and the button center
        const buttonDistance = Math.abs(centerX - (button.getBoundingClientRect().left + (button.offsetWidth / 2)));

        if (buttonDistance < closestButtonDistance) {
          closestButton = button;
          closestButtonDistance = buttonDistance;
        }
      }

      return closestButton;
    },
    getHighlightTransforms(closestButton: HTMLElement): Transforms | undefined {
      const { navbar } = this;

      if (!navbar) return;

      const navbarRect = navbar.getBoundingClientRect();

      // calculate the horizontal position of the highlight
      const highlightPosition = closestButton.getBoundingClientRect().left - navbarRect.left;

      // calculate the width of the highlight
      const highlightWidth = closestButton.getBoundingClientRect().width;

      return { x: highlightPosition, width: highlightWidth };
    },
    setHighlightTransform(transforms: Transforms): void {
      // set the horizontal position of the highlight
      gsap.to(this.highlight, {
        duration: 0.5,
        left: transforms.x ? `${transforms.x}px` : undefined,
        width: transforms.width ? `${transforms.width}px` : undefined,
        ease: "power3.out"
      });
    },
  },

  watch: {
    activeIndex: {
      handler() {
        this.resetTransforms();
      },
      immediate: true,
    },
    spotlightTransforms: {
      handler(value) {
        this.setSpotlightTransform(value);
      },
      deep: true,
    },
    highlightTransforms: {
      handler(value) {
        this.setHighlightTransform(value);
      },
      deep: true,
    },
  },

  mounted() {
    const container = this.$refs.container as HTMLElement;

    this.spotlight = this.$refs.spotlight as HTMLElement;
    this.highlight = this.$refs.highlight as HTMLElement;

    this.navbar = this.$refs.navbar as HTMLElement;

    const buttonsContainer = this.$refs.buttonsContainer as HTMLElement;
    this.buttonElements = buttonsContainer.children;

    this.resetTransforms();

    container.addEventListener("mouseenter", this.handleEnter);

    container.addEventListener("mouseleave", this.handleLeave);

    container.addEventListener("mousemove", this.handleMove);
  }
});
</script>