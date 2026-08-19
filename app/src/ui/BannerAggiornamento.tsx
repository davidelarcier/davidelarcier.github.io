import { useRegisterSW } from "virtual:pwa-register/react";

// Banner "nuova versione": compare quando un nuovo service worker è pronto in
// waiting. L'utente sceglie quando aggiornare (modello prompt) — non si ricarica
// da solo mentre legge. "Aggiorna" manda SKIP_WAITING al SW e ricarica.
export function BannerAggiornamento() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;
  return (
    <div className="agg-banner" role="status" aria-live="polite">
      <span className="agg-testo">Nuova versione disponibile.</span>
      <button className="agg-azione" onClick={() => updateServiceWorker(true)}>
        Aggiorna
      </button>
      <button
        className="agg-chiudi"
        onClick={() => setNeedRefresh(false)}
        aria-label="Ignora per ora"
      >
        ×
      </button>
    </div>
  );
}
