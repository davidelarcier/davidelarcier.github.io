import type { Dissolvenza } from "../dati/tipi";

// Andamento della copertura nei giorni recenti (dai centroidi storici): la
// forma del crollo — "da 8 testate a 3" — resa come piccolo grafico, in rosso
// (è copertura), con il picco e l'"oggi" segnati.
export function Sparkline({
  diss,
  oggiData,
}: {
  diss: Dissolvenza;
  oggiData: string;
}) {
  const and = [...(diss.andamento ?? [])]
    .map((p) => ({ giorno: p.giorno, n: p.n_testate }))
    .sort((a, b) => a.giorno.localeCompare(b.giorno));
  // aggiunge il punto "oggi" se non già presente in coda
  if (diss.testate_oggi != null && (and.length === 0 || and[and.length - 1].giorno !== oggiData))
    and.push({ giorno: oggiData, n: diss.testate_oggi });
  if (and.length < 2) return null;

  const W = 220, H = 52, P = 6;
  const max = Math.max(...and.map((p) => p.n), 1);
  const x = (i: number) => P + (i * (W - 2 * P)) / (and.length - 1);
  const y = (n: number) => H - P - (n / max) * (H - 2 * P);
  const punti = and.map((p, i) => `${x(i).toFixed(1)},${y(p.n).toFixed(1)}`);
  const linea = punti.join(" ");
  const area = `${P},${H - P} ${linea} ${(W - P).toFixed(1)},${H - P}`;
  const iPicco = and.reduce((m, p, i) => (p.n > and[m].n ? i : m), 0);

  return (
    <div className="spark-wrap">
      <div className="spark-lbl">
        Copertura in calo · <b>{diss.picco_testate} → {diss.testate_oggi} testate</b>
      </div>
      <svg className="spark" viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <polygon points={area} className="spark-area" />
        <polyline points={linea} className="spark-linea" />
        <circle cx={x(iPicco)} cy={y(and[iPicco].n)} r="3" className="spark-picco" />
        <circle cx={x(and.length - 1)} cy={y(and[and.length - 1].n)} r="3.5" className="spark-oggi" />
      </svg>
      <div className="spark-assi">
        <span>{and[0].giorno.slice(5)}</span>
        <span>oggi</span>
      </div>
    </div>
  );
}
