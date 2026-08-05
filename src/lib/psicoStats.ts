// Progrés dels psicotècnics a la WEB: el localStorage i prou.
//
// El càlcul no és aquí: viu a `psicotecnics/progres.mjs`, compartit amb
// l'app. Allà es desa a l'AsyncStorage, que va amb promeses, i si el
// càlcul estigués duplicat tard o d'hora la web i l'app dirien coses
// diferents. Aquí només hi ha llegir, escriure i avisar la pantalla.
//
// I va a part del progrés dels tests de temari, que no és per manies: al
// temari encertar és saber-ho, i als psicotècnics és haver-ho entrenat
// prou i haver anat prou de pressa. Una nota que barregés les dues no
// voldria dir res i taparia el que s'ha de veure, que és quina APTITUD et
// falla.
import { useCallback, useEffect, useState } from 'react';

import {
  CLAU, aplicaSessio, blocMesFluix, cap, desDeText, encertBloc, encertDe, totalFetes,
} from './psicotecnics/progres.mjs';

export type StatsCategoria = {
  fetes: number;
  encerts: number;
  sessions: number;
  /** Millor percentatge d'una sessió (0-100). */
  millor: number;
  ultim: number;
  segons: number;
  quan: number;
};

export type StatsPsico = { categories: Record<string, StatsCategoria> };

/** Què s'ha de desar quan s'acaba una sessió. */
export type ResultatSessio = {
  per: Record<string, { fetes: number; encerts: number }>;
  segons: number;
};

function llegeix(): StatsPsico {
  if (typeof window === 'undefined') return cap();
  return desDeText(window.localStorage.getItem(CLAU));
}

export function desaSessio(r: ResultatSessio) {
  if (typeof window === 'undefined') return;
  const nou = aplicaSessio(llegeix(), r);
  try {
    window.localStorage.setItem(CLAU, JSON.stringify(nou));
    window.dispatchEvent(new Event('psico-stats'));
  } catch {
    // Si no hi cap, no passa res: el progrés és un extra, no el contingut.
  }
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

export { blocMesFluix, encertBloc, encertDe, totalFetes };
