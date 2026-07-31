// Subratllats i notes del mode estudi.
//
// És el mateix magatzem que fa servir l'app mòbil: la taula `highlights`
// de Supabase, amb les mateixes columnes i els mateixos colors. Si
// subratlles un article al mòbil, en obrir-lo a la web hi és; i al
// revés. Per això aquest fitxer ha de continuar sent bessó del de l'app
// (`infopol-app/src/lib/subratllats.ts`): si canvia un, canvia l'altre.
//
// Els colors NO són decoratius: cadascun diu quina mena de cosa has
// marcat, i d'això surt què entra al repàs i amb quin pes.
import { supabase } from './supabase';

export type ColorSubratllat = 'groc' | 'vermell' | 'blau' | 'verd' | 'gris';

export type Subratllat = {
  id: string;
  /** Document: "<moduleSlug>/<slug>". */
  doc: string;
  /** Índex del bloc de text dins del document. */
  bloc: number;
  ini: number;
  fi: number;
  color: ColorSubratllat;
  text: string;
  nota?: string | null;
  /** Text del bloc sencer: serveix per fer targetes amb forat. */
  context?: string | null;
  targetaId?: string | null;
};

export type DefColor = {
  key: ColorSubratllat;
  etiqueta: string;
  ajuda: string;
  /** Color de fons del subratllat. */
  fons: string;
  /** Color del punt al selector. */
  punt: string;
  /** Pes al diagnòstic: les dades memoritzables valen més que els conceptes. */
  pes: number;
  /** Entra al repàs espaiat? El verd (ja dominat) no. */
  repassa: boolean;
};

export const COLORS: DefColor[] = [
  {
    key: 'vermell', etiqueta: 'Dada', ajuda: 'Terminis, imports, edats, articles',
    fons: 'rgba(224,85,90,0.30)', punt: '#E0555A', pes: 3, repassa: true,
  },
  {
    key: 'groc', etiqueta: 'Concepte', ajuda: 'Definicions i idees clau',
    fons: 'rgba(240,196,78,0.38)', punt: '#F0C44E', pes: 2, repassa: true,
  },
  {
    key: 'blau', etiqueta: 'Procediment', ajuda: 'Passos i enumeracions',
    fons: 'rgba(90,160,222,0.30)', punt: '#5AA0DE', pes: 2, repassa: true,
  },
  {
    key: 'gris', etiqueta: 'Dubte', ajuda: 'Ho has de revisar',
    fons: 'rgba(150,145,160,0.32)', punt: '#9691A0', pes: 1, repassa: true,
  },
  {
    key: 'verd', etiqueta: 'Dominat', ajuda: "Ja te'l saps: surt del repàs",
    fons: 'rgba(95,207,154,0.28)', punt: '#5FCF9A', pes: 0, repassa: false,
  },
];

export const colorInfo = (c: ColorSubratllat): DefColor =>
  COLORS.find((x) => x.key === c) ?? COLORS[1];

type Fila = {
  id: string; doc: string; bloc: number; ini: number; fi: number;
  color: ColorSubratllat; text: string; nota: string | null;
  context: string | null; targeta_id: string | null;
};

const aSubratllat = (f: Fila): Subratllat => ({
  id: f.id, doc: f.doc, bloc: f.bloc, ini: f.ini, fi: f.fi,
  color: f.color, text: f.text, nota: f.nota, context: f.context, targetaId: f.targeta_id,
});

const CAMPS = 'id, doc, bloc, ini, fi, color, text, nota, context, targeta_id';

/** Subratllats d'un document. Buit si no hi ha sessió o backend. */
export async function llegeix(doc: string): Promise<Subratllat[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('highlights')
    .select(CAMPS)
    .eq('doc', doc)
    .order('bloc', { ascending: true })
    .order('ini', { ascending: true });
  if (error || !data) return [];
  return (data as Fila[]).map(aSubratllat);
}

/** Tots els subratllats de l'usuari, per al mode repàs global. */
export async function llegeixTots(colors?: ColorSubratllat[]): Promise<Subratllat[]> {
  if (!supabase) return [];
  let q = supabase
    .from('highlights')
    .select(CAMPS)
    .order('doc', { ascending: true })
    .order('bloc', { ascending: true })
    .order('ini', { ascending: true });
  if (colors?.length) q = q.in('color', colors);
  const { data, error } = await q;
  if (error || !data) return [];
  return (data as Fila[]).map(aSubratllat);
}

export async function afegeix(s: Omit<Subratllat, 'id'>): Promise<Subratllat | null> {
  if (!supabase) return null;
  const { data: sessio } = await supabase.auth.getUser();
  const uid = sessio?.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from('highlights')
    .insert({
      user_id: uid, doc: s.doc, bloc: s.bloc, ini: s.ini, fi: s.fi,
      color: s.color, text: s.text, nota: s.nota ?? null, context: s.context ?? null,
    })
    .select(CAMPS)
    .single();
  if (error || !data) return null;
  return aSubratllat(data as Fila);
}

export async function canviaColor(id: string, color: ColorSubratllat): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('highlights')
    .update({ color, updated_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function posaNota(id: string, nota: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('highlights')
    .update({ nota: nota.trim() || null, updated_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function esborra(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('highlights').delete().eq('id', id);
  return !error;
}

/** Recompte per color d'un document, per pintar el progrés del tema. */
export function recompte(ss: Subratllat[]): Record<ColorSubratllat, number> {
  const r: Record<ColorSubratllat, number> = { groc: 0, vermell: 0, blau: 0, verd: 0, gris: 0 };
  for (const s of ss) r[s.color]++;
  return r;
}

/**
 * Puntuació de domini d'un tema, de 0 a 1.
 * El verd (dominat) suma; la resta compta com a pendent, ponderat pel pes
 * del color. Sense subratllats no hi ha dada: retorna null.
 */
export function domini(ss: Subratllat[]): number | null {
  if (!ss.length) return null;
  let fet = 0;
  let total = 0;
  for (const s of ss) {
    const info = colorInfo(s.color);
    if (s.color === 'verd') { fet += 1; total += 1; continue; }
    total += 1 + info.pes / 3;
  }
  return Math.max(0, Math.min(1, fet / total));
}
