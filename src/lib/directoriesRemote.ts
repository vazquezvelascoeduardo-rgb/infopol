// Loader dels 3 directoris d'Actualitat (personalitats, esports, premis)
// des de la taula public.directories de Supabase. Patró idèntic a
// noticiesRemote.ts: cache en memòria + render no-bloquejant amb
// fallback als TS files locals si Supabase no està configurat o falla.
//
// L'Edge Function setmanal `update-directories` mantindrà la taula al
// dia (cron de dilluns 6:00 UTC).

import { useEffect, useState } from 'react';
import { supabase, isBackendEnabled } from './supabase';
import {
  PERSONALITATS,
  PERSONALITATS_UPDATED_AT,
  type LeaderSection,
} from './personalitats';
import { ESPORTS, ESPORTS_UPDATED_AT, type SportSection } from './esports';
import { PREMIS, PREMIS_UPDATED_AT, type AwardSection } from './premis';

export type DirectoryCategory = 'personalitats' | 'esports' | 'premis';

type RemoteRow = {
  category: string;
  section_key: string;
  section_title: string;
  section_short_label: string;
  section_icon: string;
  section_accent: string;
  section_sort: number;
  subsection_title: string | null;
  subsection_icon: string | null;
  subsection_compact: boolean;
  subsection_sort: number;
  position: string;
  name: string;
  detail: string | null;
  flag: string | null;
  url: string | null;
  recent: boolean;
  entry_sort: number;
  updated_at: string;
};

// Estructura jeràrquica que retornem al consumidor: mateix shape que els
// TS locals (LeaderSection / SportSection / AwardSection) per poder
// reaprofitar SectionView i la resta del UI sense canvis.
type AnySection = LeaderSection | SportSection | AwardSection;

function buildSections(rows: RemoteRow[]): AnySection[] {
  // Agrupem per section_key i, dins, per subsection_sort.
  const sectionsMap = new Map<string, AnySection>();
  const subsectionsMap = new Map<string, Map<number, AnySection['subsections'][number]>>();

  for (const r of rows) {
    let sec = sectionsMap.get(r.section_key);
    if (!sec) {
      sec = {
        id: r.section_key,
        title: r.section_title,
        shortLabel: r.section_short_label,
        icon: r.section_icon,
        accent: r.section_accent,
        subsections: [],
      } as AnySection;
      sectionsMap.set(r.section_key, sec);
      subsectionsMap.set(r.section_key, new Map());
    }
    const subsMap = subsectionsMap.get(r.section_key)!;
    let sub = subsMap.get(r.subsection_sort);
    if (!sub) {
      sub = {
        title: r.subsection_title ?? undefined,
        icon: r.subsection_icon ?? undefined,
        compact: r.subsection_compact || undefined,
        entries: [],
      } as AnySection['subsections'][number];
      subsMap.set(r.subsection_sort, sub);
      sec.subsections.push(sub);
    }
    (sub.entries as Array<Record<string, unknown>>).push({
      position: r.position,
      name: r.name,
      detail: r.detail ?? undefined,
      flag: r.flag ?? undefined,
      url: r.url ?? undefined,
      recent: r.recent || undefined,
    });
  }

  return Array.from(sectionsMap.values());
}

// Cache en memòria per categoria.
const cache: Partial<Record<DirectoryCategory, AnySection[]>> = {};
const inFlight: Partial<Record<DirectoryCategory, Promise<AnySection[]>>> = {};
const updatedAt: Partial<Record<DirectoryCategory, string>> = {};

const FALLBACK: Record<DirectoryCategory, { sections: AnySection[]; updatedAt: string }> = {
  personalitats: { sections: PERSONALITATS, updatedAt: PERSONALITATS_UPDATED_AT },
  esports:       { sections: ESPORTS as unknown as AnySection[], updatedAt: ESPORTS_UPDATED_AT },
  premis:        { sections: PREMIS as unknown as AnySection[], updatedAt: PREMIS_UPDATED_AT },
};

async function fetchRemote(category: DirectoryCategory): Promise<AnySection[]> {
  if (!isBackendEnabled || !supabase) return FALLBACK[category].sections;
  const { data, error } = await supabase
    .from('directories')
    .select('*')
    .eq('category', category)
    .order('section_sort', { ascending: true })
    .order('subsection_sort', { ascending: true })
    .order('entry_sort', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK[category].sections;
  const rows = data as RemoteRow[];
  // Guarda l'updated_at més recent per a mostrar-lo a la UI.
  const maxUpdated = rows
    .map((r) => r.updated_at)
    .sort()
    .pop();
  if (maxUpdated) updatedAt[category] = maxUpdated.slice(0, 10);
  return buildSections(rows);
}

/**
 * Hook que retorna les seccions d'un directori (locals al primer render,
 * remotes quan arribin) i la data d'última actualització.
 */
export function useDirectory<T extends AnySection>(
  category: DirectoryCategory,
): { sections: T[]; updatedAt: string } {
  const [sections, setSections] = useState<AnySection[]>(
    () => cache[category] ?? FALLBACK[category].sections,
  );
  const [date, setDate] = useState<string>(
    () => updatedAt[category] ?? FALLBACK[category].updatedAt,
  );

  useEffect(() => {
    if (cache[category]) {
      setSections(cache[category]!);
      setDate(updatedAt[category] ?? FALLBACK[category].updatedAt);
      return;
    }
    if (!inFlight[category]) {
      inFlight[category] = fetchRemote(category).then((s) => {
        cache[category] = s;
        return s;
      });
    }
    let cancelled = false;
    inFlight[category]!.then((s) => {
      if (cancelled) return;
      setSections(s);
      setDate(updatedAt[category] ?? FALLBACK[category].updatedAt);
    });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { sections: sections as T[], updatedAt: date };
}
