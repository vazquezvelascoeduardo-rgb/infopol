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

export type Mode = 'opositor' | 'actiu' | 'ambdos';

const CLAU = 'ip.mode.v1';
const EVENT = 'ip:mode';

export function llegeixMode(): Mode | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(CLAU);
  return v === 'opositor' || v === 'actiu' || v === 'ambdos' ? v : null;
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
    mode: local ?? perDefecte ?? 'ambdos',
    setMode: (m: Mode) => { desaMode(m); setLocal(m); },
  };
}

export const NOMS: Record<Mode, { curt: string; llarg: string; sub: string }> = {
  opositor: { curt: 'Campus', llarg: 'Em preparo una oposició', sub: 'Temari, tests i repàs' },
  actiu: { curt: 'Operativa', llarg: 'Estic en actiu', sub: 'Consulta i eines de servei' },
  ambdos: { curt: 'Tot', llarg: 'Les dues coses', sub: 'Campus i Operativa alhora' },
};

/** Si en aquest mode toca ensenyar cada cosa. */
export const mostra = {
  academia: (m: Mode) => m !== 'actiu',
  operativa: (m: Mode) => m !== 'opositor',
  xat: (m: Mode) => m !== 'opositor',
};
