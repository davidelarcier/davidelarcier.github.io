// Modello dati dell'edizione — rispecchia il JSON prodotto dalla pipeline
// (data/editions/YYYY-MM-DD.json). È il CONTRATTO tra pipeline e app.
//
// Vincolo legale per costruzione: qui NON esiste alcun campo con il testo
// integrale degli articoli. L'app mostra sempre e solo: titolo (della fonte) +
// nostra sintesi + link alla fonte. Se un domani l'app diventasse pubblica,
// è già conforme perché il modello stesso non può rappresentare il corpo.

export interface Fonte {
  testata: string;
  url: string;
  titolo: string; // titolo ORIGINALE della fonte
  titolo_it?: string | null; // nostra traduzione del titolo, quando c'è
  paese?: string;
  continente?: string;
  lingua_originale?: string | null; // per l'etichetta "tradotto da …"
  live_blog?: boolean;
}

export interface SchedaConfronto {
  area: string; // "Italia", un continente, o "Resto del mondo" (continentali)
  sintesi: string; // NOSTRA sintesi di come quell'area racconta il tema
  testate: string[];
}

export interface Trend {
  agganciato: boolean;
  delta_articoli?: number;
  delta_testate?: number;
  rispetto_a?: string;
}

export interface Convergenza {
  percento: number;
  n_testate: number;
  continenti: string[];
  paesi?: string[];
  trend?: Trend | null;
  copertura_per_continente?: Record<
    string,
    { coperte: number; totali: number; quota: number }
  >;
}

export interface Rilevanza {
  popolazione_milioni: number | null;
  quota_mondiale: number | null;
  ambito?: string;
  portata?: string | null;
  paesi?: string[];
  sconto_multipaese?: { n_paesi: number; fattore: number } | null;
  popolazione_lorda_milioni?: number | null; // prima dello sconto multi-paese
}

export interface PuntoAndamento {
  giorno: string;
  n_testate: number;
  n_articoli?: number;
}

export interface Dissolvenza {
  dissolvenza: boolean;
  picco_testate?: number;
  picco_giorno?: string;
  testate_oggi?: number;
  andamento?: PuntoAndamento[]; // serie storica (più recente per prima nel JSON)
}

export interface Tema {
  id: number;
  titolo: string;
  titolo_da?: string | null;
  titolo_provvisorio?: boolean;
  titolo_tradotto?: boolean;
  sintesi: string | null; // nostra sintesi generale
  confronto: SchedaConfronto[];
  convergenza: Convergenza;
  n_articoli: number;
  fonti: Fonte[]; // fonti snelle (titolo + link), già in italiano dove tradotte
  fonti_omesse?: number;
  // Solo per il cono d'ombra / continentali:
  rilevanza?: Rilevanza;
  motivi?: string[];
  dissolvenza?: Dissolvenza | null;
  convergenza_interna?: { continente: string; coperte: number; totali: number };
}

export interface PaginaContinentale {
  continente: string;
  temi: Tema[];
}

export interface Edizione {
  data: string; // "YYYY-MM-DD"
  generato: string;
  temi: Tema[]; // prima pagina
  cono_ombra: { temi: Tema[] };
  pagine_continentali: PaginaContinentale[];
  degrado: string[];
}
