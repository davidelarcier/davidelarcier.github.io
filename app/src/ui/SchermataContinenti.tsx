import type { Edizione } from "../dati/tipi";
import { CoperturaInterna } from "./CoperturaInterna";

// Sezione "Continenti": una pagina per continente (già ordinati Oceania→Asia
// dalla pipeline), coi temi a maggiore convergenza INTERNA, esclusi quelli già
// in prima pagina/cono. Il confronto (nel dettaglio) è ESTERNO: il continente
// vs il resto del mondo — chi lo vive vs chi lo osserva.
export function SchermataContinenti({
  edizione,
  onApri,
}: {
  edizione: Edizione;
  onApri: (continente: string, id: number) => void;
}) {
  const pagine = edizione.pagine_continentali ?? [];
  return (
    <>
      <div className="sez-header">
        <h1>Continenti</h1>
        <p>Come ogni continente vive i suoi temi — e come il resto del mondo li guarda.</p>
      </div>
      {pagine.length === 0 ? (
        <div className="stato">Nessuna pagina continentale in questa edizione.</div>
      ) : (
        pagine.map((p) => (
          <section key={p.continente} className="cont-sez">
            <h2 className="cont-nome">{p.continente}</h2>
            {p.temi.map((t) => (
              <button
                key={t.id}
                className="tema-card"
                onClick={() => onApri(p.continente, t.id)}
              >
                <h3 className="tema-titolo">{t.titolo}</h3>
                {t.convergenza_interna && <CoperturaInterna ci={t.convergenza_interna} />}
                {t.sintesi && <p className="tema-sintesi">{t.sintesi}</p>}
                <span className="apri">Apri il confronto esterno →</span>
              </button>
            ))}
          </section>
        ))
      )}
    </>
  );
}
