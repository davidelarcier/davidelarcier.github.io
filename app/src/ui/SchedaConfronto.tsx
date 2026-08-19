import type { SchedaConfronto as Scheda } from "../dati/tipi";

// Una scheda del confronto per aree. L'area "di casa" è evidenziata: in prima
// pagina è l'Italia (blu, colore RISERVATO); nelle pagine continentali è il
// continente stesso (accento neutro — mai il blu dell'Italia).
export function SchedaConfronto({
  scheda,
  evidenzia = "Italia",
  accento = "italia",
}: {
  scheda: Scheda;
  evidenzia?: string;
  accento?: "italia" | "continente";
}) {
  const casa = scheda.area === evidenzia;
  const cls = casa
    ? `scheda ${accento === "continente" ? "casa" : "italia"}`
    : "scheda";
  return (
    <div className={cls}>
      <div className="area">{scheda.area}</div>
      <div className="scheda-sint">{scheda.sintesi}</div>
      {scheda.testate?.length > 0 && (
        <div className="scheda-testate">{scheda.testate.join(" · ")}</div>
      )}
    </div>
  );
}
