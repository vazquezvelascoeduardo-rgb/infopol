// Quadrant de torns — magatzem local.
//
// Bessó del de l'app (que fa servir AsyncStorage); aquí és
// localStorage. Mateixa clau i mateix format: `{ "2026-07-31": "M" }`.
//
// De moment cada dispositiu porta el seu quadrant: no se sincronitza a
// Supabase a cap de les dues bandes. Si algun dia es fa, el format ja hi
// és preparat.
export type TornCode = 'M' | 'T' | 'N' | 'T/N' | 'M/T' | 'F' | 'V';
export type QuadrantMap = Record<string, TornCode>;

const CLAU = 'ip.quadrant.v1';

export type Torn = { code: TornCode; nom: string; color: string; hores: number };

/** Els torns, amb els mateixos colors i hores que a l'app. */
export const TORNS: Torn[] = [
  { code: 'M', nom: 'Matí', color: '#0B4F8A', hores: 8 },
  { code: 'T', nom: 'Tarda', color: '#9A5B00', hores: 8 },
  { code: 'N', nom: 'Nit', color: '#3F3D9E', hores: 8 },
  { code: 'T/N', nom: 'Tarda/Nit', color: '#7A4FA3', hores: 12 },
  { code: 'M/T', nom: 'Matí/Tarda', color: '#186B47', hores: 12 },
  { code: 'F', nom: 'Festa', color: '#FF7A1A', hores: 0 },
  { code: 'V', nom: 'Vacances', color: '#54B487', hores: 0 },
];

export const META: Record<TornCode, Torn> = Object.fromEntries(
  TORNS.map((x) => [x.code, x]),
) as Record<TornCode, Torn>;

function totes(): QuadrantMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CLAU);
    return raw ? (JSON.parse(raw) as QuadrantMap) : {};
  } catch {
    return {};
  }
}

/** Només les assignacions de l'any demanat. */
export function getQuadrant(year: number): QuadrantMap {
  const prefix = `${year}-`;
  const out: QuadrantMap = {};
  for (const [k, v] of Object.entries(totes())) {
    if (k.startsWith(prefix)) out[k] = v;
  }
  return out;
}

/** Assigna (o esborra, amb null) el torn d'un dia. */
export function setQuadrantDay(dateISO: string, torn: TornCode | null): void {
  const all = totes();
  if (torn) all[dateISO] = torn;
  else delete all[dateISO];
  try {
    window.localStorage.setItem(CLAU, JSON.stringify(all));
  } catch {
    // Si el navegador no deixa desar, no bloquegem: el mes es continua
    // veient, només que no es recordarà.
  }
}

export const MESOS = [
  'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
  'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre',
];

export const DIES = ['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'];

export function diesDelMes(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

/** Columna 0-6 (DL-DG) del dia 1 del mes: la setmana comença dilluns. */
export function offsetInici(year: number, month0: number): number {
  return (new Date(year, month0, 1).getDay() + 6) % 7;
}

export function iso(year: number, month0: number, day: number): string {
  const m = String(month0 + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}
