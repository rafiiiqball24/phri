import { defineNuxtConfig } from 'nuxt/config'


export default defineNuxtConfig({
  // Matikan devtools karena di Windows bikin error pipe
  devtools: { enabled: false },

  css: ['@/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  // Pindahkan PostCSS config dari postcss.config.js ke sini
  postcss: {
    plugins: {
      tailwindcss: {},   // kalau pakai Tailwind
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
  

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap'
        }
      ]
    }
  }
})
