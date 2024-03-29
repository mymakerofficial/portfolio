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
  safelist: [],
  darkMode: ['class', '[data-color-scheme="dark"]'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        gray: {
          50: "#f6f8f9",
          100: "#edeef0",
          200: "#dadbde",
          300: "#c1c2c6",
          400: "#a8a9ae",
          500: "#83868e",
          600: "#5e616a",
          700: "#383a43",
          800: "#1e2027",
          900: "#14151a",
        },
        red: {
          50: "#ffebe9",
          100: "#ffcecb",
          200: "#ffaba8",
          300: "#fb8384",
          400: "#f64a4e",
          500: "#c02a32",
          600: "#8a202b",
          700: "#54151c",
          800: "#340e13",
          900: "#220b0f",
        },
        green: {
          50: "#dafbe1",
          100: "#aaefb9",
          200: "#6fdd8b",
          300: "#50c16e",
          400: "#38a35a",
          500: "#247540",
          600: "#185130",
          700: "#143322",
          800: "#0e1c15",
          900: "#0a130f",
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
        pink: {
          50: "#ffeaf5",
          100: "#ffd5ec",
          200: "#ffafdb",
          300: "#ff80c8",
          400: "#e85aad",
          500: "#b93b86",
          600: "#84215e",
          700: "#58153f",
          800: "#370e29",
          900: "#27091b",
        },
        cyan: {
          50: "#d6fef5",
          100: "#9ff8e7",
          200: "#6ae6d1",
          300: "#41c5b0",
          400: "#339989",
          500: "#297065",
          600: "#25524a",
          700: "#193933",
          800: "#102622",
          900: "#0a1816",
        },
      }
    }
  }
};
