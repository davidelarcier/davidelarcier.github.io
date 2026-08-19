// Genera public/indice-edizioni.json scandendo le edizioni prodotte dalla
// pipeline (data/editions/*.json, solo i file "data" YYYY-MM-DD.json, non gli
// intermedi -sintesi/-temi). Serve alla SorgenteLocale per sapere quali
// edizioni esistono e qual è l'ultima. Nessun server: solo file statici.
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const qui = dirname(fileURLToPath(import.meta.url));
const edizioni = join(qui, "..", "..", "data", "editions");
const pubblico = join(qui, "..", "public");

const RE = /^(\d{4}-\d{2}-\d{2})\.json$/; // solo l'edizione, non -sintesi/-temi
let date = [];
try {
  date = readdirSync(edizioni)
    .map((f) => f.match(RE)?.[1])
    .filter(Boolean)
    .sort()
    .reverse();
} catch {
  console.warn(`Cartella edizioni non trovata: ${edizioni}`);
}

mkdirSync(pubblico, { recursive: true });
writeFileSync(
  join(pubblico, "indice-edizioni.json"),
  JSON.stringify({ date, ultima: date[0] ?? null }, null, 2),
);
console.log(`indice-edizioni.json: ${date.length} edizioni, ultima ${date[0] ?? "—"}`);
