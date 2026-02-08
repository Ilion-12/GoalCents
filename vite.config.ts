import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'IMG/logo.png'],
      manifest: {
        name: 'GoalCents - Smart Expense Tracker',
        short_name: 'GoalCents',
        description: 'Track expenses, set budgets, and achieve your savings goals',
        theme_color: '#06b6a4',
        background_color: '#f7f7f7',
        display: 'standalone',
        icons: [
          {
            src: '/IMG/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/IMG/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
