/// <reference lib="webworker" />
//
// Service worker del lettore (modalità injectManifest: lo scriviamo noi, il
// plugin inietta solo il manifest di precache revisionato). Strategia approvata:
//
//   - app-shell (HTML/JS/CSS/font/icone) → precache cache-first, rigenerata a
//     ogni build; le vecchie versioni auto-cancellate;
//   - ULTIMA edizione + indice → cache "corrente" (pin): mai sfrattata, si
//     aggiorna quando l'indice cambia → l'ultima è SEMPRE offline;
//   - edizioni storiche VISITATE → cache "edizioni" LRU (maxEntries), on-demand;
//   - PDF → mai in cache (solo rete);
//   - update → modello prompt (skipWaiting solo su richiesta dell'app).
//
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

const CACHE_CORRENTE = 'gdg-corrente' // indice + ultima edizione (pin, mai LRU)
const CACHE_EDIZIONI = 'gdg-edizioni' // storiche visitate (LRU)
const MAX_EDIZIONI = 30 // ~35 KB/edizione → ~1,5 MB di tetto per l'archivio

// App-shell: precache revisionato. __WB_MANIFEST è iniettato dal build; le
// edizioni ne sono escluse (globIgnores in vite.config) → NON entrano nel bundle.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

const soloOk = new CacheableResponsePlugin({ statuses: [0, 200] })

// Ancora l'ultima edizione (letta dall'indice) nella cache pin: la sostituisce
// quando `ultima` cambia. Fire-and-forget: se offline o indice non valido, la
// pin resta com'è. Così l'ultima edizione è disponibile offline anche quando la
// LRU l'avesse sfrattata sfogliando molto archivio.
async function ancoraUltima(rispostaIndice: Response): Promise<void> {
  try {
    const dati = (await rispostaIndice.json()) as { ultima?: string | null }
    const ultima = dati.ultima
    if (!ultima) return
    const urlEd = new URL(`edizioni/${ultima}.json`, self.registration.scope).toString()
    const pin = await caches.open(CACHE_CORRENTE)
    // size-1 sulle edizioni: rimuovi quelle diverse dall'ultima (l'indice resta)
    for (const req of await pin.keys()) {
      if (req.url.includes('/edizioni/') && !req.url.endsWith(`${ultima}.json`)) {
        await pin.delete(req)
      }
    }
    if (!(await pin.match(urlEd))) {
      const r = await fetch(urlEd)
      if (r.ok) await pin.put(urlEd, r.clone())
    }
  } catch {
    /* offline / indice assente: pin invariata */
  }
}

// Indice: network-first (lista fresca online, disponibile offline). Su successo
// riancora l'ultima edizione nella cache pin.
const stratIndice = new NetworkFirst({ cacheName: CACHE_CORRENTE, plugins: [soloOk] })
registerRoute(
  ({ url }) => url.pathname.endsWith('/indice-edizioni.json'),
  async (options) => {
    const resp = await stratIndice.handle(options)
    if (resp) void ancoraUltima(resp.clone())
    return resp
  },
)

// Edizioni JSON: network-first in LRU; se manca (offline e non in LRU) ripiega
// sulla cache pin (l'ultima). Fuori da entrambe → errore (l'app mostra il caso).
const stratEdizioni = new NetworkFirst({
  cacheName: CACHE_EDIZIONI,
  plugins: [soloOk, new ExpirationPlugin({ maxEntries: MAX_EDIZIONI, purgeOnQuotaError: true })],
})
registerRoute(
  ({ url }) => url.pathname.startsWith('/edizioni/') && url.pathname.endsWith('.json'),
  async (options) => {
    try {
      const resp = await stratEdizioni.handle(options)
      if (resp) return resp
    } catch {
      /* rete assente e non in LRU: prova la pin sotto */
    }
    const pin = await caches.match(options.request, { cacheName: CACHE_CORRENTE })
    return pin ?? Response.error()
  },
)

// PDF: MAI in cache. On-demand su rete (offline si legge l'edizione, non il PDF).
registerRoute(({ url }) => url.pathname.endsWith('.pdf'), new NetworkOnly())

// Update modello "prompt": il nuovo SW resta in waiting finché l'app (banner
// "nuova versione") non manda SKIP_WAITING — così non si ricarica sotto i piedi.
self.addEventListener('message', (e) => {
  if ((e.data as { type?: string } | undefined)?.type === 'SKIP_WAITING') self.skipWaiting()
})
