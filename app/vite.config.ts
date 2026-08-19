import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const qui = dirname(fileURLToPath(import.meta.url))

// base '/' → sito servito alla RADICE del dominio (davidelarcier.github.io):
// i path assoluti runtime dell'app (/edizioni/…, /indice-edizioni.json) e lo
// scope del service worker restano identici a localhost, zero modifiche ai
// fetch. fs.allow include la radice del repo perché public/edizioni è un symlink
// a data/editions (fuori da app/). https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      // injectManifest: scriviamo noi il service worker (src/sw.ts); il plugin
      // inietta solo il manifest di precache revisionato dell'app-shell.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt', // niente auto-reload: l'utente conferma dal banner
      injectRegister: null, // la registrazione la fa il banner (virtual:pwa-register)
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        // Le EDIZIONI non entrano nella precache dell'app-shell: sono gestite a
        // runtime (ultima=pin, storiche=LRU). Altrimenti verrebbero bundlate
        // TUTTE, contro la politica (permanenti e in crescita).
        globIgnores: ['**/edizioni/**'],
      },
      manifest: {
        name: 'Il Giornale dei Giornali',
        short_name: 'Giornali',
        description:
          "La stampa mondiale certificata, condensata in un'edizione quotidiana in italiano.",
        lang: 'it',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#faf8f2', // --paper (splash)
        theme_color: '#181a1f', // --ink (status bar sobria)
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // Il SW si collauda sul build (localhost); in dev resta spento.
      devOptions: { enabled: false },
    }),
  ],
  server: {
    // host: true → Vite ascolta su tutte le interfacce (0.0.0.0), così l'app è
    // raggiungibile da un device sulla stessa LAN (non solo da localhost).
    host: true,
    fs: { allow: [qui, resolve(qui, '..')] },
  },
  preview: {
    // vite preview serve il build di produzione (con SW) su :4173. allowedHosts
    // sui domini dei tunnel effimeri: senza, Vite risponde "Blocked request.
    // This host is not allowed" all'Host del dominio tunnel. Il '.' iniziale
    // copre i sottodomini random (es. abc-def.trycloudflare.com).
    allowedHosts: [".trycloudflare.com", ".ngrok-free.app", ".ngrok.io"],
  },
})
