// Progrés dels psicotècnics. Va a part del dels tests de temari, i no és
// per manies: són coses diferents i barrejar-les enganyaria.
//
// Al temari, encertar és saber-ho. Als psicotècnics, encertar és haver-ho
// entrenat prou i haver anat prou de pressa. Una nota mitjana de les dues
// no voldria dir res, i pitjor encara: taparia justament el que has de
// veure, que és quina APTITUD et falla.
//
// Per això aquí no es desa una nota global sinó una per categoria, i
// d'aquí surt la del bloc. Si fluixeges en espacial, això s'ha de veure
// encara que la resta et vagi bé.
import { useCallback, useEffect, useState } from 'react';

import { BLOCS, BLOC_DE } from './psicotecnics/cataleg.mjs';

const CLAU = 'infopol-psico-stats';

export type StatsCategoria = {
  /** Preguntes contestades en total. */
  fetes: number;
  /** Quantes ben contestades. */
  encerts: number;
  /** Sessions acabades. */
  sessions: number;
  /** Millor percentatge d'una sessió (0-100). */
  millor: number;
  /** Percentatge de l'última sessió. */
  ultim: number;
  /** Segons acumulats. */
  segons: number;
  /** Quan va ser l'última vegada. */
  quan: number;
};

export type StatsPsico = { categories: Record<string, StatsCategoria> };

const BUIDA: StatsCategoria = {
  fetes: 0, encerts: 0, sessions: 0, millor: 0, ultim: 0, segons: 0, quan: 0,
};

/**
 * Sempre un objecte NOU, mai una constant compartida.
 *
 * Això no és manies: `desaSessio` escriu a sobre del que li torna aquesta
 * funció. Si tornés sempre la mateixa constant «buida», la primera sessió
 * la deixaria bruta i les següents hi anirien sumant a sobre encara que el
 * calaix estigués buit. És la mena d'errada que no es veu fins que algú
 * esborra el progrés i li tornen a sortir els números d'abans.
 */
const cap = (): StatsPsico => ({ categories: {} });

function llegeix(): StatsPsico {
  if (typeof window === 'undefined') return cap();
  try {
    const cru = window.localStorage.getItem(CLAU);
    if (!cru) return cap();
    const p = JSON.parse(cru);
    if (!p || typeof p !== 'object' || typeof p.categories !== 'object') return cap();
    return { categories: { ...p.categories } };
  } catch {
    return cap();
  }
}

function desa(s: StatsPsico) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CLAU, JSON.stringify(s));
    window.dispatchEvent(new Event('psico-stats'));
  } catch {
    // Si no hi cap, no passa res: el progrés és un extra, no el contingut.
  }
}

/** Què s'ha de desar quan s'acaba una sessió. */
export type ResultatSessio = {
  /** Per categoria: quantes n'hi havia i quantes han anat bé. */
  per: Record<string, { fetes: number; encerts: number }>;
  segons: number;
};

export function desaSessio(r: ResultatSessio) {
  const s = llegeix();
  const ara = Date.now();
  for (const [id, v] of Object.entries(r.per)) {
    if (!v.fetes) continue;
    const a = s.categories[id] ?? { ...BUIDA };
    const pct = Math.round((v.encerts / v.fetes) * 100);
    s.categories[id] = {
      fetes: a.fetes + v.fetes,
      encerts: a.encerts + v.encerts,
      sessions: a.sessions + 1,
      millor: Math.max(a.millor, pct),
      ultim: pct,
      // El temps es reparteix entre les categories de la sessió, a parts
      // iguals. No sabem quant s'ha estat a cada pregunta, i inventar-ho
      // seria pitjor que repartir-ho.
      segons: a.segons + Math.round(r.segons / Object.keys(r.per).length),
      quan: ara,
    };
  }
  desa(s);
}

/** Encerts sobre fetes, en tant per cent. `null` si encara no n'has fet cap. */
export function encertDe(s: StatsPsico, categoria: string): number | null {
  const c = s.categories[categoria];
  if (!c || !c.fetes) return null;
  return Math.round((c.encerts / c.fetes) * 100);
}

/** El mateix, però d'un bloc sencer: suma les seves categories. */
export function encertBloc(s: StatsPsico, blocId: string): number | null {
  const bloc = BLOCS.find((b) => b.id === blocId);
  if (!bloc) return null;
  let fetes = 0, encerts = 0;
  for (const id of bloc.categories) {
    const c = s.categories[id];
    if (!c) continue;
    fetes += c.fetes;
    encerts += c.encerts;
  }
  return fetes ? Math.round((encerts / fetes) * 100) : null;
}

/** Quantes preguntes portes fetes en total. */
export const totalFetes = (s: StatsPsico) =>
  Object.values(s.categories).reduce((n, c) => n + c.fetes, 0);

/**
 * El bloc que pitjor et va, d'entre els que has tocat. És el que s'hauria
 * d'entrenar, i per això val la pena tenir-lo a mà.
 */
export function blocMesFluix(s: StatsPsico): { id: string; pct: number } | null {
  let pitjor: { id: string; pct: number } | null = null;
  for (const b of BLOCS) {
    const pct = encertBloc(s, b.id);
    if (pct === null) continue;
    if (!pitjor || pct < pitjor.pct) pitjor = { id: b.id, pct };
  }
  return pitjor;
}

export function esborraTot() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CLAU);
  window.dispatchEvent(new Event('psico-stats'));
}

/** El progrés, i es refresca sol quan una sessió el canvia. */
export function usePsicoStats(): StatsPsico {
  const [s, setS] = useState<StatsPsico>(cap);
  const refresca = useCallback(() => setS(llegeix()), []);
  useEffect(() => {
    refresca();
    window.addEventListener('psico-stats', refresca);
    window.addEventListener('storage', refresca);
    return () => {
      window.removeEventListener('psico-stats', refresca);
      window.removeEventListener('storage', refresca);
    };
  }, [refresca]);
  return s;
}

export { BLOC_DE };
