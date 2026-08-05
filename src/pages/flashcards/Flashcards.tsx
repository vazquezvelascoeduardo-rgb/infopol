// Flashcards · estudi tipus Anki amb SRS (forgetting curve).
//
// El pool barreja TOTES les cartes del cos (Policia Local o Mossos) — no
// va per temes individuals. La selecció prioritza:
//   1. Cartes due (next review <= ara)
//   2. Cartes noves (mai estudiades)
//
// Per cada carta, després de revelar la resposta, l'usuari valora:
//   - Encara no (Again) → tornarà a sortir a la mateixa sessió
//   - Bona (Good) → interval creixent: 1d → 3d → 7d → 14d → 30d → 60d → 120d → 240d
//   - Fàcil (Easy) → salta 2 nivells
//
// Estat persistit a localStorage (separat per cos).
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TOPICS } from '../../data/tests';
import { shuffleQuestion, type ShuffledQuestion } from '../../lib/testRunner';
import { metaCos } from '../../lib/cos';
import { I, Mono, V } from '../../lib/v3';
import {
  buildStudyPool,
  getSRSStats,
  rateCard,
  type Rating,
} from '../../lib/flashcardSRS';

const SESSION_SIZE = 20;

/** Milers amb punt, com a la resta de l'app. */
const mil = (n: number) => n.toLocaleString('ca-ES');

/** Caixa de xifra: el número gros a dalt i què és a sota. */
function Xifra({ valor, label, color }: { valor: string; label: string; color?: string }) {
  return (
    <div style={{
      flex: '1 1 120px', background: V.surface, border: `1px solid ${V.hair}`,
      borderRadius: 18, padding: '15px 16px', boxShadow: V.shadow,
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.9, color: color ?? V.ink }}>{valor}</div>
      <Mono size={9} color={V.faint} style={{ display: 'block', marginTop: 5, letterSpacing: 1.3 }}>{label}</Mono>
    </div>
  );
}

function BotoGros({ children, onClick, to, disabled, principal, accent }: {
  children: React.ReactNode; onClick?: () => void; to?: string;
  disabled?: boolean; principal?: boolean; accent: string;
}) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick ?? (to ? () => nav(to) : undefined)}
      style={{
        flex: '1 1 200px', cursor: disabled ? 'not-allowed' : 'pointer',
        border: principal ? 'none' : `1px solid ${V.border}`, borderRadius: 18,
        padding: '15px 20px', fontSize: 15, fontWeight: 800, letterSpacing: -0.3,
        background: principal ? accent : V.surface,
        color: principal ? '#fff' : V.ink,
        opacity: disabled ? 0.5 : 1,
      }}>
      {children}
    </button>
  );
}

