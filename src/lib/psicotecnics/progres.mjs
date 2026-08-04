// El càlcul del progrés, sense saber on es desa.
//
// La web desa al localStorage, que és immediat; l'app a l'AsyncStorage, que
// va amb promeses. Si el càlcul visqués dins de cada una, hi hauria dues
// versions de la mateixa cosa i tard o d'hora dirien coses diferents.
//
// Per això aquí no es desa res: es reben unes estadístiques, se'n tornen
// unes altres, i qui crida ja s'ho apanya per guardar-les. Així la web i
// l'app compten igual per construcció, no per casualitat.
import { BLOCS } from './cataleg.mjs';

export const CLAU = 'infopol-psico-stats';

const BUIDA = { fetes: 0, encerts: 0, sessions: 0, millor: 0, ultim: 0, segons: 0, quan: 0 };

/** Unes estadístiques buides. Sempre un objecte NOU: es fa servir per escriure-hi. */
export const cap = () => ({ categories: {} });

/** Llegeix el que s'hagi desat, passi el que passi amb el que hi hagi. */
export function desDeText(cru) {
  if (!cru) return cap();
  try {
    const p = JSON.parse(cru);
    if (!p || typeof p !== 'object' || typeof p.categories !== 'object') return cap();
    return { categories: { ...p.categories } };
  } catch {
    return cap();
  }
}

/**
 * Suma una sessió a les estadístiques i en torna unes de noves.
 * `resultat` és { per: { categoria: { fetes, encerts } }, segons }.
 */
export function aplicaSessio(stats, resultat, ara = Date.now()) {
  const out = { categories: { ...stats.categories } };
  const categories = Object.keys(resultat.per);
  for (const [id, v] of Object.entries(resultat.per)) {
    if (!v.fetes) continue;
    const a = out.categories[id] ?? BUIDA;
    const pct = Math.round((v.encerts / v.fetes) * 100);
    out.categories[id] = {
      fetes: a.fetes + v.fetes,
      encerts: a.encerts + v.encerts,
      sessions: a.sessions + 1,
      millor: Math.max(a.millor, pct),
      ultim: pct,
      // El temps es reparteix entre les categories de la sessió, a parts
      // iguals. No sabem quant s'ha estat a cada pregunta, i inventar-ho
      // seria pitjor que repartir-ho.
      segons: a.segons + Math.round(resultat.segons / categories.length),
      quan: ara,
    };
  }
  return out;
}

/** Encerts sobre fetes, en tant per cent. `null` si encara no n'has fet cap. */
export function encertDe(stats, categoria) {
  const c = stats.categories[categoria];
  if (!c || !c.fetes) return null;
  return Math.round((c.encerts / c.fetes) * 100);
}

/** El mateix, però d'un bloc sencer: suma les seves categories. */
export function encertBloc(stats, blocId) {
  const bloc = BLOCS.find((b) => b.id === blocId);
  if (!bloc) return null;
  let fetes = 0, encerts = 0;
  for (const id of bloc.categories) {
    const c = stats.categories[id];
    if (!c) continue;
    fetes += c.fetes;
    encerts += c.encerts;
  }
  return fetes ? Math.round((encerts / fetes) * 100) : null;
}

/** Quantes preguntes portes fetes en total. */
export const totalFetes = (stats) =>
  Object.values(stats.categories).reduce((n, c) => n + c.fetes, 0);

/**
 * El bloc que pitjor et va, d'entre els que has tocat. És el que s'hauria
 * d'entrenar, i per això val la pena tenir-lo a mà.
 */
export function blocMesFluix(stats) {
  let pitjor = null;
  for (const b of BLOCS) {
    const pct = encertBloc(stats, b.id);
    if (pct === null) continue;
    if (!pitjor || pct < pitjor.pct) pitjor = { id: b.id, pct };
  }
  return pitjor;
}
