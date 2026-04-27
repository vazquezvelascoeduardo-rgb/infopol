import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Configuració de Vite + PWA per a InfoPol.
// El plugin VitePWA genera el service worker, el manifest i registra
// automàticament la PWA perquè es pugui instal·lar al mòbil o escriptori.
//
// L'app es serveix sota el domini propi (infopol.app) a l'arrel, així
// que `base` és sempre '/'.
export default defineConfig({
  base: '/',
  build: {
    // Code-splitting: separem dependències grans (React, Router) en chunks
    // propis perquè es cachegin entre desplegaments i el bundle inicial
    // baixi més ràpid.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'InfoPol — Consulta operativa',
        short_name: 'InfoPol',
        description: 'Consulta ràpida de normativa, infografies i operativa per a agents de policia local (Catalunya).',
        lang: 'ca',
        dir: 'ltr',
        categories: ['education', 'productivity', 'utilities', 'reference'],
        theme_color: '#0a1628',
        background_color: '#0a1628',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cachejem tots els estàtics de l'app per funcionar offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // SPA fallback per a qualsevol ruta no cachejada.
        navigateFallback: 'index.html',
        // Augmentem el límit perquè algunes fitxes HTML són grans.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});

