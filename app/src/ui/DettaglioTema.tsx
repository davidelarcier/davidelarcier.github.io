import type { Tema } from "../dati/tipi";
import { BarraConvergenza } from "./BarraConvergenza";
import { SchedaConfronto } from "./SchedaConfronto";
import { Fonti } from "./Fonti";

// Dettaglio di un tema: sintesi generale + confronto per aree (Italia in blu) +
// fonti. È il cuore del prodotto: come lo stesso tema è raccontato altrove.
export function DettaglioTema({ tema, onIndietro }: { tema: Tema; onIndietro: () => void }) {
  return (
    <>
      <div className="dettaglio-head">
        <button className="indietro" onClick={onIndietro}>
          ← Prima pagina
        </button>
      </div>
      <h1 className="dettaglio-titolo">{tema.titolo}</h1>
      <BarraConvergenza conv={tema.convergenza} />
      {tema.sintesi && <p className="sintesi-generale">{tema.sintesi}</p>}

      {tema.confronto?.length > 0 && (
        <div className="confronto">
          {tema.confronto.map((s, i) => (
            <SchedaConfronto key={i} scheda={s} />
          ))}
        </div>
      )}

      <Fonti fonti={tema.fonti} omesse={tema.fonti_omesse} />
    </>
  );
}
