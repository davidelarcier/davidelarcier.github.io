import type { Tema } from "../dati/tipi";
import { AttenzioneImpatto } from "./AttenzioneImpatto";
import { MappaCopertura } from "./MappaCopertura";
import { Sparkline } from "./Sparkline";
import { SchedaConfronto } from "./SchedaConfronto";
import { Fonti } from "./Fonti";
import { MotiviBadge } from "./SchermataConoOmbra";

// Dettaglio di un tema del cono d'ombra: la divergenza attenzione/impatto, la
// mappa del silenzio geografico, l'andamento della dissolvenza (se c'è), poi
// sintesi, confronto per aree e fonti.
export function DettaglioTemaCono({
  tema,
  oggiData,
  onIndietro,
}: {
  tema: Tema;
  oggiData: string;
  onIndietro: () => void;
}) {
  const diss = tema.dissolvenza;
  return (
    <>
      <div className="dettaglio-head">
        <button className="indietro" onClick={onIndietro}>
          ← Cono d'ombra
        </button>
      </div>
      <MotiviBadge motivi={tema.motivi} />
      <h1 className="dettaglio-titolo">{tema.titolo}</h1>

      <AttenzioneImpatto conv={tema.convergenza} ril={tema.rilevanza} />
      <MappaCopertura conv={tema.convergenza} />
      {diss?.dissolvenza && <Sparkline diss={diss} oggiData={oggiData} />}

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
