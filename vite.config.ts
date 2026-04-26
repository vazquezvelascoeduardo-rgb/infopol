import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Configuració de Vite + PWA per a InfoPol.
// El plugin VitePWA genera el service worker, el manifest i registra
// automàticament la PWA perquè es pugui instal·lar al mòbil o escriptori.
//
// `base` controla el prefix d'URL on viuen els assets:
//  - En desenvolupament (`npm run dev`) → '/' (servidor a localhost:5173/)
//  - En producció build a GitHub Pages → '/infopol/' (servit a
//    https://vazquezvelascoeduardo-rgb.github.io/infopol/)
// Si en el futur muntem a un domini propi (p. ex. infopol.app) on l'app
// estigui a l'arrel, només cal canviar la condició a sota.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/infopol/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'InfoPol',
        short_name: 'InfoPol',
        description: 'Consulta ràpida per a agents de policia local (Catalunya)',
        lang: 'ca',
        theme_color: '#0a1628',
        background_color: '#0a1628',
        display: 'standalone',
        // start_url i scope han de ser relatius perquè el service worker
        // funcioni correctament sota el subpath de GitHub Pages.
        start_url: '.',
        scope: '.',
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
      },
    }),
  ],
}));

