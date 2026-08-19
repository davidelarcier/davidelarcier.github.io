import type { Tema } from "../dati/tipi";
import { CoperturaInterna } from "./CoperturaInterna";
import { SchedaConfronto } from "./SchedaConfronto";
import { Fonti } from "./Fonti";

// Dettaglio di un tema continentale: copertura interna, sintesi, e il confronto
// ESTERNO a due aree — il continente (evidenziato, accento neutro) vs "Resto del
// mondo". Poi le fonti. Il blu resta riservato all'Italia della prima pagina.
export function DettaglioTemaContinentale({
  tema,
  continente,
  onIndietro,
}: {
  tema: Tema;
  continente: string;
  onIndietro: () => void;
}) {
  return (
    <>
      <div className="dettaglio-head">
        <button className="indietro" onClick={onIndietro}>
          ← Continenti
        </button>
      </div>
      <div className="cont-occhiello">{continente}</div>
      <h1 className="dettaglio-titolo">{tema.titolo}</h1>
      {tema.convergenza_interna && <CoperturaInterna ci={tema.convergenza_interna} />}
      {tema.sintesi && <p className="sintesi-generale">{tema.sintesi}</p>}

      {tema.confronto?.length > 0 && (
        <div className="confronto">
          {tema.confronto.map((s, i) => (
            <SchedaConfronto key={i} scheda={s} evidenzia={continente} accento="continente" />
          ))}
        </div>
      )}

      <Fonti fonti={tema.fonti} omesse={tema.fonti_omesse} />
    </>
  );
}
