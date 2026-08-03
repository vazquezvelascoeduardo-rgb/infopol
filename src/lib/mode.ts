// En quin mode fas servir InfoPol ara mateix.
//
// InfoPol serveix dues persones que no volen el mateix: qui es prepara
// l'oposició i qui ja està al carrer. Fins ara ho tenien tot barrejat a
// la mateixa barra, i cadascú havia de saltar-se la meitat de les coses.
//
// El mode surt del perfil d'ús que es tria en entrar per primer cop
// (`profiles.perfil_us`), però es pot canviar en qualsevol moment sense
// tocar el perfil desat: el canvi es guarda al navegador, com el cos de
// l'Acadèmia. Així es pot mirar l'altra banda un moment sense que et
// canviï el compte.
//
// No amaga contingut: les rutes segueixen totes vives i el cercador les
// troba igual. El que canvia és què et proposa la navegació.
import { useEffect, useState } from 'react';

// Dos modes, no tres. Hi havia un "Tot" que ho ensenyava tot alhora, i era
// precisament el que volíem evitar: qui el triava tornava a tenir les dotze
// portes de sempre. Qui fa les dues coses canvia de mode amb un toc.
export type Mode = 'opositor' | 'actiu';

const CLAU = 'ip.mode.v1';
const EVENT = 'ip:mode';

/** El perfil desat pot dir 'ambdos' (ve d'abans): compta com a opositor. */
export function normalitza(v: string | null | undefined): Mode | null {
  if (v === 'actiu') return 'actiu';
  if (v === 'opositor' || v === 'ambdos') return 'opositor';
  return null;
}

export function llegeixMode(): Mode | null {
  if (typeof localStorage === 'undefined') return null;
  return normalitza(localStorage.getItem(CLAU));
}

export function desaMode(m: Mode) {
  try {
    localStorage.setItem(CLAU, m);
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch { /* navegador sense emmagatzematge: el mode dura la sessió */ }
}

/**
 * El mode actiu. `perDefecte` és el que ve del perfil desat; el que hi
 * hagi al navegador mana per damunt.
 */
export function useMode(perDefecte: Mode | null): { mode: Mode; setMode: (m: Mode) => void } {
  const [local, setLocal] = useState<Mode | null>(() => llegeixMode());

  useEffect(() => {
    const escolta = () => setLocal(llegeixMode());
    window.addEventListener(EVENT, escolta);
    window.addEventListener('storage', escolta);
    return () => {
      window.removeEventListener(EVENT, escolta);
      window.removeEventListener('storage', escolta);
    };
  }, []);

  return {
    mode: local ?? perDefecte ?? 'opositor',
    setMode: (m: Mode) => { desaMode(m); setLocal(m); },
  };
}

export const MODES: Mode[] = ['opositor', 'actiu'];

export const NOMS: Record<Mode, { curt: string; llarg: string; sub: string }> = {
  opositor: { curt: 'Campus', llarg: 'Em preparo una oposició', sub: 'Temari, tests i repàs' },
  actiu: { curt: 'Operativa', llarg: 'Estic en actiu', sub: 'Consulta i eines de servei' },
};

/** Si en aquest mode toca ensenyar cada cosa. */
export const mostra = {
  academia: (m: Mode) => m === 'opositor',
  operativa: (m: Mode) => m === 'actiu',
  xat: (m: Mode) => m === 'actiu',
};
