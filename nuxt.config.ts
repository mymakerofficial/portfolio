// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@unlighthouse/nuxt'],
  extends: ['nuxt-seo-kit'],
  plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 's-maxage=0' } },
    '/admin/**': { ssr: false },
    '/api/v1/**': { cors: true },
  },
  imports: {
    autoImport: false
  },
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      siteName: 'My_Maker',
      siteDescription: 'Hai Im My_Maker. Making mostly dumb websites and games online. Passionate about all tings coding.',
      language: 'en', // prefer more explicit language codes like `en-AU` over `en`
    }
  },
})
