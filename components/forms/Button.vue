<template>
  <component
    :is="$attrs.href ? 'a' : 'button'"
    class="inline-block rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 duration-500 ease-in-out"
  >
    <ClientOnly>
      <SpotlightEffectElement />
    </ClientOnly>
    <span class="h-12 px-10 inline-flex justify-center items-center text-md font-medium text-gray-900 dark:text-gray-100">
      <slot />
    </span>
  </component>
</template>