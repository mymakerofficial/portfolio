// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 's-maxage=0' } },
    '/admin/**': { ssr: false },
    '/api/v1/**': { cors: true },
  }
})
