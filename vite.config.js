import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      disableDevLogs: true,
      registerType: 'autoUpdate',
      manifest: {
        name: 'Daily Monitoring',
        short_name: 'DailyMonitor',
        description: 'Suivi quotidien de régime et activité',
        theme_color: '#2563EB',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              !url.pathname.startsWith('/node_modules/') &&
              !url.pathname.startsWith('/@vite/') &&
              !url.pathname.startsWith('/@id/') &&
              !url.pathname.startsWith('/src/') &&
              (url.pathname.startsWith('/assets/') ||
                url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|ico|woff2?)$/)),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
