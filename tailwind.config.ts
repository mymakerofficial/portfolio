import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: [
    `components/**/*.{vue,js,ts}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
    `Error.{js,ts,vue}`,
    `error.{js,ts,vue}`,
  ],
  safelist: [
    'shadow-red-500/10',
    'shadow-blue-500/10',
    'shadow-green-500/10',
    'bg-red-50',
    'bg-blue-50',
    'bg-green-50',
    'bg-red-200/50',
    'bg-blue-200/50',
    'bg-green-200/50',
    'text-red-900',
    'text-blue-900',
    'text-green-900',
  ]
};
