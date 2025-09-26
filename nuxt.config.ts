// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    // kamu bisa masukin global css juga di sini kalau mau
  ],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  hooks: {
    'vite:extend'(vite) {
      const bad = (vite.plugins || []).filter(
        (p) => p && typeof p === 'object' && 'transform' in p && typeof (p as any).transform !== 'function'
      )
      if (bad.length) {
        console.warn('[PLUGIN VITE BERMASALAH]:', bad.map((p: any) => p?.name))
      }
    }
  }
})
