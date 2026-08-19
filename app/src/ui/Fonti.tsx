import type { Fonte } from "../dati/tipi";

// Elenco fonti: SOLO titolo + link alla fonte (mai il testo integrale).
// Il titolo è mostrato in italiano quando abbiamo la traduzione (titolo_it);
// l'etichetta "tradotto da …" appare solo quando la lingua è nota.
function RigaFonte({ f }: { f: Fonte }) {
  const titolo = f.titolo_it || f.titolo;
  const lingua = f.lingua_originale;
  const etichette: string[] = [];
  if (lingua && lingua !== "italiano") etichette.push(`tradotto da ${lingua}`);
  if (f.live_blog) etichette.push("segui la diretta");
  return (
    <div className={f.paese === "Italia" ? "fonte italia" : "fonte"}>
      <span className="testata">{f.testata}</span>
      {etichette.length > 0 && <span className="tag"> ({etichette.join(" · ")})</span>}
      <a href={f.url} target="_blank" rel="noopener noreferrer">
        {titolo}
      </a>
    </div>
  );
}

export function Fonti({ fonti, omesse }: { fonti: Fonte[]; omesse?: number }) {
  if (!fonti?.length) return null;
  return (
    <div className="fonti">
      <div className="fonti-lbl">Le fonti</div>
      {fonti.map((f, i) => (
        <RigaFonte key={f.url || i} f={f} />
      ))}
      {omesse ? (
        <div className="fonti-altre">
          e {omesse === 1 ? "un'altra fonte" : `altre ${omesse} fonti`} sullo stesso tema
        </div>
      ) : null}
    </div>
  );
}
