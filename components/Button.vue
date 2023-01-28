<template>
  <span class="group/button inline-block rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl shadow-transparent hover:shadow-gray-500/10 hover:dark:shadow-gray-600/10 duration-500 ease-in-out">
    <span class="w-full h-full absolute bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 group-hover/button:rotate-180 group-hover/button:brightness-75 dark:group-hover/button:brightness-200 transition duration-500 ease-in-out" />
    <span class="w-full h-full absolute bg-gray-500 dark:bg-gray-100 opacity-0 group-hover/button:opacity-20 duration-500 ease-in-out" />
    <span class="h-12 m-0.5 px-10 inline-flex justify-center items-center text-md font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-full">
      <slot />
    </span>
  </span>
</template>