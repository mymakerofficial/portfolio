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
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#f6f8fa",
          100: "#eceef2",
          200: "#d4d6de",
          300: "#b4b7c1",
          400: "#8d93a3",
          500: "#636979",
          600: "#3e4351",
          700: "#252833",
          800: "#151820",
          900: "#0a0c11",
        },
        green: {
          50: "#dafbe1",
          100: "#aceebb",
          200: "#6fdd8b",
          300: "#50c16e",
          400: "#38a353",
          500: "#1f7937",
          600: "#0e5824",
          700: "#023c15",
          800: "#00270c",
          900: "#001606",
        },
        blue: {
          50: "#ddf4ff",
          100: "#abe0ff",
          200: "#80ccff",
          300: "#54aeff",
          400: "#218bff",
          500: "#0967d6",
          600: "#04469a",
          700: "#082d66",
          800: "#061c41",
          900: "#000f2e",
        },
        purple: {
          50: "#fbefff",
          100: "#ecd8ff",
          200: "#d8b9ff",
          300: "#c198fd",
          400: "#a377f3",
          500: "#8152db",
          600: "#5d36a8",
          700: "#3e256f",
          800: "#231648",
          900: "#100a2f",
        },
      }
    }
  }
};
