import type { Convergenza } from "../dati/tipi";

function notaTrend(c: Convergenza) {
  const t = c.trend;
  if (!t) return null;
  if (!t.agganciato) return <span> · tema nuovo</span>;
  const da = t.delta_articoli ?? 0;
  const dt = t.delta_testate ?? 0;
  const segno = da !== 0 ? da : dt;
  if (segno === 0) return <span> · stabile sul giorno precedente</span>;
  const su = segno > 0;
  const p = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  return (
    <span className={su ? "trend-su" : "trend-giu"}>
      {" · "}
      {su ? "in crescita" : "in calo"}: {p(da)} articoli, {p(dt)} testate
    </span>
  );
}

export function BarraConvergenza({ conv }: { conv: Convergenza }) {
  return (
    <div className="conv">
      <div className="conv-barra">
        <div style={{ width: `${conv.percento}%` }} />
      </div>
      <div className="conv-lbl">
        <b className="pct">{conv.percento}% convergenza</b> · {conv.n_testate}{" "}
        testate · {conv.continenti.join(", ")}
        {notaTrend(conv)}
      </div>
    </div>
  );
}
