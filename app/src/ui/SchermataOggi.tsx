import type { Edizione, Tema } from "../dati/tipi";
import { BarraConvergenza } from "./BarraConvergenza";
import { dataEstesa } from "./data";

function TemaCard({ tema, onApri }: { tema: Tema; onApri: () => void }) {
  return (
    <button className="tema-card" onClick={onApri}>
      <h2 className="tema-titolo">{tema.titolo}</h2>
      <BarraConvergenza conv={tema.convergenza} />
      {tema.sintesi && <p className="tema-sintesi">{tema.sintesi}</p>}
      <span className="apri">Apri il confronto per aree →</span>
    </button>
  );
}

// Schermata "Oggi": la prima pagina dell'edizione del giorno.
export function SchermataOggi({
  edizione,
  onApriTema,
}: {
  edizione: Edizione;
  onApriTema: (id: number) => void;
}) {
  return (
    <>
      <div className="masthead">
        <h1>Il Giornale dei Giornali</h1>
        <div className="sub">La stampa mondiale, ogni giorno, in italiano</div>
      </div>
      <div className="data-riga">{dataEstesa(edizione.data)}</div>
      {edizione.temi.map((t) => (
        <TemaCard key={t.id} tema={t} onApri={() => onApriTema(t.id)} />
      ))}
    </>
  );
}
