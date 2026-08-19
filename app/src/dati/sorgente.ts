// Accesso ai dati dietro un'UNICA interfaccia: oggi legge file locali serviti
// come statici (lettore locale, nessun backend); domani basterà una diversa
// implementazione (server HTTP) senza toccare il resto dell'app.

import type { Edizione } from "./tipi";

export interface IndiceEdizioni {
  date: string[]; // date disponibili, dalla più recente
  ultima: string | null;
}

export interface SorgenteEdizioni {
  indice(): Promise<IndiceEdizioni>;
  edizione(data: string): Promise<Edizione>;
  urlPdf(data: string): string; // link al PDF (aperto esternamente)
}

/**
 * Sorgente LOCALE: legge le edizioni servite come file statici sotto
 * ``/edizioni`` (in sviluppo Vite serve la cartella data/editions della
 * pipeline via symlink; l'indice è generato da scripts/indice.mjs).
 */
export class SorgenteLocale implements SorgenteEdizioni {
  private base: string;
  constructor(base = "") {
    this.base = base;
  }

  async indice(): Promise<IndiceEdizioni> {
    const r = await fetch(`${this.base}/indice-edizioni.json`);
    if (!r.ok) throw new Error(`Indice edizioni non disponibile (${r.status})`);
    return r.json();
  }

  async edizione(data: string): Promise<Edizione> {
    const r = await fetch(`${this.base}/edizioni/${data}.json`);
    if (!r.ok) throw new Error(`Edizione ${data} non trovata (${r.status})`);
    return r.json();
  }

  urlPdf(data: string): string {
    return `${this.base}/edizioni/${data}.pdf`;
  }
}

export const sorgente: SorgenteEdizioni = new SorgenteLocale();
