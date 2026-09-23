// Simulacre de la 1a prova de Mossos (convocatòria 46/26).
//
// La prova oficial té dues subproves el mateix dia, i totes dues resten
// una quarta part per cada resposta errònia:
//   · coneixements: 30 preguntes en 35 minuts, apte amb un 4 sobre 10
//   · aptitudinal (psicotècnic): 80 preguntes en 35 minuts, apte amb un 5
//
// El simulacre encadena les dues parts amb les pantalles de test i de
// psicotècnics que ja existeixen; aquí només hi ha les xifres i el
// petit estat que passa d'una part a l'altra.

export const SIMULACRE_MOSSOS = {
  convocatoria: '46/26',
  /** Dia de la 1a prova. */
  data: '2026-10-17',
  coneixements: { preguntes: 30, minuts: 35, minim: 4 },
  aptitudinal: { preguntes: 80, minuts: 35, minim: 5 },
} as const;

/** Adreça de la 1a part: el test de tot el temari de Mossos, en mode examen i amb compte enrere. */
export const RUTA_PART1 =
  `/mossos/tot?n=${SIMULACRE_MOSSOS.coneixements.preguntes}&mode=exam`
  + `&temps=${SIMULACRE_MOSSOS.coneixements.minuts}&simulacre=mossos`;

/** Adreça de la 2a part: el psicotècnic sencer, en mode examen i amb temps. */
export const RUTA_PART2 =
  `/mossos/psicotecnics/tot?n=${SIMULACRE_MOSSOS.aptitudinal.preguntes}&f=exam&t=1&simulacre=mossos`;

/** Nota sobre 10 amb la penalització oficial: cada error resta 1/4 d'encert. */
export function notaOficial(encerts: number, errors: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, ((encerts - errors / 4) / total) * 10);
}

/** Dies que falten per a l'examen (0 el mateix dia, negatiu si ja ha passat). */
export function diesPerExamen(avui = new Date()): number {
  const [a, m, d] = SIMULACRE_MOSSOS.data.split('-').map(Number);
  const examen = Date.UTC(a, m - 1, d);
  const dia = Date.UTC(avui.getFullYear(), avui.getMonth(), avui.getDate());
  return Math.round((examen - dia) / 86_400_000);
}

// La nota de la 1a part es guarda a la sessió del navegador perquè la
// 2a part pugui ensenyar el resultat de tot el simulacre al final.
const CLAU = 'infopol.simulacre-mossos.part1';

export function desaPart1(nota: number): void {
  try { sessionStorage.setItem(CLAU, String(nota)); } catch { /* sense emmagatzematge */ }
}

export function llegeixPart1(): number | null {
  try {
    const v = sessionStorage.getItem(CLAU);
    if (v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
