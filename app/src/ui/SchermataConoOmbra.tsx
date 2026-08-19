import type { Edizione, Tema } from "../dati/tipi";
import { AttenzioneImpatto } from "./AttenzioneImpatto";

export function MotiviBadge({ motivi }: { motivi?: string[] }) {
  if (!motivi?.length) return null;
  return <div className="motivi">{motivi.join(" · ")}</div>;
}

function ConoCard({ tema, onApri }: { tema: Tema; onApri: () => void }) {
  return (
    <button className="tema-card cono-card" onClick={onApri}>
      <MotiviBadge motivi={tema.motivi} />
      <h2 className="tema-titolo">{tema.titolo}</h2>
      <AttenzioneImpatto conv={tema.convergenza} ril={tema.rilevanza} />
      <span className="apri">Apri →</span>
    </button>
  );
}

// Sezione fissa: i temi ad alto impatto e bassa copertura — ciò che il mondo
// sta ignorando. Il divario attenzione/impatto è visibile già dalla scheda.
export function SchermataConoOmbra({
  edizione,
  onApriTema,
}: {
  edizione: Edizione;
  onApriTema: (id: number) => void;
}) {
  const temi = edizione.cono_ombra?.temi ?? [];
  return (
    <>
      <div className="sez-header">
        <h1>Cono d'ombra</h1>
        <p>Ad alto impatto, poco raccontati: ciò che il mondo sta ignorando.</p>
      </div>
      {temi.length === 0 ? (
        <div className="stato">Oggi nessun tema ad alto impatto e bassa copertura.</div>
      ) : (
        temi.map((t) => <ConoCard key={t.id} tema={t} onApri={() => onApriTema(t.id)} />)
      )}
    </>
  );
}
