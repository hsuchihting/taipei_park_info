export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  ssr: false,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/'
  }
})
