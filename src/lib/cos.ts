// El cos que estàs preparant: Policia Local o Mossos.
//
// Fins ara cada pantalla se'l guardava pel seu compte i el perdia en
// sortir, així que si et preparaves Mossos havies de tornar a triar-ho a
// cada pàgina i a cada visita. Aquí viu una sola vegada: es desa al
// navegador i les pantalles obertes s'assabenten del canvi a l'instant.
import { useCallback, useEffect, useState } from 'react';

export type Cos = 'pl' | 'mossos';

const CLAU = 'ip.cos.v1';
const ESDEVENIMENT = 'ip:cos';

export type MetaCos = {
  id: Cos;
  /** Nom curt, per als commutadors. */
  label: string;
  /** Nom sencer, per als textos. */
  nom: string;
  /** Kicker en majúscules de la capçalera. */
  kicker: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  /** Ombra de color per als elements destacats. */
  ombra: string;
};

/** Taronja per a Policia Local, granat per a Mossos. */
export const COSSOS: MetaCos[] = [
  {
    id: 'pl',
    label: 'Policia Local',
    nom: 'Policia Local',
    kicker: 'POLICIA LOCAL',
    accent: '#FF7A1A',
    accentInk: '#C4530A',
    accentSoft: '#FFEDDD',
    ombra: 'rgba(255,122,26,.3)',
  },
  {
    id: 'mossos',
    label: 'Mossos',
    nom: "Mossos d'Esquadra",
    kicker: "MOSSOS D'ESQUADRA",
    accent: '#991B1B',
    accentInk: '#991B1B',
    accentSoft: '#F7E5E5',
    ombra: 'rgba(153,27,27,.28)',
  },
];

export function metaCos(cos: Cos): MetaCos {
  return COSSOS.find((c) => c.id === cos) ?? COSSOS[0];
}

function llegeix(): Cos {
  try {
    return localStorage.getItem(CLAU) === 'mossos' ? 'mossos' : 'pl';
  } catch {
    return 'pl';
  }
}

/**
 * El cos actiu, recordat entre visites.
 *
 * Torna també el canviador. Quan una pantalla el canvia, la resta de
 * pantalles muntades s'actualitzen soles: així el commutador d'Acadèmia i
 * el d'Estudia mai diuen coses diferents.
 */
export function useCos(): [Cos, (c: Cos) => void] {
  const [cos, setEstat] = useState<Cos>(llegeix);

  useEffect(() => {
    const escolta = () => setEstat(llegeix());
    window.addEventListener(ESDEVENIMENT, escolta);
    // `storage` només salta entre pestanyes, però hi és per si en tens dues.
    window.addEventListener('storage', escolta);
    return () => {
      window.removeEventListener(ESDEVENIMENT, escolta);
      window.removeEventListener('storage', escolta);
    };
  }, []);

  const canvia = useCallback((c: Cos) => {
    try {
      localStorage.setItem(CLAU, c);
    } catch {
      // navegació privada: el canvi val només per a aquesta sessió
    }
    setEstat(c);
    window.dispatchEvent(new Event(ESDEVENIMENT));
  }, []);

  return [cos, canvia];
}

/**
 * On porta cada secció segons el cos.
 *
 * Si estàs preparant Mossos i toques "Test" o "Esquemes", has d'acabar al
 * material de Mossos, no al de Policia Local.
 */
export const RUTES: Record<Cos, {
  estudi: string;
  test: string;
  esquemes: string;
  flashcards: string;
  debilitats: string;
  logros: string;
}> = {
  pl: {
    estudi: '/estudi',
    test: '/policia-local',
    esquemes: '/policia-local/esquemes',
    flashcards: '/policia-local/flashcards',
    debilitats: '/policia-local/debilitats',
    logros: '/policia-local/logros',
  },
  mossos: {
    // Estudia llegeix el cos actiu del mateix lloc que Acadèmia, així que
    // no cal dir-l'hi per l'adreça: hi arribarà ja amb Mossos posat.
    estudi: '/estudi',
    test: '/mossos',
    esquemes: '/mossos/esquemes',
    flashcards: '/mossos/flashcards',
    debilitats: '/policia-local/debilitats',
    logros: '/policia-local/logros',
  },
};
