import { useEffect, useState } from "react";
import type { Edizione } from "./dati/tipi";
import { sorgente, type IndiceEdizioni } from "./dati/sorgente";
import { SchermataOggi } from "./ui/SchermataOggi";
import { DettaglioTema } from "./ui/DettaglioTema";
import { SchermataConoOmbra } from "./ui/SchermataConoOmbra";
import { DettaglioTemaCono } from "./ui/DettaglioTemaCono";
import { SchermataContinenti } from "./ui/SchermataContinenti";
import { DettaglioTemaContinentale } from "./ui/DettaglioTemaContinentale";
import { SchermataArchivio } from "./ui/SchermataArchivio";
import { BannerAggiornamento } from "./ui/BannerAggiornamento";

type Sezione = "oggi" | "cono" | "continenti" | "archivio";

function messaggio(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export default function App() {
  const [indice, setIndice] = useState<IndiceEdizioni | null>(null);
  const [dataCorrente, setDataCorrente] = useState<string | null>(null);
  const [edizione, setEdizione] = useState<Edizione | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const q = new URLSearchParams(window.location.search);
  const sezIniziale = (["oggi", "cono", "continenti", "archivio"] as const).includes(
    q.get("sez") as Sezione,
  )
    ? (q.get("sez") as Sezione)
    : "oggi";
  const [sezione, setSezione] = useState<Sezione>(sezIniziale);
  const [temaAperto, setTemaAperto] = useState<number | null>(
    q.get("tema") ? Number(q.get("tema")) : null,
  );
  const [temaCont, setTemaCont] = useState<{ continente: string; id: number } | null>(
    q.get("cont") && q.get("ctema")
      ? { continente: q.get("cont")!, id: Number(q.get("ctema")) }
      : null,
  );

  // Indice una volta sola; parte dall'edizione più recente.
  useEffect(() => {
    (async () => {
      try {
        const idx = await sorgente.indice();
        if (!idx.ultima) throw new Error("Nessuna edizione disponibile");
        setIndice(idx);
        setDataCorrente(idx.ultima);
      } catch (e) {
        setErrore(messaggio(e));
      }
    })();
  }, []);

  // Ricarica l'edizione quando cambia la data selezionata (archivio).
  useEffect(() => {
    if (!dataCorrente) return;
    setEdizione(null);
    (async () => {
      try {
        setEdizione(await sorgente.edizione(dataCorrente));
      } catch (e) {
        setErrore(messaggio(e));
      }
    })();
  }, [dataCorrente]);

  const vaiA = (s: Sezione) => {
    setSezione(s);
    setTemaAperto(null);
    setTemaCont(null);
  };

  const scegliData = (d: string) => {
    setDataCorrente(d);
    setTemaAperto(null);
    setTemaCont(null);
    setSezione("oggi");
  };

  if (errore)
    return (
      <>
        <BannerAggiornamento />
        <div className="app">
          <div className="stato errore">
            Impossibile caricare l'edizione: {errore}
            <br />
            Esegui la pipeline e avvia con <code>npm run dev</code>.
          </div>
        </div>
      </>
    );

  const nav = (
    <nav className="nav">
      {(
        [
          ["oggi", "Oggi"],
          ["cono", "Cono d'ombra"],
          ["continenti", "Continenti"],
          ["archivio", "Archivio"],
        ] as [Sezione, string][]
      ).map(([s, etichetta]) => (
        <button key={s} className={sezione === s ? "attivo" : ""} onClick={() => vaiA(s)}>
          {etichetta}
        </button>
      ))}
    </nav>
  );

  // L'archivio non dipende dall'edizione caricata: si può sfogliare anche mentre
  // la nuova edizione sta caricando.
  if (sezione === "archivio" && indice)
    return (
      <>
        <BannerAggiornamento />
        <div className="app">
          <SchermataArchivio indice={indice} corrente={dataCorrente} onScegli={scegliData} />
        </div>
        {nav}
      </>
    );

  if (!edizione)
    return (
      <>
        <BannerAggiornamento />
        <div className="app">
          <div className="stato">Carico l'edizione…</div>
        </div>
        {nav}
      </>
    );

  let contenuto;
  if (sezione === "cono") {
    const temi = edizione.cono_ombra?.temi ?? [];
    const tema = temaAperto != null ? temi.find((t) => t.id === temaAperto) : null;
    contenuto = tema ? (
      <DettaglioTemaCono tema={tema} oggiData={edizione.data} onIndietro={() => setTemaAperto(null)} />
    ) : (
      <SchermataConoOmbra edizione={edizione} onApriTema={setTemaAperto} />
    );
  } else if (sezione === "continenti") {
    const pagina = edizione.pagine_continentali?.find((p) => p.continente === temaCont?.continente);
    const tema = pagina?.temi.find((t) => t.id === temaCont?.id);
    contenuto = tema && temaCont ? (
      <DettaglioTemaContinentale
        tema={tema}
        continente={temaCont.continente}
        onIndietro={() => setTemaCont(null)}
      />
    ) : (
      <SchermataContinenti
        edizione={edizione}
        onApri={(continente, id) => setTemaCont({ continente, id })}
      />
    );
  } else {
    const tema = temaAperto != null ? edizione.temi.find((t) => t.id === temaAperto) : null;
    contenuto = tema ? (
      <DettaglioTema tema={tema} onIndietro={() => setTemaAperto(null)} />
    ) : (
      <SchermataOggi edizione={edizione} onApriTema={setTemaAperto} />
    );
  }

  return (
    <>
      <BannerAggiornamento />
      <div className="app">{contenuto}</div>
      {nav}
    </>
  );
}
