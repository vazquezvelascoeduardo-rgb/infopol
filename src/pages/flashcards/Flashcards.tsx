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
import { Link, useLocation } from 'react-router-dom';
import { TOPICS } from '../../data/tests';
import { shuffleQuestion, type ShuffledQuestion } from '../../lib/testRunner';
import { useT } from '../../lib/i18n';
import {
  buildStudyPool,
  getSRSStats,
  rateCard,
  type Rating,
} from '../../lib/flashcardSRS';

const SESSION_SIZE = 20;

export default function Flashcards() {
  const location = useLocation();
  const isMossosRoute = location.pathname.startsWith('/mossos');
  const corps: 'pl' | 'mossos' = isMossosRoute ? 'mossos' : 'pl';
  const corpsRoot = isMossosRoute ? '/mossos' : '/policia-local';
  const corpsLabel = isMossosRoute ? "Mossos d'Esquadra" : 'Policia Local';
  const { t } = useT();

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

  // ─── Render ──────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <FlashcardsIntro
        corpsRoot={corpsRoot}
        corpsLabel={corpsLabel}
        stats={stats}
        onStart={startSession}
        t={t}
      />
    );
  }

  if (phase === 'done') {
    return (
      <FlashcardsDone
        corpsRoot={corpsRoot}
        corpsLabel={corpsLabel}
        stats={stats}
        seenCount={seenCount}
        onAgain={startSession}
        t={t}
      />
    );
  }

  const cardId = pool[index];
  const ref = questionById.get(cardId);
  if (!ref) {
    // Pregunta inexistent (se l'ha esborrat del codi). Saltem.
    return (
      <div className="shell py-10">
        <p className="text-text-2">Pregunta no trobada. Reinicia la sessió.</p>
        <button className="fc-btn primary mt-3" onClick={startSession}>Reiniciar</button>
      </div>
    );
  }

  const shuffled: ShuffledQuestion = shuffleQuestion(ref.question);
  const topic = TOPICS.find((tp) => tp.slug === ref.topicSlug);

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to={corpsRoot}>{corpsLabel}</Link>
        <span className="sep">/</span>
        <span className="here">Flashcards</span>
      </nav>

      {/* Progrés */}
      <div className="flex items-center justify-between mt-4 mb-3 text-sm font-bold text-text-2">
        <span>
          {index + 1} <span className="text-text-3">/ {pool.length}</span>
          {requeue.length > 0 && (
            <span className="text-text-3"> · {requeue.length} per repetir</span>
          )}
        </span>
        <button
          type="button"
          onClick={endSession}
          className="text-xs font-semibold uppercase tracking-wide text-ink underline underline-offset-4"
        >
          Acabar sessió
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-line mb-5 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{
            width: `${((index + 1) / pool.length) * 100}%`,
            background: 'var(--ink)',
          }}
        />
      </div>

      {/* Tag del tema (per donar context, però no és el "filtre") */}
      {topic && (
        <div className="mb-2 text-xs font-mono text-text-3">
          {topic.icon} {topic.title}
        </div>
      )}

      {/* La carta */}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="fc-card"
        style={{
          ['--accent' as never]: 'var(--ink)',
          ['--accent-bg' as never]: 'var(--paper-2)',
        } as React.CSSProperties}
      >
        <div className="fc-side fc-question">
          <span className="fc-tag">PREGUNTA</span>
          <p className="fc-text">{shuffled.question.text}</p>
          {!revealed && (
            <span className="fc-hint">Toca la carta per veure la resposta</span>
          )}
        </div>

        {revealed && (
          <div className="fc-side fc-answer">
            <span className="fc-tag good">RESPOSTA</span>
            <ul className="fc-options">
              {shuffled.options.map((opt, i) => {
                const isCorrect = i === shuffled.correctIndex;
                return (
                  <li key={i} className={isCorrect ? 'opt correct' : 'opt'}>
                    <span className="opt-letter">{isCorrect ? '✓' : ''}</span>
                    <span className="opt-text">{opt}</span>
                  </li>
                );
              })}
            </ul>
            {shuffled.question.reference && (
              <p className="fc-ref">📖 {shuffled.question.reference}</p>
            )}
          </div>
        )}
      </button>

      {/* Controls */}
      {!revealed ? (
        <div className="fc-controls fc-controls-1">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="fc-btn primary"
          >
            Veure resposta
          </button>
        </div>
      ) : (
        <div className="fc-rate">
          <button
            type="button"
            onClick={() => onRate('again')}
            className="fc-rate-btn again"
          >
            <span className="key">1</span>
            <span className="lbl">Encara no</span>
            <span className="when">avui</span>
          </button>
          <button
            type="button"
            onClick={() => onRate('good')}
            className="fc-rate-btn good"
          >
            <span className="key">2</span>
            <span className="lbl">Bona</span>
            <span className="when">{nextIntervalLabel('good', cardId, corps)}</span>
          </button>
          <button
            type="button"
            onClick={() => onRate('easy')}
            className="fc-rate-btn easy"
          >
            <span className="key">3</span>
            <span className="lbl">Fàcil</span>
            <span className="when">{nextIntervalLabel('easy', cardId, corps)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Intro ──────────────────────────────────────────────────────────
function FlashcardsIntro({
  corpsRoot, corpsLabel, stats, onStart, t,
}: {
  corpsRoot: string;
  corpsLabel: string;
  stats: ReturnType<typeof getSRSStats>;
  onStart: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to={corpsRoot}>{corpsLabel}</Link>
        <span className="sep">/</span>
        <span className="here">Flashcards</span>
      </nav>

      <header className="ts-hero">
        <div className="eyebrow">🃏 Flashcards · estil Anki</div>
        <h1>
          Memoritza amb la<br />
          <em>corba de l'oblit</em>
        </h1>
        <p className="lead">
          Totes les preguntes del temari de {corpsLabel} barrejades.
          La carta torna a aparèixer als 1, 3, 7, 14, 30… dies segons com
          la valoris. El teu progrés es guarda al navegador.
        </p>
      </header>

      <section className="my-stats">
        <div className="my-stat done">
          <span className="lab">📚 Total</span>
          <div className="num">{stats.total.toLocaleString('ca-ES')}</div>
        </div>
        <div className="my-stat acc">
          <span className="lab">⏰ Toca repassar</span>
          <div className="num" style={{ color: stats.due > 0 ? '#C13030' : 'var(--ink)' }}>
            {stats.due}
          </div>
        </div>
        <div className="my-stat streak">
          <span className="lab">✨ Noves</span>
          <div className="num">{stats.newCards}</div>
        </div>
        <div className="my-stat lvl">
          <span className="lab">🏆 Dominades</span>
          <div className="num">{stats.mastered}</div>
        </div>
      </section>

      <div className="mt-5">
        <button
          type="button"
          onClick={onStart}
          className="fc-btn primary"
          style={{ width: '100%', padding: '16px 20px', fontSize: 16 }}
          disabled={stats.total === 0}
        >
          ▶ Començar sessió ({Math.min(SESSION_SIZE, stats.due + stats.newCards)} cartes)
        </button>
      </div>

      <div className="mt-3 text-center">
        <Link
          to={corpsRoot}
          className="text-xs font-semibold uppercase tracking-wide text-text-3 hover:text-ink"
        >
          ← Tornar a {corpsLabel}
        </Link>
      </div>
    </div>
  );
}

// ─── Done ──────────────────────────────────────────────────────────
function FlashcardsDone({
  corpsRoot, corpsLabel, stats, seenCount, onAgain, t,
}: {
  corpsRoot: string;
  corpsLabel: string;
  stats: ReturnType<typeof getSRSStats>;
  seenCount: number;
  onAgain: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to={corpsRoot}>{corpsLabel}</Link>
        <span className="sep">/</span>
        <span className="here">Flashcards</span>
      </nav>

      <header className="ts-hero">
        <div className="eyebrow">✅ Sessió completada</div>
        <h1>
          {seenCount > 0 ? (
            <>Has revisat <em>{seenCount}</em> cartes</>
          ) : (
            <>No queden cartes per estudiar ara mateix</>
          )}
        </h1>
        <p className="lead">
          {stats.due > 0
            ? `Encara tens ${stats.due} cartes per repassar.`
            : 'Tornes demà i et tocaran les que avui has marcat com a "bona/fàcil".'}
        </p>
      </header>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" onClick={onAgain} className="fc-btn primary" style={{ padding: '14px 18px' }}>
          ▶ Una altra sessió
        </button>
        <Link to={corpsRoot} className="fc-btn" style={{ padding: '14px 18px', textAlign: 'center' }}>
          ← Tornar a {corpsLabel}
        </Link>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────
function nextIntervalLabel(rating: Rating, cardId: string, corps: 'pl' | 'mossos'): string {
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
