import type { Convergenza } from "../dati/tipi";

// Continenti disposti geograficamente (griglia schematica): rossi dove il mondo
// ne parla (intensità ∝ quota di testate), grigi dove tace. Gli zeri sono
// esplicitamente marcati "silenzio": l'assenza è informazione.
const POSIZIONE: Record<string, string> = {
  "Nord America": "na",
  Europa: "eu",
  Asia: "as",
  Africa: "af",
  "Sud America": "sa",
  Oceania: "oc",
};
const BREVE: Record<string, string> = {
  "Nord America": "N. America",
  Europa: "Europa",
  Asia: "Asia",
  Africa: "Africa",
  "Sud America": "Sud America",
  Oceania: "Oceania",
};

function Tessera({
  nome,
  dato,
  scala,
}: {
  nome: string;
  dato: { coperte: number; totali: number; quota: number };
  scala: number;
}) {
  const silenzio = dato.coperte === 0;
  // intensità del rosso: anche 1 testata è visibile, cresce con la quota
  const alpha = silenzio ? 0 : 0.35 + 0.65 * Math.min(1, dato.quota / scala);
  const stile = silenzio
    ? undefined
    : { background: `rgba(179,35,26,${alpha.toFixed(2)})`, color: alpha > 0.6 ? "#fff" : undefined };
  return (
    <div
      className={"mappa-tess" + (silenzio ? " silenzio" : "")}
      style={{ gridArea: POSIZIONE[nome] }}
      title={`${nome}: ${dato.coperte} testate su ${dato.totali}`}
    >
      <div className="mappa-tess-blocco" style={stile}>
        {dato.coperte}/{dato.totali}
      </div>
      <div className="mappa-tess-nome">{BREVE[nome] ?? nome}</div>
      {silenzio && <div className="mappa-tess-sil">silenzio</div>}
    </div>
  );
}

export function MappaCopertura({ conv }: { conv: Convergenza }) {
  const cop = conv.copertura_per_continente;
  if (!cop) return null;
  const scala = Math.max(0.05, ...Object.values(cop).map((d) => d.quota));
  return (
    <div className="mappa-wrap">
      <div className="mappa-lbl">Dove ne parla il mondo, e dove tace</div>
      <div className="mappa">
        {Object.entries(cop).map(([nome, dato]) =>
          POSIZIONE[nome] ? (
            <Tessera key={nome} nome={nome} dato={dato} scala={scala} />
          ) : null,
        )}
      </div>
      <div className="mappa-legenda">
        <span className="pallino rosso" /> ne parla ·{" "}
        <span className="pallino grigio" /> silenzio
      </div>
    </div>
  );
}
