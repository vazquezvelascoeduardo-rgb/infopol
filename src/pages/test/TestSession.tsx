// Sessio de test: gestiona els 3 estats (select → run → result) en una
// sola pagina amb React state. URL parametritzada per :slug; si slug
// es 'tot' fem mescla de tots els temes.
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { TOPICS, getAllQuestions, getAllMossosQuestions, getAllCulturaQuestions, getTopic } from '../../data/tests';
import type { TestQuestion } from '../../data/tests/types';
import {
  getAnsweredIds, markAnswered, resetProgress,
  useTopicProgress,
} from '../../lib/testProgress';
import {
  computeScore, pickQuestions, shuffleQuestion, type ShuffledQuestion,
} from '../../lib/testRunner';
import {
  recordTestResult, getGlobalStats, getTopicStats,
  type TopicStats,
} from '../../lib/testStats';
import { recordFailure, recordSuccess, buildRepasPool, useAllFailures, removeFailure, resetAllFailures, LEARNED_THRESHOLD, type FailureRecord } from '../../lib/failures';
import { checkAchievements, type Achievement } from '../../lib/achievements';
import { useT } from '../../lib/i18n';

type Mode = 'exam' | 'study'; // exam = simulacre, study = interactiu

type SessionState =
  | { phase: 'select' }
  | {
      phase: 'run';
      mode: Mode;
      questions: ShuffledQuestion[];
      index: number;
      answers: Array<number | null>;
      /** Indexs de preguntes ja revelades (mode 'study'). */
      revealedIdx: Set<number>;
      /** Timestamp en ms quan s'ha iniciat el test. */
      startedAt: number;
    }
  | {
      phase: 'result';
      mode: Mode;
      questions: ShuffledQuestion[];
      answers: Array<number | null>;
      /** Segons que ha durat el test. */
      durationSec: number;
      /** Stats del tema ABANS d'aquest test (per comparativa). */
      prevStats: TopicStats | null;
      /** Logros nous desbloquejats en aquest test. */
      newAchievements: Achievement[];
    };

const ALL_TOPICS_SLUG = 'tot';
const REPAS_SLUG = 'repas';

