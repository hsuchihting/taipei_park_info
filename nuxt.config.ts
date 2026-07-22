import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/'
  }
})
