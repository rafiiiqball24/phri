import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },

  css: ['@/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
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

  nitro: {
    compatibilityDate: '2025-10-07'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      // >>> Tambahan penting untuk title
      title: 'PHRI SHOP',
      titleTemplate: '%s | PHRI SHOP',
      meta: [
        { name: 'description', content: 'PHRI Shop - Marketplace resmi PHRI' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap'
        },
        { rel: 'icon', type: 'image/x-icon', href: '/PHRI.ico' }
      ]
    }
  }
})
