import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },

  css: ['@/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.VITE_APP_BASE_URL || 'http://localhost:3000/api/',
      apiKey: process.env.VITE_APP_API_KEY || '',
      assetBase:
        (process.env.VITE_APP_BASE_URL?.replace(/\/api\/?$/, '') ||
          'http://localhost:3000')
    }
  },

  // Hilangkan warning Nitro soal compatibilityDate
  nitro: {
    compatibilityDate: '2025-10-06'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap'
        },

        // Favicon PHRI.ico di folder /public
        { rel: 'icon', type: 'image/x-icon', href: '/PHRI.ico' },
        // (opsional) untuk iOS home screen, kalau ada PNG 180x180 di /public
        // { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
