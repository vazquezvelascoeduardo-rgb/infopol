// Càrrega dels fitxers del temari de Mossos d'Esquadra.
//
// Mateix mecanisme que el temari de Policia Local: els .md viuen a
// `content/temari-mossos/` i s'incorporen al build amb un glob de Vite.
// Un tema existeix quan hi ha el seu fitxer; mentre no n'hi hagi, la
// pantalla ho diu clarament en comptes d'obrir-se buida.
import { parseTema, type TemaContingut } from '../../lib/temari-format';
import { TEMES_MOSSOS, type TemaMossos } from './index';

const CRUS = import.meta.glob('/content/temari-mossos/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Fitxers disponibles, indexats pel nom sense extensió. */
const PER_FITXER = new Map<string, string>();
for (const [ruta, cos] of Object.entries(CRUS)) {
  const nom = ruta.split('/').pop()?.replace(/\.md$/, '') ?? '';
  if (nom) PER_FITXER.set(nom, cos);
}

export const teContingutMossos = (t: TemaMossos): boolean => PER_FITXER.has(t.fitxer);

/** Quants temes tenen el contingut escrit. */
export const nDisponiblesMossos = (): number => TEMES_MOSSOS.filter(teContingutMossos).length;

const CACHE = new Map<string, TemaContingut>();

/** Contingut ja processat d'un tema, o null si encara no s'ha escrit. */
export function contingutDeMossos(t: TemaMossos): TemaContingut | null {
  const cru = PER_FITXER.get(t.fitxer);
  if (!cru) return null;
  const cached = CACHE.get(t.fitxer);
  if (cached) return cached;
  const parsed = parseTema(cru);
  CACHE.set(t.fitxer, parsed);
  return parsed;
}
