// Sincronització del progrés cap a Supabase (només si hi ha sessió).
//
// La web fa servir localStorage com a font de veritat per a mostrar
// estadístiques. Aquí, quan l'usuari ha iniciat sessió, **pugem** el seu
// progrés (XP, nivell, gemmes, ratxa) a `user_progress` perquè:
//   1) es comparteixi amb l'app mòbil (mateixa fila),
//   2) sigui la base de la lliga / rànquing.
//
// Important: és un push "cap amunt" — mai baixa valors (fa max amb el que
// hi ha al servidor) i NO toca `streak_last_date` ni `badges`, per no
// trepitjar el progrés que pugui haver desat la mòbil.
import { useEffect, useRef } from 'react';
import { useAuth } from './auth';
import { useGlobalStats, type GlobalStats } from './testStats';
import { getUserProgress, upsertUserProgress } from './db';
import { isBackendEnabled } from './supabase';

export type WebProgress = { xp: number; level: number; gems: number; streak: number; answered: number };

/** Deriva XP/nivell/gemmes/ratxa a partir de les estadístiques locals. */
export function webProgressFromStats(s: GlobalStats): WebProgress {
  let answered = 0;
  for (const t of Object.values(s.topics)) answered += t.totalQuestions;
  const xp = answered * 12;
  return {
    xp,
    level: Math.max(1, Math.floor(xp / 200) + 1),
    gems: answered * 5,
    streak: Math.min(99, Math.floor(answered / 4)),
    answered,
  };
}

/** Puja el progrés a Supabase fent max amb el remot (mai baixa). */
export async function pushProgress(userId: string, local: WebProgress): Promise<void> {
  if (!isBackendEnabled) return;
  try {
    const remote = await getUserProgress(userId);
    const xp = Math.max(local.xp, remote?.xp ?? 0);
    const gems = Math.max(local.gems, remote?.gems ?? 0);
    const streak_count = Math.max(local.streak, remote?.streak_count ?? 0);
    const level = Math.max(local.level, remote?.level ?? 1);
    // No escrivim si no hi ha res nou (estalviem peticions).
    if (remote && xp === remote.xp && gems === remote.gems && streak_count === remote.streak_count && level === remote.level) return;
    // Només pugem aquests camps: streak_last_date i badges es preserven.
    await upsertUserProgress(userId, { xp, level, gems, streak_count });
  } catch { /* silenci: la sincronització és best-effort */ }
}

/**
 * Hook global: quan hi ha sessió, puja el progrés a Supabase en iniciar
 * i cada cop que canvien les estadístiques (amb un petit debounce).
 */
export function useProgressSync(): void {
  const { user } = useAuth();
  const stats = useGlobalStats();
  const timer = useRef<number | undefined>(undefined);
  const userId = user?.id;

  useEffect(() => {
    if (!isBackendEnabled || !userId) return;
    const local = webProgressFromStats(stats);
    if (local.answered === 0) return; // res a sincronitzar encara
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { void pushProgress(userId, local); }, 2500);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [userId, stats]);
}