export default function Flashcards() {
  const location = useLocation();
  const nav = useNavigate();
  const isMossosRoute = location.pathname.startsWith('/mossos');
  const corps: 'pl' | 'mossos' = isMossosRoute ? 'mossos' : 'pl';
  const meta = metaCos(corps);
  const corpsRoot = isMossosRoute ? '/mossos' : '/policia-local';

  // Tots els card IDs del cos (mescla de tots els temes).
  const allCards = useMemo(() => {
    const out: Array<{ id: string; topicSlug: string }> = [];
    for (const tp of TOPICS) {
      const isMossos = tp.category === 'mossos';
      if (corps === 'mossos' && !isMossos) continue;
      if (corps === 'pl' && isMossos) continue;
      for (const q of tp.questions) {
        out.push({ id: q.id, topicSlug: tp.slug });
      }
    }
    return out;
  }, [corps]);

  const [stats, setStats] = useState(() => getSRSStats(corps, allCards));
  const [phase, setPhase] = useState<'intro' | 'study' | 'done'>('intro');
  const [pool, setPool] = useState<string[]>([]);
  // Cartes que cal repetir aquesta sessió (per Again).
  const [requeue, setRequeue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seenCount, setSeenCount] = useState(0);

  // Re-llegim stats quan tornem al menú o canvia el corps.
  useEffect(() => {
    setStats(getSRSStats(corps, allCards));
  }, [corps, allCards]);

  // Indexació ràpida de questions per ID.
  const questionById = useMemo(() => {
    const map = new Map<string, { topicSlug: string; question: typeof TOPICS[number]['questions'][number] }>();
    for (const tp of TOPICS) {
      for (const q of tp.questions) {
        map.set(q.id, { topicSlug: tp.slug, question: q });
      }
    }
    return map;
  }, []);

  function startSession() {
    const built = buildStudyPool(corps, allCards, SESSION_SIZE);
    if (built.cardIds.length === 0) {
      setPhase('done');
      return;
    }
    setPool(built.cardIds);
    setRequeue([]);
    setIndex(0);
    setRevealed(false);
    setSeenCount(0);
    setPhase('study');
  }

  function endSession() {
    setStats(getSRSStats(corps, allCards));
    setPhase('done');
  }

  function onRate(rating: Rating) {
    const cardId = pool[index];
    const ref = questionById.get(cardId);
    if (!ref) return;
    rateCard(corps, cardId, ref.topicSlug, rating);

    // Si "again" → afegim al requeue per repetir-la a la mateixa sessió.
    let newRequeue = requeue;
    if (rating === 'again') {
      newRequeue = [...requeue, cardId];
      setRequeue(newRequeue);
    }

    setSeenCount((n) => n + 1);

    // Avancem.
    const nextIdx = index + 1;
    if (nextIdx < pool.length) {
      setIndex(nextIdx);
      setRevealed(false);
    } else if (newRequeue.length > 0) {
      // Acabem la primera passada — comencem amb les "again".
      setPool(newRequeue);
      setRequeue([]);
      setIndex(0);
      setRevealed(false);
    } else {
      endSession();
    }
  }

  // Atajos teclat: espai/enter = flip; 1/2/3 = again/good/easy.
  useEffect(() => {
    if (phase !== 'study') return;
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) setRevealed(true);
      }
      if (revealed) {
        if (e.key === '1') onRate('again');
        if (e.key === '2') onRate('good');
        if (e.key === '3') onRate('easy');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, revealed, index, pool]);

  // ─── Portada ─────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="v3-page v3-anim">
        <Mono size={10} color={meta.accentInk} style={{ letterSpacing: 1.8 }}>
          {meta.kicker} · REPÀS ESPAIAT
        </Mono>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
          Flashcards
        </h1>
        <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 22px', maxWidth: 560 }}>
          Totes les preguntes del temari de {meta.nom}, barrejades. Cada carta torna a sortir
          a l&apos;1, 3, 7, 14, 30… dies segons com la valoris.
        </p>

        <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap', marginBottom: 20 }}>
          <Xifra valor={mil(stats.total)} label="CARTES" />
          <Xifra valor={mil(stats.due)} label="TOCA REPASSAR" color={stats.due > 0 ? V.terraInk : undefined} />
          <Xifra valor={mil(stats.newCards)} label="NOVES" />
          <Xifra valor={mil(stats.mastered)} label="DOMINADES" />
        </div>

        <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
          <BotoGros principal accent={meta.accent} onClick={startSession} disabled={stats.total === 0}>
            Començar sessió · {Math.min(SESSION_SIZE, stats.due + stats.newCards)} cartes
          </BotoGros>
          <BotoGros accent={meta.accent} to={corpsRoot}>Tornar a {meta.label}</BotoGros>
        </div>
      </div>
    );
  }

  // ─── Final de sessió ─────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div className="v3-page v3-anim">
        <Mono size={10} color={V.ok} style={{ letterSpacing: 1.8 }}>SESSIÓ ACABADA</Mono>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
          {seenCount > 0 ? `Has revisat ${seenCount} cartes` : 'Ara mateix no queden cartes'}
        </h1>
        <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 22px', maxWidth: 560 }}>
          {stats.due > 0
            ? `Encara en tens ${stats.due} per repassar.`
            : 'Torna demà: et tocaran les que avui has marcat com a bona o fàcil.'}
        </p>

        <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
          <BotoGros principal accent={meta.accent} onClick={startSession}>Una altra sessió</BotoGros>
          <BotoGros accent={meta.accent} to={corpsRoot}>Tornar a {meta.label}</BotoGros>
        </div>
      </div>
    );
  }

  // ─── Sessió ──────────────────────────────────────────────────────
  const cardId = pool[index];
  const ref = questionById.get(cardId);
  if (!ref) {
    // Pregunta inexistent (se l'ha esborrat del codi). Saltem.
    return (
      <div className="v3-page v3-anim">
        <p style={{ fontSize: 15, color: V.muted }}>Pregunta no trobada. Reinicia la sessió.</p>
        <div style={{ display: 'flex', gap: 11, marginTop: 14 }}>
          <BotoGros principal accent={meta.accent} onClick={startSession}>Reiniciar</BotoGros>
        </div>
      </div>
    );
  }

  const shuffled: ShuffledQuestion = shuffleQuestion(ref.question);
  const topic = TOPICS.find((tp) => tp.slug === ref.topicSlug);

  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 780, margin: '0 auto', width: '100%' }}>
      {/* Progrés de la sessió */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 9 }}>
        <Mono size={11} color={V.muted}>
          {index + 1} / {pool.length}
          {requeue.length > 0 && ` · ${requeue.length} PER REPETIR`}
        </Mono>
        <button
          type="button"
          onClick={endSession}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer', color: V.muted,
            fontSize: 12, fontWeight: 700, padding: 0,
          }}>
          Acabar sessió
        </button>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: V.surface2, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{
          height: '100%', width: `${((index + 1) / pool.length) * 100}%`,
          background: meta.accent, transition: 'width .3s ease',
        }} />
      </div>

      {topic && (
        <Mono size={10} color={V.faint} style={{ display: 'block', marginBottom: 9, letterSpacing: 1.2 }}>
          {topic.title.toUpperCase()}
        </Mono>
      )}

      {/* La carta. Es gira tocant-la. */}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: `1px solid ${V.hair}`,
          borderRadius: 28, padding: 'clamp(20px,3vw,30px)', background: V.surface, color: V.ink,
          boxShadow: V.shadowLg, minHeight: 220,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
        <Mono size={9.5} color={meta.accentInk} style={{ letterSpacing: 1.6 }}>PREGUNTA</Mono>
        <p style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.4, letterSpacing: -0.4 }}>
          {shuffled.question.text}
        </p>

        {!revealed ? (
          <Mono size={10} color={V.faint} style={{ marginTop: 'auto', letterSpacing: 1.2 }}>
            TOCA LA CARTA PER VEURE LA RESPOSTA
          </Mono>
        ) : (
          <div style={{ borderTop: `1px solid ${V.hair}`, paddingTop: 16, marginTop: 4 }}>
            <Mono size={9.5} color={V.ok} style={{ letterSpacing: 1.6 }}>RESPOSTA</Mono>
            <ul style={{ listStyle: 'none', margin: '11px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {shuffled.options.map((opt, i) => {
                const bo = i === shuffled.correctIndex;
                return (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px',
                    borderRadius: 14, fontSize: 14.5, lineHeight: 1.4,
                    background: bo ? V.okSoft : V.paper,
                    color: bo ? V.ink : V.muted,
                    fontWeight: bo ? 700 : 500,
                    border: `1px solid ${bo ? V.ok : 'transparent'}`,
                  }}>
                    <span style={{ width: 16, flexShrink: 0, color: V.ok, fontWeight: 800 }}>{bo ? '✓' : ''}</span>
                    <span style={{ minWidth: 0 }}>{opt}</span>
                  </li>
                );
              })}
            </ul>
            {shuffled.question.reference && (
              <Mono size={10} color={V.faint} style={{ display: 'block', marginTop: 12, letterSpacing: 0.8 }}>
                {shuffled.question.reference}
              </Mono>
            )}
          </div>
        )}
      </button>

      {/* Controls */}
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          style={{
            marginTop: 14, width: '100%', cursor: 'pointer', border: 'none', borderRadius: 18,
            padding: '15px 20px', background: meta.accent, color: '#fff',
            fontSize: 15, fontWeight: 800, letterSpacing: -0.3,
          }}>
          Veure resposta
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          {([
            { r: 'again' as Rating, tecla: '1', lbl: 'Encara no', color: V.terraInk, fons: V.terraSoft },
            { r: 'good' as Rating, tecla: '2', lbl: 'Bona', color: V.ok, fons: V.okSoft },
            { r: 'easy' as Rating, tecla: '3', lbl: 'Fàcil', color: V.blue, fons: V.blueSoft },
          ]).map((b) => (
            <button
              key={b.r}
              type="button"
              onClick={() => onRate(b.r)}
              style={{
                flex: '1 1 130px', cursor: 'pointer', border: `1px solid ${b.color}33`,
                borderRadius: 18, padding: '13px 14px', background: b.fons, color: b.color,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
              <Mono size={9} color={b.color} style={{ opacity: 0.7 }}>{b.tecla}</Mono>
              <span style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.3 }}>{b.lbl}</span>
              <Mono size={9.5} color={b.color} style={{ opacity: 0.75 }}>
                {etiquetaInterval(b.r, cardId, corps).toUpperCase()}
              </Mono>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => nav(corpsRoot)}
        style={{
          margin: '18px auto 0', display: 'block', border: 'none', background: 'transparent',
          cursor: 'pointer', color: V.faint, fontSize: 12, fontWeight: 700,
        }}>
        <I n="back" size={12} sw={2.4} /> Sortir a {meta.label}
      </button>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────
function etiquetaInterval(rating: Rating, cardId: string, corps: 'pl' | 'mossos'): string {
  // Calcula etiqueta humana del proper interval.
  const INTERVALS = [1, 3, 7, 14, 30, 60, 120, 240];
  const state = (() => {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`infopol-fc-srs-${corps}`);
      if (!raw) return null;
      const all = JSON.parse(raw) as Record<string, { streak: number }>;
      return all[cardId] ?? null;
    } catch { return null; }
  })();
  const baseStreak = state?.streak ?? 0;
  let nextStreak: number;
  if (rating === 'again') return 'avui';
  if (rating === 'good') nextStreak = baseStreak + 1;
  else nextStreak = baseStreak + 2;
  const idx = Math.min(nextStreak - 1, INTERVALS.length - 1);
  const days = INTERVALS[Math.max(0, idx)];
  if (days === 1) return '1 dia';
  if (days < 30) return `${days} dies`;
  if (days < 365) return `${Math.round(days / 30)} mes${days >= 60 ? 'os' : ''}`;
  return `${Math.round(days / 30)} mes`;
}
