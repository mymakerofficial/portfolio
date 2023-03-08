// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
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
  }
})
