import type { Tema } from "../dati/tipi";

// Copertura INTERNA al continente (coperte/totali delle sue testate): quanto il
// continente stesso racconta il tema. Barra neutra (ink), distinta dalla barra
// di convergenza mondiale (rossa): qui non si misura il mondo, ma la casa.
export function CoperturaInterna({
  ci,
}: {
  ci: NonNullable<Tema["convergenza_interna"]>;
}) {
  const pct = ci.totali > 0 ? Math.round((ci.coperte / ci.totali) * 100) : 0;
  return (
    <div className="cop-int">
      <div className="cop-int-barra">
        <div style={{ width: `${pct}%` }} />
      </div>
      <div className="cop-int-lbl">
        Copertura interna · {ci.continente} · <b>{ci.coperte}/{ci.totali}</b> testate ({pct}%)
      </div>
    </div>
  );
}
