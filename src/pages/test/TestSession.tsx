// Sessio de test: gestiona els 3 estats (select → run → result) en una
// sola pagina amb React state. URL parametritzada per :slug; si slug
// es 'tot' fem mescla de tots els temes.
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TOPICS, getAllQuestions, getTopic } from '../../data/tests';
import type { TestQuestion } from '../../data/tests/types';
import {
  getAnsweredIds, markAnswered, resetProgress,
  useTopicProgress,
} from '../../lib/testProgress';
import {
  computeScore, pickQuestions, shuffleQuestion, type ShuffledQuestion,
} from '../../lib/testRunner';
import { useT } from '../../lib/i18n';

type SessionState =
  | { phase: 'select' }
  | { phase: 'run'; questions: ShuffledQuestion[]; index: number; answers: Array<number | null> }
  | { phase: 'result'; questions: ShuffledQuestion[]; answers: Array<number | null> };

const ALL_TOPICS_SLUG = 'tot';

export default function TestSession() {
  const { slug = '' } = useParams();
  const { t } = useT();

  const isAll = slug === ALL_TOPICS_SLUG;
  const topic = isAll ? null : getTopic(slug);

  // Pool de preguntes per a aquest tema (o tots).
  const pool: TestQuestion[] = useMemo(() => {
    if (isAll) return getAllQuestions();
    return topic?.questions ?? [];
  }, [isAll, topic]);

  // Per a 'tot', el progrés és la unió de tots els temes.
  const answeredIds: Set<string> = useMemo(() => {
    if (isAll) {
      const set = new Set<string>();
      for (const tp of TOPICS) {
        for (const id of getAnsweredIds(tp.slug)) set.add(id);
      }
      return set;
    }
    return getAnsweredIds(slug);
  }, [slug, isAll]);

  // Nomes per al hook reactiu (re-render quan canvia localStorage).
  useTopicProgress(slug);

  const [state, setState] = useState<SessionState>({ phase: 'select' });

  if (!isAll && !topic) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">{t('test.notFound')}</p>
        <Link to="/test" className="text-blue-600 dark:text-blue-400 underline">
          {t('test.backToList')}
        </Link>
      </div>
    );
  }

  const title = isAll ? t('test.list.allMixed') : topic!.title;
  const accent = isAll ? 'from-purple-500 to-fuchsia-700' : topic!.accent;
  const remaining = pool.length - answeredIds.size;

  function startTest(count: number) {
    const { questions, exhausted } = pickQuestions(pool, answeredIds, count);
    if (exhausted || questions.length === 0) return;
    const shuffled = questions.map((q) => shuffleQuestion(q));
    setState({
      phase: 'run',
      questions: shuffled,
      index: 0,
      answers: new Array(shuffled.length).fill(null),
    });
  }

  function onResetTopic() {
    if (isAll) {
      for (const tp of TOPICS) resetProgress(tp.slug);
    } else {
      resetProgress(slug);
    }
    setState({ phase: 'select' });
  }

  function answerCurrent(idx: number | null) {
    if (state.phase !== 'run') return;
    const next = [...state.answers];
    next[state.index] = idx;
    setState({ ...state, answers: next });
  }

  function goNext() {
    if (state.phase !== 'run') return;
    if (state.index < state.questions.length - 1) {
      setState({ ...state, index: state.index + 1 });
    } else {
      // Fi del test → marquem com a respostes les que no son blanc
      // (correctes o falladas, totes les vistes amb resposta).
      finishTest();
    }
  }

  function goBack() {
    if (state.phase !== 'run') return;
    if (state.index > 0) setState({ ...state, index: state.index - 1 });
  }

  function finishTest() {
    if (state.phase !== 'run') return;
    // Marquem com a respostes les preguntes que el usuari ha contestat
    // (saltades segueixen "no respostes" per que tornin a aparèixer).
    const answeredQuestionIds: string[] = [];
    for (let i = 0; i < state.questions.length; i++) {
      if (state.answers[i] !== null && state.answers[i] !== undefined) {
        answeredQuestionIds.push(state.questions[i].question.id);
      }
    }
    if (isAll) {
      // Per 'tot', distribuim cada ID al tema d'origen mitjançant
      // l'etiqueta topicSlug que getAllQuestions afegeix.
      const grouped: Record<string, string[]> = {};
      for (let i = 0; i < state.questions.length; i++) {
        if (state.answers[i] !== null && state.answers[i] !== undefined) {
          const q = state.questions[i].question as TestQuestion & { topicSlug?: string };
          const ts = q.topicSlug || '';
          if (!grouped[ts]) grouped[ts] = [];
          grouped[ts].push(q.id);
        }
      }
      for (const [tsSlug, ids] of Object.entries(grouped)) {
        if (tsSlug) markAnswered(tsSlug, ids);
      }
    } else {
      markAnswered(slug, answeredQuestionIds);
    }
    setState({
      phase: 'result',
      questions: state.questions,
      answers: state.answers,
    });
  }

  // ── RENDER per fase ─────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link to="/test" className="hover:underline">{t('test.list.title')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 truncate">{title}</span>
      </nav>

      {state.phase === 'select' && (
        <SelectPhase
          title={title}
          accent={accent}
          total={pool.length}
          remaining={remaining}
          onStart={startTest}
          onReset={onResetTopic}
        />
      )}

      {state.phase === 'run' && (
        <RunPhase
          state={state}
          accent={accent}
          onAnswer={answerCurrent}
          onNext={goNext}
          onBack={goBack}
          onFinish={finishTest}
        />
      )}

      {state.phase === 'result' && (
        <ResultPhase
          state={state}
          slug={slug}
          isAll={isAll}
          onRestart={() => setState({ phase: 'select' })}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// FASE 1 — SELECT
// ════════════════════════════════════════════════════════════════════

function SelectPhase({
  title, accent, total, remaining, onStart, onReset,
}: {
  title: string; accent: string;
  total: number; remaining: number;
  onStart: (count: number) => void;
  onReset: () => void;
}) {
  const { t } = useT();
  const choices = [10, 25, 50].filter((n) => n <= remaining);
  if (remaining > 0 && !choices.includes(remaining)) choices.push(remaining);
  const exhausted = remaining === 0;

  return (
    <>
      <header className={`rounded-2xl border p-5 sm:p-6 mb-5 bg-gradient-to-br from-white to-slate-50/40
        dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] border-slate-200/70 dark:border-white/10`}>
        <div className="flex items-start gap-4">
          <span aria-hidden className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-3xl text-white shadow-inner`}>
            📝
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('test.session.poolStatus')
                .replace('{remaining}', String(remaining))
                .replace('{total}', String(total))}
            </p>
          </div>
        </div>
      </header>

      {exhausted ? (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 dark:bg-amber-400/5 p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>🎓</div>
          <h2 className="font-bold text-lg mb-1 text-amber-800 dark:text-amber-300">
            {t('test.session.exhaustedTitle')}
          </h2>
          <p className="text-sm text-amber-700 dark:text-amber-200/80 mb-4">
            {t('test.session.exhaustedDesc')}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 shadow-md"
          >
            🔄 {t('test.session.reset')}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border p-5 border-slate-200/80 bg-white dark:bg-[#0f1d34] dark:border-white/10">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-3">
            {t('test.session.howMany')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {choices.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onStart(n)}
                className={`rounded-xl border-2 px-4 py-3 text-base font-bold transition
                  border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700
                  dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-blue-400/10`}
              >
                {n === remaining && n > 50 ? `${n} (${t('test.session.allRemaining')})` : n}
              </button>
            ))}
          </div>
          {total > remaining && (
            <button
              type="button"
              onClick={onReset}
              className="mt-4 text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              🔄 {t('test.session.resetProgress')}
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// FASE 2 — RUN
// ════════════════════════════════════════════════════════════════════

function RunPhase({
  state, accent, onAnswer, onNext, onBack, onFinish,
}: {
  state: Extract<SessionState, { phase: 'run' }>;
  accent: string;
  onAnswer: (idx: number | null) => void;
  onNext: () => void; onBack: () => void; onFinish: () => void;
}) {
  const { t } = useT();
  const total = state.questions.length;
  const cur = state.questions[state.index];
  const selected = state.answers[state.index];
  const isLast = state.index === total - 1;
  const progress = ((state.index + 1) / total) * 100;
  const answeredCount = state.answers.filter((a) => a !== null).length;
  const blanks = total - answeredCount;

  function requestFinish() {
    if (blanks === 0) {
      onFinish();
      return;
    }
    const msg = t('test.session.confirmFinish').replace('{n}', String(blanks));
    if (window.confirm(msg)) onFinish();
  }

  return (
    <>
      {/* Barra de progrés + boto acabar */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
          <span className="font-mono text-slate-500 dark:text-slate-400">
            {t('test.session.questionN')
              .replace('{n}', String(state.index + 1))
              .replace('{total}', String(total))}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {answeredCount} / {total} {t('test.session.answered')}
            </span>
            <button
              type="button"
              onClick={requestFinish}
              title={t('test.session.finishNow')}
              className="rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition
                border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100
                dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20"
            >
              ✓ {t('test.session.finishNow')}
            </button>
          </div>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${accent} transition-all duration-300`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Pregunta */}
      <div className="rounded-2xl border-2 p-5 sm:p-6 mb-4
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="text-base sm:text-lg font-semibold leading-snug mb-4">
          {cur.question.text}
        </div>
        <div className="space-y-2">
          {cur.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onAnswer(isSelected ? null : i)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition flex items-start gap-3
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-400/15 dark:text-blue-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10'}`}
              >
                <span className={`shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 font-bold text-xs
                  ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 text-slate-500 dark:border-white/20 dark:text-slate-400'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm sm:text-base leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={state.index === 0}
          className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition
            border-slate-200 bg-white text-slate-700 hover:bg-slate-50
            dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← {t('test.session.previous')}
        </button>
        <button
          type="button"
          onClick={() => onAnswer(null)}
          className="rounded-xl border px-4 py-2.5 text-sm font-medium transition
            border-slate-200 bg-white text-slate-500 hover:bg-slate-50
            dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
        >
          {t('test.session.skip')}
        </button>
        <div className="flex-1" />
        {isLast ? (
          <button
            type="button"
            onClick={requestFinish}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 shadow-md"
          >
            {t('test.session.finish')} ✓
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 shadow-md"
          >
            {t('test.session.next')} →
          </button>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// FASE 3 — RESULT
// ════════════════════════════════════════════════════════════════════

function ResultPhase({
  state, slug, isAll, onRestart,
}: {
  state: Extract<SessionState, { phase: 'result' }>;
  slug: string;
  isAll: boolean;
  onRestart: () => void;
}) {
  const { t } = useT();
  const score = computeScore(state.questions, state.answers);

  const gradeColor =
    score.grade >= 7 ? 'text-emerald-600 dark:text-emerald-400'
    : score.grade >= 5 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <>
      <div className="rounded-2xl border p-6 mb-5 text-center
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="text-xs uppercase tracking-[0.25em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
          {t('test.result.grade')}
        </div>
        <div className={`text-6xl sm:text-7xl font-black tracking-tight ${gradeColor}`}>
          {score.grade.toFixed(2)}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('test.result.outOf10')}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-400/10 p-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{score.correct}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700/70 dark:text-emerald-300/70">{t('test.result.correct')}</div>
          </div>
          <div className="rounded-lg bg-red-50 dark:bg-red-400/10 p-3">
            <div className="text-2xl font-black text-red-600 dark:text-red-400">{score.wrong}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-red-700/70 dark:text-red-300/70">{t('test.result.wrong')}</div>
          </div>
          <div className="rounded-lg bg-slate-100 dark:bg-white/5 p-3">
            <div className="text-2xl font-black text-slate-600 dark:text-slate-300">{score.blank}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-600/70 dark:text-slate-400/70">{t('test.result.blank')}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          {t('test.result.formula').replace('{raw}', score.raw.toFixed(2))}
        </div>
      </div>

      {/* Llistat de correcció */}
      <div className="space-y-2 mb-5">
        {state.questions.map((q, i) => {
          const ans = state.answers[i];
          const isCorrect = ans === q.correctIndex;
          const isBlank = ans === null;
          const cls = isBlank
            ? 'border-l-slate-400 bg-slate-50 dark:bg-white/5'
            : isCorrect
              ? 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-400/10'
              : 'border-l-red-500 bg-red-50 dark:bg-red-400/10';
          return (
            <div key={q.question.id}
              className={`rounded-xl border-l-4 p-3 text-sm border border-slate-200/60 dark:border-white/10 ${cls}`}>
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-base" aria-hidden>
                  {isBlank ? '⚪' : isCorrect ? '✅' : '❌'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug mb-1">
                    {i + 1}. {q.question.text}
                  </div>
                  {!isCorrect && !isBlank && (
                    <div className="text-xs text-red-700 dark:text-red-300/90">
                      {t('test.result.yourAnswer')}: <span className="font-mono">{String.fromCharCode(65 + (ans ?? 0))}</span> · {q.options[ans ?? 0]}
                    </div>
                  )}
                  <div className="text-xs text-emerald-700 dark:text-emerald-300/90">
                    {t('test.result.correctAnswer')}: <span className="font-mono">{String.fromCharCode(65 + q.correctIndex)}</span> · {q.options[q.correctIndex]}
                  </div>
                  {q.question.reference && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      📖 {q.question.reference}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 shadow-md"
        >
          🔁 {t('test.result.another')}
        </button>
        <Link
          to="/test"
          className="rounded-xl border px-4 py-2.5 text-sm font-semibold
            border-slate-200 bg-white text-slate-700 hover:bg-slate-50
            dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          {t('test.result.backToList')}
        </Link>
        {/* Slug i isAll només per silenciar warnings de unused */}
        <span className="hidden">{slug}{isAll ? 'all' : ''}</span>
      </div>
    </>
  );
}