export default function TestSession() {
  const { slug = '' } = useParams();
  const { t } = useT();
  const location = useLocation();

  const isAll = slug === ALL_TOPICS_SLUG;
  const isRepas = slug === REPAS_SLUG;
  const topic = (isAll || isRepas) ? null : getTopic(slug);

  // Detecta el cos d'origen (/mossos, /policia-local o /cultura-general)
  // per generar correctament les molles de pa, els enllaços "tornar al
  // llistat" i el pool de preguntes en mode 'tot'.
  const isMossosRoute = location.pathname.startsWith('/mossos');
  const isCulturaRoute = location.pathname.startsWith('/cultura-general');
  const corpsRoot = isMossosRoute
    ? '/mossos'
    : isCulturaRoute
      ? '/cultura-general'
      : '/policia-local';
  const corpsLabel = isMossosRoute
    ? t('mossos.title')
    : isCulturaRoute
      ? t('cultura.title')
      : t('test.list.title');

  // Pool de preguntes per a aquest tema (o tots, o repàs).
  // El pool de 'tot' depèn del cos d'origen: a /mossos només Mossos, a
  // /cultura-general només Cultura, a /policia-local només Policia Local.
  const pool: TestQuestion[] = useMemo(() => {
    if (isRepas) return buildRepasPool({ onlyDue: true, max: 50 });
    if (isAll) {
      if (isMossosRoute) return getAllMossosQuestions();
      if (isCulturaRoute) return getAllCulturaQuestions();
      return getAllQuestions();
    }
    return topic?.questions ?? [];
  }, [isAll, isRepas, isMossosRoute, isCulturaRoute, topic]);

  // Per a 'tot', el progrés és la unió dels temes del cos corresponent.
  // Per a 'repas', no usem progrés (les preguntes es repeteixen segons SRS).
  const answeredIds: Set<string> = useMemo(() => {
    if (isRepas) return new Set<string>();
    if (isAll) {
      const set = new Set<string>();
      for (const tp of TOPICS) {
        const cat = tp.category ?? 'temari';
        if (isMossosRoute && cat !== 'mossos') continue;
        if (isCulturaRoute && cat !== 'cultura') continue;
        if (!isMossosRoute && !isCulturaRoute && cat === 'mossos') continue;
        for (const id of getAnsweredIds(tp.slug)) set.add(id);
      }
      return set;
    }
    return getAnsweredIds(slug);
  }, [slug, isAll, isRepas, isMossosRoute, isCulturaRoute]);

  // Nomes per al hook reactiu (re-render quan canvia localStorage).
  useTopicProgress(slug);

  const [state, setState] = useState<SessionState>({ phase: 'select' });

  if (!isAll && !isRepas && !topic) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">{t('test.notFound')}</p>
        <Link to={corpsRoot} className="text-blue-600 dark:text-blue-400 underline">
          {t('test.backToList')}
        </Link>
      </div>
    );
  }

  const title = isRepas
    ? t('test.repas.title')
    : isAll
      ? t('test.list.allMixed')
      : topic!.title;
  const accent = isRepas
    ? 'from-rose-500 to-orange-600'
    : isAll
      ? 'from-purple-500 to-fuchsia-700'
      : topic!.accent;
  const remaining = isRepas ? pool.length : pool.length - answeredIds.size;

  function startTest(count: number, mode: Mode) {
    const { questions, exhausted } = pickQuestions(pool, answeredIds, count);
    if (exhausted || questions.length === 0) return;
    const shuffled = questions.map((q) => shuffleQuestion(q));
    setState({
      phase: 'run',
      mode,
      questions: shuffled,
      index: 0,
      answers: new Array(shuffled.length).fill(null),
      revealedIdx: new Set(),
      startedAt: Date.now(),
    });
  }

  /**
   * Inicia una sessió de repàs. Si `includeNotDue=true` agafa també
   * les preguntes que encara no estan due (forçar repàs total).
   * Sempre en mode 'study' (estudi amb feedback immediat).
   */
  function startRepas(includeNotDue: boolean) {
    const newPool = buildRepasPool({ onlyDue: !includeNotDue, max: 50 });
    if (newPool.length === 0) return;
    const shuffled = newPool.map((q) => shuffleQuestion(q));
    setState({
      phase: 'run',
      mode: 'study',
      questions: shuffled,
      index: 0,
      answers: new Array(shuffled.length).fill(null),
      revealedIdx: new Set(),
      startedAt: Date.now(),
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

    // Mode interactiu: una vegada revelada, no es pot canviar.
    if (state.mode === 'study' && state.revealedIdx.has(state.index)) return;

    // 'En blanc' (idx null): nomes esborra, no avanca.
    if (idx === null) {
      const next = [...state.answers];
      next[state.index] = null;
      setState({ ...state, answers: next });
      return;
    }

    // Si re-clic a la mateixa opcio, en mode simulacre desmarca.
    if (state.answers[state.index] === idx && state.mode === 'exam') {
      const next = [...state.answers];
      next[state.index] = null;
      setState({ ...state, answers: next });
      return;
    }

    // Nova resposta: marca-la i (en study) revela-la.
    const next = [...state.answers];
    next[state.index] = idx;
    let nextRevealed = state.revealedIdx;
    if (state.mode === 'study') {
      nextRevealed = new Set(state.revealedIdx);
      nextRevealed.add(state.index);
    }
    setState({ ...state, answers: next, revealedIdx: nextRevealed });

    // Auto-avanca nomes en mode simulacre. En interactiu deixem que
    // l'usuari llegeixi la correccio i premi 'Seguent' quan vulgui
    // (aixi s'interioritza la resposta correcta).
    const isLast = state.index >= state.questions.length - 1;
    if (!isLast && state.mode === 'exam') {
      setTimeout(() => {
        setState((curr) => {
          if (curr.phase !== 'run') return curr;
          if (curr.index >= curr.questions.length - 1) return curr;
          return { ...curr, index: curr.index + 1 };
        });
      }, 450);
    }
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

    // ── 1) Actualitzem el SRS de cada pregunta resposta ──
    // - Si correcta → recordSuccess (puja la caixa Leitner si era un fallat)
    // - Si errada   → recordFailure (l'afegeix com a fallat o reseteja a caixa 1)
    // Saltades (blank) no toquen el SRS.
    for (let i = 0; i < state.questions.length; i++) {
      const ans = state.answers[i];
      if (ans === null || ans === undefined) continue;
      const q = state.questions[i].question as TestQuestion & { topicSlug?: string };
      const isCorrect = ans === state.questions[i].correctIndex;
      // Slug d'origen: per 'tot' i 'repas' ve etiquetat al question;
      // altrament és el slug actual de la URL.
      const sourceSlug = q.topicSlug || slug;
      if (isCorrect) {
        recordSuccess(q.id);
      } else {
        recordFailure(q.id, sourceSlug);
      }
    }

    // ── 2) Mode repàs: no toca el progrés del temari ni les stats globals ──
    if (isRepas) {
      const durationSec = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
      setState({
        phase: 'result',
        mode: state.mode,
        questions: state.questions,
        answers: state.answers,
        durationSec,
        prevStats: null,
        newAchievements: [],
      });
      return;
    }

    // ── 3) Marquem com a respostes les preguntes contestades ──
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

    // ── 4) Calculem el resum, registrem stats i comprovem logros ──
    const score = computeScore(state.questions, state.answers);
    const durationSec = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
    const statsSlug = isAll ? 'tot' : slug;
    const prevStatsSnapshot = getGlobalStats(); // copia ABANS de gravar
    const prevTopicStats = getTopicStats(statsSlug);
    recordTestResult({
      topicSlug: statsSlug,
      grade: score.grade,
      correct: score.correct,
      wrong: score.wrong,
      blank: score.blank,
      total: score.total,
      seconds: durationSec,
    });
    const newAchievements = checkAchievements(
      {
        topicSlug: statsSlug,
        grade: score.grade,
        correct: score.correct,
        wrong: score.wrong,
        blank: score.blank,
        total: score.total,
        seconds: durationSec,
      },
      prevStatsSnapshot,
    );

    setState({
      phase: 'result',
      mode: state.mode,
      questions: state.questions,
      answers: state.answers,
      durationSec,
      prevStats: prevTopicStats,
      newAchievements,
    });
  }

  // ── RENDER per fase ─────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link to={corpsRoot} className="hover:underline">{corpsLabel}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 truncate">{title}</span>
      </nav>

      {state.phase === 'select' && (
        isRepas ? (
          <RepasListPhase onStart={startRepas} />
        ) : (
          <SelectPhase
            title={title}
            accent={accent}
            total={pool.length}
            remaining={remaining}
            onStart={startTest}
            onReset={onResetTopic}
            isRepas={isRepas}
          />
        )
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
          corpsRoot={corpsRoot}
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
  title, accent, total, remaining, onStart, onReset, isRepas = false,
}: {
  title: string; accent: string;
  total: number; remaining: number;
  onStart: (count: number, mode: Mode) => void;
  onReset: () => void;
  isRepas?: boolean;
}) {
  const { t } = useT();
  // Per defecte interactiu (study) al mode repàs — té sentit estudiar
  // amb feedback immediat. A la resta de modes, manté simulacre.
  const [mode, setMode] = useState<Mode>(isRepas ? 'study' : 'exam');
  // Maxim 50 preguntes per test (encara que el pool tingui mes).
  const MAX_PER_TEST = 50;
  const cappedRemaining = Math.min(remaining, MAX_PER_TEST);
  const choices = [10, 25, 50].filter((n) => n <= cappedRemaining);
  // Si queden < 50, afegim el nombre exacte com a opcio (p.ex. 37).
  if (cappedRemaining > 0 && cappedRemaining < 50 && !choices.includes(cappedRemaining)) {
    choices.push(cappedRemaining);
  }
  const exhausted = remaining === 0;

  return (
    <>
      <header className={`rounded-2xl border p-5 sm:p-6 mb-5 bg-gradient-to-br from-white to-slate-50/40
        dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] border-slate-200/70 dark:border-white/10`}>
        <div className="flex items-start gap-4">
          <span aria-hidden className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-3xl text-white shadow-inner`}>
            {isRepas ? '🔁' : '📝'}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {isRepas
                ? t('test.repas.poolStatus').replace('{n}', String(remaining))
                : t('test.session.poolStatus')
                    .replace('{remaining}', String(remaining))
                    .replace('{total}', String(total))}
            </p>
          </div>
        </div>
      </header>

      {exhausted ? (
        isRepas ? (
          <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 dark:bg-emerald-400/5 p-6 text-center">
            <div className="text-4xl mb-2" aria-hidden>✨</div>
            <h2 className="font-bold text-lg mb-1 text-emerald-800 dark:text-emerald-300">
              {t('test.repas.emptyTitle')}
            </h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-200/80">
              {t('test.repas.emptyDesc')}
            </p>
          </div>
        ) : (
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
        )
      ) : (
        <div className="rounded-2xl border p-5 border-slate-200/80 bg-white dark:bg-[#0f1d34] dark:border-white/10">
          {/* Selector de mode */}
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
            {t('test.session.modeLabel')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            <button
              type="button"
              onClick={() => setMode('exam')}
              aria-pressed={mode === 'exam'}
              className={`text-left rounded-xl border-2 p-4 transition
                ${mode === 'exam'
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-400/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg" aria-hidden>🧪</span>
                <span className="font-bold">{t('test.session.modeExam')}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {t('test.session.modeExamDesc')}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('study')}
              aria-pressed={mode === 'study'}
              className={`text-left rounded-xl border-2 p-4 transition
                ${mode === 'study'
                  ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-400/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg" aria-hidden>🎯</span>
                <span className="font-bold">{t('test.session.modeStudy')}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {t('test.session.modeStudyDesc')}
              </div>
            </button>
          </div>

          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-3">
            {t('test.session.howMany')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {choices.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onStart(n, mode)}
                className={`rounded-xl border-2 px-4 py-3 text-base font-bold transition
                  border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700
                  dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-blue-400/10`}
              >
                {n === cappedRemaining && cappedRemaining < 50 ? `${n} (${t('test.session.allRemaining')})` : n}
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Cronometre reactiu — re-render cada segon per actualitzar el display.
  const [, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsedSec = Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
  const elapsedDisplay = formatMMSS(elapsedSec);

  function requestFinish() {
    if (blanks === 0) {
      onFinish();
      return;
    }
    // window.confirm() es ignorat en PWA standalone iOS; fem servir
    // un modal propi sempre per consistencia.
    setConfirmOpen(true);
  }

  return (
    <>
      {/* Barra de progrés + cronometre + boto acabar */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {t('test.session.questionN')
                .replace('{n}', String(state.index + 1))
                .replace('{total}', String(total))}
            </span>
            <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
            <span
              className="font-mono text-slate-500 dark:text-slate-400 inline-flex items-center gap-1"
              title={t('test.session.elapsed')}
            >
              <span aria-hidden>⏱</span>
              {elapsedDisplay}
            </span>
          </div>
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
        <TopicBadge question={cur.question} />
        <div className="text-base sm:text-lg font-semibold leading-snug mb-4">
          {cur.question.text}
        </div>
        <div className="space-y-2">
          {cur.options.map((opt, i) => {
            const isSelected = selected === i;
            const revealed = state.mode === 'study' && state.revealedIdx.has(state.index);
            const isCorrect = i === cur.correctIndex;
            const isWrongPicked = revealed && isSelected && !isCorrect;
            const isCorrectShown = revealed && isCorrect;

            // Estil base
            let cls = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10';
            let badgeCls = 'border-slate-300 text-slate-500 dark:border-white/20 dark:text-slate-400';
            if (revealed) {
              if (isCorrectShown) {
                cls = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-400/15 dark:text-emerald-100';
                badgeCls = 'border-emerald-500 bg-emerald-500 text-white';
              } else if (isWrongPicked) {
                cls = 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-400/15 dark:text-red-100';
                badgeCls = 'border-red-500 bg-red-500 text-white';
              } else {
                cls = 'border-slate-200 bg-white text-slate-400 opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-500';
                badgeCls = 'border-slate-300 text-slate-400 dark:border-white/15 dark:text-slate-500';
              }
            } else if (isSelected) {
              cls = 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-400/15 dark:text-blue-100';
              badgeCls = 'border-blue-500 bg-blue-500 text-white';
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => onAnswer(isSelected ? null : i)}
                disabled={revealed}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition flex items-start gap-3
                  ${cls}
                  ${revealed ? 'cursor-default' : ''}`}
              >
                <span className={`shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 font-bold text-xs ${badgeCls}`}>
                  {isCorrectShown ? '✓' : isWrongPicked ? '✗' : String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm sm:text-base leading-snug flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback de la correccio en mode interactiu */}
        {state.mode === 'study' && state.revealedIdx.has(state.index) && (
          <div className="mt-4 rounded-lg border-l-4 p-3 text-sm
            border-l-emerald-500 bg-emerald-50/60 text-emerald-900
            dark:border-l-emerald-400/70 dark:bg-emerald-400/10 dark:text-emerald-100">
            {selected === cur.correctIndex ? (
              <div className="font-bold">✅ {t('test.session.correctFeedback')}</div>
            ) : (
              <div>
                <div className="font-bold">❌ {t('test.session.wrongFeedback')}</div>
                <div className="text-xs mt-1">
                  {t('test.result.correctAnswer')}: <span className="font-mono font-bold">{String.fromCharCode(65 + cur.correctIndex)}</span> · {cur.options[cur.correctIndex]}
                </div>
              </div>
            )}
            {cur.question.reference && (
              <div className="text-[11px] mt-1 font-mono opacity-80">📖 {cur.question.reference}</div>
            )}
          </div>
        )}
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

      {/* Modal propi de confirmacio (window.confirm() no funciona a iOS PWA) */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-sm rounded-2xl border-2 p-5 shadow-2xl
            border-amber-300 bg-white
            dark:border-amber-400/40 dark:bg-[#0f1d34]">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl shrink-0" aria-hidden>⚠️</span>
              <div>
                <h3 className="font-bold text-base mb-1">
                  {t('test.session.confirmTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                  {t('test.session.confirmFinish').replace('{n}', String(blanks))}
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition
                  border-slate-200 bg-white text-slate-700 hover:bg-slate-50
                  dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {t('test.session.confirmCancel')}
              </button>
              <button
                type="button"
                onClick={() => { setConfirmOpen(false); onFinish(); }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 shadow-md"
              >
                {t('test.session.confirmYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// FASE 3 — RESULT
// ════════════════════════════════════════════════════════════════════

function ResultPhase({
  state, slug, isAll, corpsRoot, onRestart,
}: {
  state: Extract<SessionState, { phase: 'result' }>;
  slug: string;
  isAll: boolean;
  corpsRoot: string;
  onRestart: () => void;
}) {
  const { t } = useT();
  const score = computeScore(state.questions, state.answers);
  const durationSec = state.durationSec;
  const avgPerQuestion = score.total > 0 ? durationSec / score.total : 0;

  // Color, fons i missatge segons rang de nota.
  const tier =
    score.grade >= 9 ? 'excellent'
    : score.grade >= 7 ? 'notable'
    : score.grade >= 5 ? 'pass'
    : 'fail';

  const tierStyle: Record<string, { grade: string; ring: string; bg: string; emoji: string }> = {
    excellent: {
      grade: 'text-purple-600 dark:text-purple-400',
      ring: 'ring-purple-200 dark:ring-purple-400/30',
      bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-[#1a0f2e] dark:to-[#0f1d34]',
      emoji: '🏆',
    },
    notable: {
      grade: 'text-emerald-600 dark:text-emerald-400',
      ring: 'ring-emerald-200 dark:ring-emerald-400/30',
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[#0f2a1f] dark:to-[#0f1d34]',
      emoji: '🌟',
    },
    pass: {
      grade: 'text-amber-600 dark:text-amber-400',
      ring: 'ring-amber-200 dark:ring-amber-400/30',
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-[#2a210f] dark:to-[#0f1d34]',
      emoji: '✅',
    },
    fail: {
      grade: 'text-red-600 dark:text-red-400',
      ring: 'ring-red-200 dark:ring-red-400/30',
      bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-[#2a0f1a] dark:to-[#0f1d34]',
      emoji: '💪',
    },
  };
  const ts = tierStyle[tier];

  // Comparativa amb la propia mitjana del tema (si existia).
  const prev = state.prevStats;
  const diff = prev && prev.attempts > 0 ? score.grade - prev.last : null;
  const wasNewBest = prev && score.grade > prev.best;

  return (
    <>
      <div className={`rounded-2xl border p-6 mb-5 text-center ring-2 ${ts.ring} ${ts.bg} dark:border-white/10`}>
        <div className="text-3xl mb-1" aria-hidden>{ts.emoji}</div>
        <div className="text-xs uppercase tracking-[0.25em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
          {t(`test.result.tier.${tier}`)}
        </div>
        <div className={`text-6xl sm:text-7xl font-black tracking-tight ${ts.grade}`}>
          {score.grade.toFixed(2)}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('test.result.outOf10')}
        </div>

        {/* Bandera nou rècord */}
        {wasNewBest && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-md">
            🏅 {t('test.result.newBest')}
          </div>
        )}

        {/* Comparativa amb l'ultim test */}
        {diff !== null && !wasNewBest && (
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {diff > 0
              ? `📈 +${diff.toFixed(2)} ${t('test.result.vsLast')}`
              : diff < 0
                ? `📉 ${diff.toFixed(2)} ${t('test.result.vsLast')}`
                : `${t('test.result.sameAsLast')}`}
          </div>
        )}

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

        {/* Cronometre + velocitat */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>⏱</span>
            <span className="font-mono">{formatMMSS(durationSec)}</span>
          </span>
          {avgPerQuestion > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="font-mono">
                {avgPerQuestion.toFixed(1)}s {t('test.result.perQuestion')}
              </span>
            </>
          )}
        </div>

        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          {t('test.result.formula').replace('{raw}', score.raw.toFixed(2))}
        </div>
      </div>

      {/* Logros nous desbloquejats */}
      {state.newAchievements.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50
          dark:border-amber-400/40 dark:from-[#2a210f] dark:to-[#0f1d34] p-4 mb-5">
          <div className="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-300 mb-2">
            🎉 {t('test.result.unlockedTitle')}
          </div>
          <ul className="space-y-1.5">
            {state.newAchievements.map((a) => (
              <li key={a.id} className="flex items-start gap-2">
                <span className="text-xl" aria-hidden>{a.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold text-sm">{a.title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">{a.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
                  <TopicBadge question={q.question} compact />
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
          to={corpsRoot}
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

// ════════════════════════════════════════════════════════════════════
// REPÀS — Llistat de totes les preguntes guardades + accions
// ════════════════════════════════════════════════════════════════════

function RepasListPhase({
  onStart,
}: {
  onStart: (includeNotDue: boolean) => void;
}) {
  const { t } = useT();
  const failures = useAllFailures();
  const now = Date.now();

  const due = failures.filter((r) => !r.learned && r.nextReviewAt <= now);
  const upcoming = failures.filter((r) => !r.learned && r.nextReviewAt > now);
  const learned = failures.filter((r) => r.learned);
  const total = failures.length;

  const dueCount = due.length;
  const learnedDueCount = learned.filter((r) => r.nextReviewAt <= now).length;
  // Tots els due (incloent apreses que toquin refrescar)
  const allDue = dueCount + learnedDueCount;

  function onResetAll() {
    if (typeof window === 'undefined') return;
    if (window.confirm(t('test.repas.resetConfirm'))) {
      resetAllFailures();
    }
  }

  return (
    <>
      {/* Capçalera */}
      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-rose-200/70 bg-gradient-to-br from-rose-50 via-white to-orange-50
        dark:border-rose-400/30 dark:from-[#2a0f1a] dark:via-[#170c14] dark:to-[#1a0f08]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 text-3xl text-white shadow-inner">
            🔁
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('test.repas.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {total === 0
                ? t('test.repas.emptyDesc')
                : t('test.repas.summary')
                    .replace('{total}', String(total))
                    .replace('{due}', String(allDue))}
            </p>
          </div>
        </div>
      </header>

      {/* Comptadors compactes */}
      {total > 0 && (
        <section className="grid grid-cols-3 gap-2 mb-5">
          <CountBox
            value={allDue}
            label={t('test.repas.statDue')}
            icon="⏰"
            tone={allDue > 0 ? 'rose' : 'slate'}
          />
          <CountBox
            value={total - learned.length}
            label={t('test.repas.statPending')}
            icon="📚"
            tone="amber"
          />
          <CountBox
            value={learned.length}
            label={t('test.repas.statLearned')}
            icon="✓"
            tone="emerald"
          />
        </section>
      )}

      {/* Botons d'acció */}
      {total === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 dark:bg-emerald-400/5 p-6 text-center mb-5">
          <div className="text-4xl mb-2" aria-hidden>✨</div>
          <h2 className="font-bold text-lg mb-1 text-emerald-800 dark:text-emerald-300">
            {t('test.repas.zeroTitle')}
          </h2>
          <p className="text-sm text-emerald-700 dark:text-emerald-200/80">
            {t('test.repas.zeroDesc')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <button
            type="button"
            disabled={allDue === 0}
            onClick={() => onStart(false)}
            className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold px-5 py-3 shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
          >
            ▶ {t('test.repas.startDue').replace('{n}', String(allDue))}
          </button>
          {total > allDue && (
            <button
              type="button"
              onClick={() => onStart(true)}
              className="flex-1 rounded-xl border-2 px-5 py-3 text-sm font-bold transition
                border-slate-200 bg-white text-slate-700 hover:bg-slate-50
                dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              ↻ {t('test.repas.startAll').replace('{n}', String(Math.min(total, 50)))}
            </button>
          )}
        </div>
      )}

      {/* LLISTA — Pendents (due) */}
      {due.length > 0 && (
        <FailureSection
          icon="⏰"
          label={t('test.repas.sectionDue')}
          tone="rose"
          records={due}
        />
      )}

      {/* LLISTA — Programades (no due encara) */}
      {upcoming.length > 0 && (
        <FailureSection
          icon="📅"
          label={t('test.repas.sectionUpcoming')}
          tone="amber"
          records={upcoming}
        />
      )}

      {/* LLISTA — Apreses */}
      {learned.length > 0 && (
        <FailureSection
          icon="✓"
          label={t('test.repas.sectionLearned')}
          tone="emerald"
          records={learned}
        />
      )}

      {/* Reset all */}
      {total > 0 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-red-600 dark:hover:text-red-400"
          >
            🗑 {t('test.repas.resetAll')}
          </button>
        </div>
      )}
    </>
  );
}

function CountBox({
  value, label, icon, tone,
}: {
  value: number;
  label: string;
  icon: string;
  tone: 'rose' | 'amber' | 'emerald' | 'slate';
}) {
  const toneCls: Record<string, string> = {
    rose: 'border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300',
    amber: 'border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300',
    emerald: 'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    slate: 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400',
  };
  return (
    <div className={`rounded-xl border p-3 text-center ${toneCls[tone]}`}>
      <div className="text-xl" aria-hidden>{icon}</div>
      <div className="text-2xl font-black leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
        {label}
      </div>
    </div>
  );
}

function FailureSection({
  icon, label, tone, records,
}: {
  icon: string;
  label: string;
  tone: 'rose' | 'amber' | 'emerald';
  records: FailureRecord[];
}) {
  const toneCls: Record<string, string> = {
    rose: 'from-rose-400 to-orange-500 dark:from-rose-300 dark:to-orange-400',
    amber: 'from-amber-400 to-amber-600 dark:from-amber-300 dark:to-amber-500',
    emerald: 'from-emerald-400 to-teal-500 dark:from-emerald-300 dark:to-teal-400',
  };
  return (
    <section className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <span className={`h-5 w-1.5 rounded-full bg-gradient-to-b ${toneCls[tone]}`} />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
          <span aria-hidden>{icon}</span>
          {label}
          <span className="rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono">
            {records.length}
          </span>
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
      </div>
      <ul className="space-y-2">
        {records.map((r) => (
          <FailureItem key={r.questionId} record={r} />
        ))}
      </ul>
    </section>
  );
}

function FailureItem({ record }: { record: FailureRecord }) {
  const { t } = useT();
  const q = useMemo(
    () => TOPICS.find((tp) => tp.slug === record.topicSlug)?.questions.find((qq) => qq.id === record.questionId),
    [record],
  );
  const topic = TOPICS.find((tp) => tp.slug === record.topicSlug);
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!q) {
    // Pregunta orfena (s'ha eliminat del codi font). Permetre eliminar.
    return (
      <li className="rounded-xl border p-3 text-sm border-dashed border-slate-300 bg-slate-50/60 dark:border-white/10 dark:bg-white/5 flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400 italic">
          {t('test.repas.orphan').replace('{id}', record.questionId)}
        </span>
        <button
          type="button"
          onClick={() => removeFailure(record.questionId)}
          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
        >
          {t('test.repas.delete')}
        </button>
      </li>
    );
  }

  const now = Date.now();
  const isDue = record.nextReviewAt <= now;
  const dueIn = record.nextReviewAt - now;
  const dueText = isDue
    ? t('test.repas.dueNow')
    : formatRelative(dueIn, t);
  const streakLabel = record.successStreak >= LEARNED_THRESHOLD
    ? t('test.repas.learned')
    : t('test.repas.streak').replace('{n}', String(record.successStreak)).replace('{th}', String(LEARNED_THRESHOLD));

  function onDelete() {
    if (confirming) {
      removeFailure(record.questionId);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  }

  return (
    <li className="rounded-xl border p-3 text-sm
      border-slate-200 bg-white
      dark:border-white/10 dark:bg-[#0f1d34]">
      <div className="flex items-start gap-3">
        {topic && (
          <span aria-hidden className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${topic.accent} text-base text-white shadow-inner`}>
            {topic.icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {topic && (
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
              {topic.title}
            </div>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-left w-full font-medium leading-snug text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {expanded
              ? q.text
              : (q.text.length > 110 ? q.text.slice(0, 110) + '…' : q.text)}
          </button>

          {expanded && (
            <ol className="mt-2 space-y-1 text-xs">
              {q.options.map((opt, i) => (
                <li key={i}
                  className={`rounded-md px-2 py-1 flex items-start gap-2
                    ${i === q.correct
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200 font-semibold'
                      : 'bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400'}`}>
                  <span className="font-mono shrink-0">{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                  {i === q.correct && <span aria-hidden className="ml-auto">✓</span>}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px]">
            <span className={`font-mono font-bold ${isDue ? 'text-rose-700 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400'}`}>
              {isDue ? '⏰' : '📅'} {dueText}
            </span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden>·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {streakLabel}
            </span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden>·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              ✗ {record.failures}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          title={t('test.repas.delete')}
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold transition
            ${confirming
              ? 'bg-red-600 text-white'
              : 'text-slate-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300'}`}
        >
          {confirming ? t('test.repas.confirmDelete') : '✕'}
        </button>
      </div>
    </li>
  );
}

/**
 * Format relatiu d'un interval (ms) → "en 2 dies", "en 3 hores", etc.
 * Si negatiu, retorna "ara".
 */
function formatRelative(ms: number, t: (k: string) => string): string {
  if (ms <= 0) return t('test.repas.dueNow');
  const minutes = Math.floor(ms / (60 * 1000));
  if (minutes < 60) return t('test.repas.inMinutes').replace('{n}', String(Math.max(1, minutes)));
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (hours < 24) return t('test.repas.inHours').replace('{n}', String(hours));
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days < 30) return t('test.repas.inDays').replace('{n}', String(days));
  const months = Math.floor(days / 30);
  return t('test.repas.inMonths').replace('{n}', String(months));
}

// ════════════════════════════════════════════════════════════════════
// HELPER — Badge del tema d'origen (només visible al mode 'tot')
// ════════════════════════════════════════════════════════════════════

function TopicBadge({
  question,
  compact = false,
}: {
  question: TestQuestion;
  compact?: boolean;
}) {
  // Quan venim del pool combinat (slug 'tot'), getAllQuestions afegeix
  // un camp topicSlug a cada pregunta. Si no hi és, no mostrem badge.
  const topicSlug = (question as TestQuestion & { topicSlug?: string }).topicSlug;
  if (!topicSlug) return null;
  const topic = TOPICS.find((tp) => tp.slug === topicSlug);
  if (!topic) return null;

  return (
    <div className={compact ? 'mb-1' : 'mb-2'}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide
          border-slate-200 bg-slate-50 text-slate-700
          dark:border-white/10 dark:bg-white/5 dark:text-slate-300
          ${compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'}`}
      >
        <span aria-hidden>{topic.icon}</span>
        <span>{topic.title}</span>
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// HELPER — Format de durada (MM:SS o HH:MM:SS)
// ════════════════════════════════════════════════════════════════════

function formatMMSS(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
  return `${pad(m)}:${pad(sec)}`;
}
