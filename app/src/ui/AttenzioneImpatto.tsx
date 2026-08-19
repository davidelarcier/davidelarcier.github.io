import type { Convergenza, Rilevanza } from "../dati/tipi";

function milioni(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("it-IT");
}

// Le due grandezze del cono d'ombra, MAI fuse in un numero solo (SPECIFICA):
// Attenzione (convergenza, rosso, corta) vs Impatto (rilevanza demografica,
// ink, lunga). Il divario visivo è il contenuto: pochi ne parlano, molti riguarda.
export function AttenzioneImpatto({
  conv,
  ril,
}: {
  conv: Convergenza;
  ril?: Rilevanza;
}) {
  const quota = ril?.quota_mondiale ?? null; // 0..1 della popolazione mondiale
  const sconto = ril?.sconto_multipaese;
  return (
    <div className="ai">
      <div className="ai-riga">
        <span className="ai-et">Attenzione</span>
        <div className="ai-barra">
          <div className="ai-fill rosso" style={{ width: `${conv.percento}%` }} />
        </div>
        <span className="ai-val">
          <b>{conv.percento}%</b> convergenza · {conv.n_testate} testate
        </span>
      </div>
      <div className="ai-riga">
        <span className="ai-et">Impatto</span>
        <div className="ai-barra">
          <div
            className="ai-fill ink"
            style={{ width: quota != null ? `${Math.round(quota * 100)}%` : "0%" }}
          />
        </div>
        <span className="ai-val">
          <b>{milioni(ril?.popolazione_milioni)} mln</b>
          {quota != null && <> · {Math.round(quota * 100)}% del mondo</>}
        </span>
      </div>
      <div className="ai-portata">
        {ril?.ambito && (
          <span>
            {ril.ambito}
            {ril.portata ? ` · ${ril.portata}` : ""}
          </span>
        )}
        {sconto && (
          <span className="ai-sconto">
            {" "}
            · {milioni(ril?.popolazione_lorda_milioni)} mln lordi, scontati ×
            {sconto.fattore} su {sconto.n_paesi} paesi
          </span>
        )}
      </div>
    </div>
  );
}
