import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        id: '/',
        name: 'Password Generator — strong, random, private',
        short_name: 'Passwords',
        description: 'Generate strong, random passwords — entropy meter, zero tracking, zero backend. Everything stays on your device.',
        lang: 'en',
        dir: 'ltr',
        categories: ['utilities', 'security', 'productivity'],
        prefer_related_applications: false,
        theme_color: '#0a1016',
        background_color: '#0a1016',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        launch_handler: { client_mode: 'navigate-existing' },
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        screenshots: [
          { src: '/screenshots/narrow.png', sizes: '500x1080', type: 'image/png', form_factor: 'narrow', label: 'Strong passwords, zero tracking' },
          { src: '/screenshots/wide.png', sizes: '1280x800', type: 'image/png', form_factor: 'wide', label: 'Password Generator on desktop' }
        ],
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
})
