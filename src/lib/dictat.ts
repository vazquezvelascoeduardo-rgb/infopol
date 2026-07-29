// Dictat per veu amb l'API de reconeixement del navegador.
//
// No hi ha cap servei nostre pel mig ni, per tant, cap cost per consulta:
// la transcripció la fa el navegador. A canvi, l'àudio surt del dispositiu
// cap als servidors del navegador (Google a Chrome, Apple a Safari) — no
// cap als nostres. Cal dir-ho a qui l'utilitzi, perquè no és el mateix
// tracte que fem servir amb el text escrit.
//
// Suport real: Chrome, Edge i Safari (amb prefix webkit). Firefox no en té,
// i per això el botó s'amaga en comptes de sortir trencat.
import { useCallback, useEffect, useRef, useState } from 'react';

type Alternativa = { transcript: string };
type Resultat = { isFinal: boolean; 0: Alternativa; length: number };
type EsdevenimentResultat = { resultIndex: number; results: { length: number; [i: number]: Resultat } };

type Reconeixedor = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: EsdevenimentResultat) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type ConstructorReconeixedor = new () => Reconeixedor;

function constructor(): ConstructorReconeixedor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstructorReconeixedor;
    webkitSpeechRecognition?: ConstructorReconeixedor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Si el navegador no en té, qui ho faci servir ha d'amagar el botó. */
export const dictatDisponible = (): boolean => constructor() !== null;

export type Dictat = {
  disponible: boolean;
  escoltant: boolean;
  /** Text provisional mentre parles; es buida en tancar la frase. */
  parcial: string;
  error: string | null;
  alterna: () => void;
  atura: () => void;
};

/**
 * @param onText  rep cada tros de text ja tancat, per anar-lo acumulant al camp.
 * @param idioma  'ca-ES' per defecte; el dictat en català va prou bé a Chrome.
 */
export function useDictat(onText: (text: string) => void, idioma = 'ca-ES'): Dictat {
  const [escoltant, setEscoltant] = useState(false);
  const [parcial, setParcial] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<Reconeixedor | null>(null);
  // El callback canvia a cada render; el guardem perquè el reconeixedor
  // sempre cridi l'últim sense haver de tornar-lo a crear.
  const cb = useRef(onText);
  cb.current = onText;

  const atura = useCallback(() => {
    ref.current?.stop();
    setEscoltant(false);
    setParcial('');
  }, []);

  const alterna = useCallback(() => {
    if (escoltant) { atura(); return; }
    const C = constructor();
    if (!C) { setError('El teu navegador no permet dictar.'); return; }

    const r = new C();
    r.lang = idioma;
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (e) => {
      let tancat = '';
      let obert = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) tancat += res[0].transcript;
        else obert += res[0].transcript;
      }
      setParcial(obert);
      if (tancat.trim()) cb.current(tancat.trim());
    };
    r.onerror = (e) => {
      // "aborted" i "no-speech" són normals (has parat tu, o has callat).
      if (e.error === 'aborted' || e.error === 'no-speech') return;
      setError(e.error === 'not-allowed'
        ? 'Cal donar permís al micròfon.'
        : 'No he pogut escoltar. Torna-ho a provar.');
      setEscoltant(false);
    };
    r.onend = () => { setEscoltant(false); setParcial(''); };

    ref.current = r;
    setError(null);
    try { r.start(); setEscoltant(true); } catch { setError('No he pogut engegar el micròfon.'); }
  }, [escoltant, atura, idioma]);

  useEffect(() => () => ref.current?.abort(), []);

  return { disponible: constructor() !== null, escoltant, parcial, error, alterna, atura };
}
