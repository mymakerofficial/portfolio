// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@unlighthouse/nuxt'],
  extends: ['nuxt-seo-kit'],
  plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 's-maxage=0' } },
    '/admin/**': { ssr: false, index: false },
    '/api/v1/**': { cors: true },
    'teapot': { index: false },
  },
  imports: {
    autoImport: false
  },
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_ENV_VERCEL_URL || process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      language: 'en',
    },
  },
  robots: {
    indexable: process.env.NUXT_INDEXABLE === 'true',
    disallow: ['/admin/**'],
  },
  app: {
    head: {
      bodyAttrs: {
        class: 'bg-white text-dark-900 dark:bg-gray-900 dark:text-gray-100',
      },
    }
  },
})
