// Enviament de reports d'usuari sobre preguntes possiblement incorrectes.
//
// Dos camins (no excloents):
//   1. Si el backend (Supabase) està actiu → insereix a `question_reports`.
//      Així es poden revisar directament des del dashboard / MCP.
//   2. Sempre construïm un `mailto:` de reserva cap a info@infopol.app
//      amb totes les dades, per si l'usuari prefereix enviar-ho per correu
//      (o si el backend falla).
import { supabase, isBackendEnabled } from './supabase';

export type QuestionReportInput = {
  topicSlug?: string;
  questionId?: string;
  questionText: string;
  /** Text de l'opció marcada com a correcta a l'app. */
  markedCorrect?: string;
  /** Comentari opcional de l'usuari. */
  reason?: string;
};

const SUPPORT_EMAIL = 'info@infopol.app';

/** Construeix l'enllaç mailto de reserva amb tot el context. */
export function buildReportMailto(input: QuestionReportInput): string {
  const subject = `InfoPol — Error en pregunta (${input.questionId ?? 'sense id'})`;
  const body = [
    'He detectat un possible error en aquesta pregunta:',
    '',
    `Tema: ${input.topicSlug ?? '—'}`,
    `ID: ${input.questionId ?? '—'}`,
    `Pregunta: ${input.questionText}`,
    `Resposta marcada com a correcta: ${input.markedCorrect ?? '—'}`,
    '',
    `El meu comentari: ${input.reason || '(cap)'}`,
  ].join('\n');
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Desa el report a Supabase. Retorna true si s'ha desat correctament.
 * Si el backend no està actiu o falla, retorna false (i l'UI pot oferir
 * el mailto de reserva).
 */
export async function submitQuestionReport(
  input: QuestionReportInput,
): Promise<boolean> {
  if (!isBackendEnabled || !supabase) return false;
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user ?? null;
    const { error } = await supabase.from('question_reports').insert({
      topic_slug: input.topicSlug ?? null,
      question_id: input.questionId ?? null,
      question_text: input.questionText,
      marked_correct: input.markedCorrect ?? null,
      reason: input.reason || null,
      user_email: user?.email ?? null,
      user_id: user?.id ?? null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
    return !error;
  } catch {
    return false;
  }
}
