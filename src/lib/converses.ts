// Historial del xat, desat a Supabase.
//
// La regla que fa que això sigui acceptable: només s'hi desa el text
// ANONIMITZAT — el mateix que viatja al model, amb els DNI, NIE, matrícules
// i telèfons ja substituïts per marcadors al navegador. El diccionari que
// permetria desfer-ho no surt mai del dispositiu, de manera que ni nosaltres
// ni ningú amb accés a la base pot recuperar les dades personals.
//
// Conseqüència visible: en recuperar una conversa antiga hi veuràs [DNI_1]
// on hi havia un DNI. És el preu de no guardar-lo, i és intencionat.
import { supabase, isBackendEnabled } from './supabase';

export type ConversaMeta = {
  id: string;
  mode: string;
  titol: string;
  updatedAt: string;
};

export type MissatgeDesat = { role: 'user' | 'assistant'; text: string };

/** Títol a partir de la primera pregunta: prou per reconèixer-la a la llista. */
function titolDe(text: string): string {
  const net = text.replace(/\s+/g, ' ').trim();
  if (!net) return 'Conversa';
  return net.length > 70 ? `${net.slice(0, 70)}…` : net;
}

/**
 * Desa (o actualitza) una conversa sencera. Retorna l'id, que cal conservar
 * per anar-hi afegint els missatges següents.
 *
 * Es reescriuen tots els missatges en comptes d'afegir-hi només els nous:
 * són poques files i així no cal portar el compte de què s'havia desat.
 */
export async function desaConversa(
  id: string | null,
  mode: string,
  missatges: MissatgeDesat[],
): Promise<string | null> {
  if (!isBackendEnabled || !missatges.length) return id;
  const { data: sessio } = await supabase.auth.getUser();
  const uid = sessio.user?.id;
  if (!uid) return null;

  let conversaId = id;
  const titol = titolDe(missatges.find((m) => m.role === 'user')?.text ?? '');

  if (!conversaId) {
    const { data, error } = await supabase
      .from('chat_converses')
      .insert({ user_id: uid, mode, titol })
      .select('id')
      .single();
    if (error || !data) return null;
    conversaId = data.id as string;
  } else {
    await supabase
      .from('chat_converses')
      .update({ titol, updated_at: new Date().toISOString() })
      .eq('id', conversaId);
    await supabase.from('chat_missatges').delete().eq('conversa_id', conversaId);
  }

  const files = missatges.map((m, i) => ({
    conversa_id: conversaId, role: m.role, text: m.text, ordre: i,
  }));
  const { error } = await supabase.from('chat_missatges').insert(files);
  if (error) return conversaId;
  return conversaId;
}

/** Les converses de l'usuari, de la més recent a la més antiga. */
export async function llistaConverses(limit = 40): Promise<ConversaMeta[]> {
  if (!isBackendEnabled) return [];
  const { data } = await supabase
    .from('chat_converses')
    .select('id, mode, titol, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map((r) => ({
    id: r.id as string,
    mode: r.mode as string,
    titol: r.titol as string,
    updatedAt: r.updated_at as string,
  }));
}

/** Els missatges d'una conversa, en ordre. */
export async function carregaConversa(id: string): Promise<MissatgeDesat[]> {
  if (!isBackendEnabled) return [];
  const { data } = await supabase
    .from('chat_missatges')
    .select('role, text, ordre')
    .eq('conversa_id', id)
    .order('ordre', { ascending: true });
  return (data ?? []).map((r) => ({ role: r.role as 'user' | 'assistant', text: r.text as string }));
}

export async function esborraConversa(id: string): Promise<void> {
  if (!isBackendEnabled) return;
  await supabase.from('chat_converses').delete().eq('id', id);
}

/** Esborra-ho tot: l'usuari ha de poder marxar sense deixar rastre. */
export async function esborraTotesLesConverses(): Promise<void> {
  if (!isBackendEnabled) return;
  const { data: sessio } = await supabase.auth.getUser();
  const uid = sessio.user?.id;
  if (!uid) return;
  await supabase.from('chat_converses').delete().eq('user_id', uid);
}
