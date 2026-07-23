import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Torterm — AI Home Exterior Renovation',
        short_name: 'Torterm',
        description: 'AI ผู้ช่วยปรับปรุงบ้านภายนอก แนะนำวัสดุจริงจากแคตตาล็อกกว่า 900 รายการ',
        theme_color: '#1E4DB7',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache only the app shell + small icons — the large hero photos
        // under /images are cached at runtime instead (see runtimeCaching
        // below), so installing the PWA doesn't eagerly download several MB.
        globPatterns: ['**/*.{js,css,html,svg}', 'icons/*.png'],
        runtimeCaching: [
          {
            urlPattern: /\/images\/.*\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hero-images',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
