<template>
  <div class="flex justify-center absolute -top-36 left-0 w-full -z-50">
    <svg ref="backgroundSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" class="background w-full">
      <defs>
        <filter id="blurFilter" width="120%" height="120%" filterUnits="userSpaceOnUse" x="-10%" y="-10%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
        <filter id="noiseFilter">
          <feTurbulence baseFrequency="6" numOctaves="8" stitchTiles="stitch" type="fractalNoise" />
        </filter>
      </defs>
      <rect
        class="fill-white dark:fill-gray-900"
        x="0"
        y="0"
        width="600"
        height="400"
      />
      <g filter="url(#blurFilter)">
        <circle cy="20" cx="200" r="50" class="circle fill-gray-100" />
        <circle cy="50" cx="300" r="60" class="circle fill-gray-100" />
        <circle cy="100" cx="370" r="40" class="circle fill-gray-100" />
      </g>
      <rect
        filter="url(#noiseFilter)"
        style="mix-blend-mode: soft-light;"
        x="0"
        y="0"
        width="600"
        height="400"
      />
    </svg>
  </div>
</template>

<style scoped>
@keyframes fadeCircle {
  to {
    transform: scale(1) translateX(0%);
  }
}

svg.background {
  mix-blend-mode: soft-light;
  opacity: 0.08;
}

svg .circle {
  transform: scale(0.6) translateX(20%);
  animation: fadeCircle 1s ease forwards;
  animation-delay: 0.5s;
}
</style>