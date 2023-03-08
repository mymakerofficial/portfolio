<template>
  <div class="rounded-full overflow-hidden" ref="container">
    <div :data-show="hasRing" class="w-full h-full absolute bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 data-[show=false]:hidden" />
    <div :data-active="hoverActive && hasRinglight" class="absolute bottom-0 w-48 h-full scale-[200%] opacity-0 data-[active=true]:opacity-100 transition-opacity ease-in-out duration-250 motion-reduce:hidden" ref="ringLight" style="background: radial-gradient(ellipse at bottom, rgb(236 238 242 / 0.3), transparent 50%, transparent)"/>
    <div :data-background="hasBackground" :data-transparent="!hasRing && !hasRinglight && !hasBackground" class="m-[2px] p-2 data-[transparent=false]:data-[background=false]:bg-white data-[transparent=false]:data-[background=false]:dark:bg-gray-900 data-[background=true]:bg-gray-50 data-[background=true]:dark:bg-gray-800 overflow-hidden rounded-full" ref="innerContainer">
      <div :data-active="hoverActive && hasSpotlight" class="absolute bottom-0 w-48 h-full scale-150 opacity-0 data-[active=true]:opacity-100 transition-opacity ease-in-out duration-250 motion-reduce:hidden" ref="spotlight" style="background: radial-gradient(ellipse at bottom, rgb(99 105 121 / 0.3), transparent 50%, transparent)"/>
      <div :data-active="highlightTransforms.width !== 0" class="absolute bottom-2 h-full rounded-full bg-gray-200/60 dark:bg-gray-700/80 opacity-0 data-[active=true]:opacity-100 transition-opacity ease-in-out duration-250 motion-reduce:hidden" ref="highlight"/>
      <div class="flex flex-row" ref="buttonsContainer">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {gsap} from "gsap";
import {defineNuxtComponent} from "#app";

interface Transforms {
  x: number;
  width: number | undefined;
  height: number | undefined;
}

// TODO: convert to composition API

export default defineNuxtComponent({
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
    hasBackground: {
      type: Boolean,
      default: true,
    },
    hasRing: {
      type: Boolean,
      default: true,
    },
    hasRinglight: {
      type: Boolean,
      default: true,
    },
    hasSpotlight: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      hoverActive: false,
      spotlightTransforms: { x: 0 } as Transforms,
      highlightTransforms: { x: 0, width: 0 } as Transforms,
      spotlight: null as HTMLElement | null,
      ringLight: null as HTMLElement | null,
      highlight: null as HTMLElement | null,
      innerContainer: null as HTMLElement | null,
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
      const { spotlight, innerContainer } = this;

      if (!spotlight || !innerContainer) return;

      const innerContainerRect = innerContainer.getBoundingClientRect();

      // calculate the horizontal position of the spotlight
      const spotlightPosition = centerX - innerContainerRect.left - spotlight.offsetWidth / 2;

      return { x: spotlightPosition } as Transforms;
    },
    setSpotlightTransform(transforms: Transforms): void {
      // set the horizontal position of the spotlight
      gsap.to(this.spotlight, {
        duration: 0.5,
        left: transforms.x ? `${transforms.x}px` : undefined,
        ease: "power3.out"
      });

      gsap.to(this.ringLight, {
        duration: 0.8,
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
      const { innerContainer } = this;

      if (!innerContainer) return;

      const innerContainerRect = innerContainer.getBoundingClientRect();

      // calculate the horizontal position of the highlight
      const highlightPosition = closestButton.getBoundingClientRect().left - innerContainerRect.left;

      // calculate the width of the highlight
      const highlightWidth = closestButton.getBoundingClientRect().width;

      // calculate the height of the highlight
      const highlightHeight = closestButton.getBoundingClientRect().height;

      return { x: highlightPosition, width: highlightWidth, height: highlightHeight };
    },
    setHighlightTransform(transforms: Transforms): void {
      if (transforms.height) {
        // set the height instantly
        gsap.set(this.highlight, {
          height: `${transforms.height}px`,
        });
      }

      // set the horizontal position of the highlight
      gsap.to(this.highlight, {
        duration: 0.5,
        left: transforms.x ? `${transforms.x}px` : undefined,
        width: transforms.width ? `${transforms.width}px` : undefined,
        ease: "power3.out"
      });
    },
    updateActiveDataAttribute() {
      const { buttonElements } = this;

      if (!buttonElements) return;

      for (let i = 0; i < buttonElements.length; i++) {
        const button = buttonElements[i] as HTMLElement;
        if (i === this.activeIndex) {
          button.setAttribute("data-active", "true");
        } else {
          button.setAttribute("data-active", "false");
        }
      }
    },
  },

  watch: {
    activeIndex: {
      handler() {
        this.resetTransforms();
        this.updateActiveDataAttribute();
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
    this.ringLight = this.$refs.ringLight as HTMLElement;
    this.highlight = this.$refs.highlight as HTMLElement;

    this.innerContainer = this.$refs.innerContainer as HTMLElement;

    const buttonsContainer = this.$refs.buttonsContainer as HTMLElement;
    this.buttonElements = buttonsContainer.children;

    this.resetTransforms();
    this.updateActiveDataAttribute();

    container.addEventListener("mouseenter", this.handleEnter);

    container.addEventListener("mouseleave", this.handleLeave);

    container.addEventListener("mousemove", this.handleMove);
  }
});
</script>