// Capa de Base de Dades · accés tipat a les taules de Supabase
// que comparteixen web i mòbil.
//
// L'esquema canònic viu al projecte Supabase (compartit amb l'app
// mòbil). Aquí només repliquem els TIPUS de TypeScript necessaris per
// al client web + helpers d'accés (getProfile, upsertUserProgress,
// recordAttempt, etc.).
//
// **Convenció de question_id (CRÍTICA per a la sincronització
// web ↔ mòbil)**:
//   format → "<topic-slug>:<question-index>"
//   exemples → "ce78:0", "ce78:42", "cp-10-1995:7", "transit-lsv:3"
//
// La mateixa convenció s'aplica a `flashcards_progress.card_id` quan
// la flashcard prové d'una pregunta fallada (mateix valor que el
// question_id). Aquesta convenció ha de ser compartida amb l'app
// mòbil — si la mòbil escriu un altre format, el progrés viurà en
// universos paral·lels al mateix projecte.

import { requireSupabase } from './supabase';

/* ── Tipus tipats segons l'esquema de Supabase ────────────────── */

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  cuerpo: string | null;
  tip_number: string | null;
  department: string | null;
  // Addicions web (vegeu supabase/schema-web-additions.sql).
  avatar_color: number;
  avatar_pet: number;
  avatar_badge: number;
  theme: number;
  newsletter_subscribed: boolean;
  newsletter_subscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  user_id: string;
  xp: number;
  level: number;
  gems: number;
  streak_count: number;
  streak_last_date: string | null;
  badges: string[];
  updated_at: string;
};

export type Attempt = {
  id?: string;
  user_id: string;
  question_id: string;
  selected: string | null;
  correct: boolean;
  duration_ms: number | null;
  session_id: string | null;
  taken_at?: string;
};

export type FlashcardProgress = {
  user_id: string;
  card_id: string;
  interval_days: number;
  next_review: string;
  last_rating: string | null;
  reviews: number;
  updated_at: string;
};

export type MissionProgress = {
  user_id: string;
  mission_id: string;
  date: string;
  type: string;
  goal: number;
  progress: number;
  reward_gems: number;
  done: boolean;
  updated_at: string;
};

export type Favorite = {
  user_id: string;
  kind: 'law' | 'operativa' | 'topic' | 'fitxa';
  slug: string;
  module_slug: string | null;
  title: string | null;
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  display_name: string;
  cuerpo: string | null;
  department: string | null;
  avatar_color: number;
  avatar_pet: number;
  total_xp: number;
  level: number;
  gems: number;
  streak_count: number;
  streak_last_date: string | null;
};

/* ── Helpers de question_id ───────────────────────────────────── */

/** Construeix l'ID estable d'una pregunta (web ↔ mòbil compartit). */
export function makeQuestionId(topicSlug: string, index: number): string {
  return `${topicSlug}:${index}`;
}

/** Parseja un question_id al format `<slug>:<index>`. */
export function parseQuestionId(id: string): { topicSlug: string; index: number } | null {
  const m = id.match(/^([\w-]+):(\d+)$/);
  if (!m) return null;
  return { topicSlug: m[1], index: parseInt(m[2], 10) };
}

/* ── Profile ─────────────────────────────────────────────────── */

export async function getProfile(userId: string): Promise<Profile | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function updateProfile(
  userId: string,
  patch: Partial<
    Pick<Profile, 'name' | 'cuerpo' | 'tip_number' | 'department'
      | 'avatar_color' | 'avatar_pet' | 'avatar_badge' | 'theme'
      | 'newsletter_subscribed'>
  >,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb
    .from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

/* ── User progress (XP/level/gems/streak/badges) ─────────────── */

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as UserProgress | null;
}

/** Upsert segur: si no existeix la fila, la crea amb defaults. */
export async function upsertUserProgress(
  userId: string,
  patch: Partial<Omit<UserProgress, 'user_id' | 'updated_at'>>,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from('user_progress').upsert({
    user_id: userId,
    ...patch,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/* ── Attempts (log granular per pregunta) ─────────────────────── */

export async function recordAttempt(a: Omit<Attempt, 'id' | 'taken_at'>): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from('attempts').insert(a);
  if (error) throw error;
}

/** Llegeix les estadístiques resumides per pregunta (vista). */
export async function getAttemptsSummary(userId: string): Promise<
  { question_id: string; total: number; correct: number; last_at: string }[]
> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('attempts_user_summary')
    .select('question_id, total, correct, last_at')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []) as never;
}

/* ── Flashcards (SRS / Anki) ─────────────────────────────────── */

export async function getFlashcardsDue(userId: string): Promise<FlashcardProgress[]> {
  const sb = requireSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await sb
    .from('flashcards_progress')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review', today)
    .order('next_review', { ascending: true });
  if (error) throw error;
  return (data ?? []) as FlashcardProgress[];
}

export async function upsertFlashcardProgress(
  userId: string,
  cardId: string,
  patch: Partial<Omit<FlashcardProgress, 'user_id' | 'card_id' | 'updated_at'>>,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from('flashcards_progress').upsert({
    user_id: userId,
    card_id: cardId,
    ...patch,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/* ── Missions (reptes diaris) ────────────────────────────────── */

export async function getTodayMissions(userId: string): Promise<MissionProgress[]> {
  const sb = requireSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await sb
    .from('missions_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today);
  if (error) throw error;
  return (data ?? []) as MissionProgress[];
}

export async function upsertMissionProgress(
  m: Omit<MissionProgress, 'updated_at'>,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb
    .from('missions_progress')
    .upsert({ ...m, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/* ── Favorites ───────────────────────────────────────────────── */

export async function listFavorites(userId: string): Promise<Favorite[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Favorite[];
}

export async function addFavorite(f: Omit<Favorite, 'created_at'>): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from('favorites').upsert(f);
  if (error) throw error;
}

export async function removeFavorite(
  userId: string,
  kind: Favorite['kind'],
  slug: string,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('kind', kind)
    .eq('slug', slug);
  if (error) throw error;
}

/* ── Leaderboard ─────────────────────────────────────────────── */

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('leaderboard')
    .select('*')
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
}
