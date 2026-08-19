import type { IndiceEdizioni } from "../dati/sorgente";
import { dataEstesa } from "./data";

// Archivio: le edizioni disponibili (dalla più recente). Toccarne una la carica
// e riporta alla prima pagina. La corrente è marcata; l'ultima ha l'etichetta.
export function SchermataArchivio({
  indice,
  corrente,
  onScegli,
}: {
  indice: IndiceEdizioni;
  corrente: string | null;
  onScegli: (data: string) => void;
}) {
  return (
    <>
      <div className="sez-header">
        <h1>Archivio</h1>
        <p>Le edizioni disponibili. Tocca una data per aprirla.</p>
      </div>
      {indice.date.length === 0 ? (
        <div className="stato">Nessuna edizione in archivio.</div>
      ) : (
        indice.date.map((d) => (
          <button
            key={d}
            className={`arch-voce${d === corrente ? " attiva" : ""}`}
            onClick={() => onScegli(d)}
          >
            <span className="arch-pallino">{d === corrente ? "●" : "○"}</span>
            <span className="arch-data">{dataEstesa(d)}</span>
            {d === indice.ultima && <span className="arch-tag">più recente</span>}
          </button>
        ))
      )}
    </>
  );
}
