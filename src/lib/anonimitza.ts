// Anonimitzacio de dades personals abans d'enviar-les a l'assistent.
//
// Els DNI, matricules, telefons i companyia se substitueixen per marcadors
// del tipus [DNI_1] just abans de sortir del dispositiu. El diccionari que
// relaciona marcador i valor real NO viatja enlloc: es queda a la memoria
// del navegador o de l'app, i s'usa per tornar a posar els valors bons a la
// resposta. Aixi la minuta surt amb el DNI de veritat, pero el proveidor
// d'IA no l'ha vist mai.
//
// Nota: els adjunts (fotos, PDF) NO es poden anonimitzar. Si una foto porta
// un DNI, el proveidor el veura.

export type MapaAnonim = Record<string, string>;

const LLETRES_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

/** Valida la lletra de control d'un DNI o NIE. Evita falsos positius. */
function dniValid(cos: string, lletra: string): boolean {
  const n = Number(cos);
  if (!Number.isFinite(n)) return false;
  return LLETRES_DNI[n % 23] === lletra.toUpperCase();
}

function nieValid(inicial: string, resta: string, lletra: string): boolean {
  const prefix = { X: '0', Y: '1', Z: '2' }[inicial.toUpperCase()];
  if (prefix === undefined) return false;
  return dniValid(prefix + resta, lletra);
}

type Regla = {
  etiqueta: string;
  re: RegExp;
  /** Filtre extra: si retorna false, no s'anonimitza. */
  accepta?: (m: RegExpExecArray) => boolean;
};

// L'ordre importa: el que va primer guanya. Els patrons mes especifics,
// abans que els generics.
const REGLES: Regla[] = [
  { etiqueta: 'EMAIL', re: /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g },
  {
    etiqueta: 'IBAN',
    re: /\bES\d{2}[ -]?(?:\d{4}[ -]?){4}\d{2}\b/gi,
  },
  {
    etiqueta: 'NIE',
    re: /\b([XYZ])[ -]?(\d{7})[ -]?([A-HJ-NP-TV-Z])\b/gi,
    accepta: (m) => nieValid(m[1], m[2], m[3]),
  },
  {
    etiqueta: 'DNI',
    re: /\b(\d{8})[ -]?([A-HJ-NP-TV-Z])\b/gi,
    accepta: (m) => dniValid(m[1], m[2]),
  },
  // Matricula actual: 1234 BCD (les consonants excloent vocals, Ñ i Q)
  { etiqueta: 'MATRICULA', re: /\b\d{4}[ -]?[BCDFGHJKLMNPRSTVWXYZ]{3}\b/gi },
  // Matricula antiga: B-1234-CD, amb separador obligatori per no confondre
  // amb referencies d'articles.
  { etiqueta: 'MATRICULA', re: /\b[A-Z]{1,2}[ -]\d{4}[ -][A-Z]{2}\b/g },
  // Telefon espanyol: 9 xifres que comencen per 6-9, amb separadors lliures
  // (638451290, 638 45 12 90, 638 451 290, +34 638...). Els separadors han de
  // ser d'un sol caracter perque no s'enganxin dos numeros diferents del text.
  { etiqueta: 'TELEFON', re: /(?:\+34[ .-]?)?\b[6-9](?:[ .-]?\d){8}\b/g },
];

/**
 * Substitueix les dades personals per marcadors.
 * Es pot cridar diverses vegades amb el mateix `mapa` perque un mateix valor
 * rebi sempre el mateix marcador dins d'una conversa.
 */
export function anonimitza(text: string, mapa: MapaAnonim = {}): { text: string; mapa: MapaAnonim } {
  // valor real -> marcador, per reaprofitar marcadors ja assignats
  const invers: Record<string, string> = {};
  for (const [marcador, valor] of Object.entries(mapa)) invers[valor] = marcador;

  let sortida = text;
  for (const regla of REGLES) {
    sortida = sortida.replace(regla.re, (...args) => {
      const m = args.slice(0, -2) as unknown as RegExpExecArray;
      const original = m[0];
      if (regla.accepta && !regla.accepta(m)) return original;
      // Ja anonimitzat en una passada anterior d'aquesta mateixa crida
      if (/^\[[A-Z]+_\d+\]$/.test(original)) return original;
      if (invers[original]) return invers[original];
      const n = Object.keys(mapa).filter((k) => k.startsWith(`[${regla.etiqueta}_`)).length + 1;
      const marcador = `[${regla.etiqueta}_${n}]`;
      mapa[marcador] = original;
      invers[original] = marcador;
      return marcador;
    });
  }
  return { text: sortida, mapa };
}

/** Anonimitza una llista de textos compartint el mateix diccionari. */
export function anonimitzaLlista(textos: string[]): { textos: string[]; mapa: MapaAnonim } {
  const mapa: MapaAnonim = {};
  const out = textos.map((t) => anonimitza(t, mapa).text);
  return { textos: out, mapa };
}

/** Torna a posar els valors reals. Tolerant amb el format que hi posi el model. */
export function desanonimitza(text: string, mapa: MapaAnonim): string {
  let sortida = text;
  for (const [marcador, valor] of Object.entries(mapa)) {
    const cos = marcador.slice(1, -1); // DNI_1
    // Accepta [DNI_1], **[DNI_1]**, `[DNI_1]` i variants amb espais
    const re = new RegExp(`\\[\\s*${cos}\\s*\\]`, 'g');
    sortida = sortida.replace(re, valor);
  }
  return sortida;
}

/** Quantes dades s'han substituit, per poder-ho dir a la interficie. */
export function comptaAnonimitzades(mapa: MapaAnonim): number {
  return Object.keys(mapa).length;
}
