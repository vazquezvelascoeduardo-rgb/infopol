// Sessio de test: gestiona els 3 estats (select → run → result) en una
// sola pagina amb React state. URL parametritzada per :slug; si slug
// es 'tot' fem mescla de tots els temes.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { TOPICS, getAllQuestions, getAllMossosQuestions, getAllCulturaQuestions, getAllActualitatQuestions, getEverythingQuestions, getTopic } from '../../data/tests';
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
import ReportQuestionButton from '../../components/ReportQuestionButton';

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
const EVERYTHING_SLUG = 'totes';
const REPAS_SLUG = 'repas';

export default function TestSession() {
  const { slug = '' } = useParams();
  const { t } = useT();
  const location = useLocation();

  // 'totes' = pool absolut (totes les preguntes de tots els temes).
  const isEverything = slug === EVERYTHING_SLUG;
  // isAll cobreix tant 'tot' (per cos) com 'totes' (absolut): comparteixen
  // la mateixa lògica de pool combinat, badge d'origen i distribució.
  const isAll = slug === ALL_TOPICS_SLUG || isEverything;
  const isRepas = slug === REPAS_SLUG;
  const topic = (isAll || isRepas) ? null : getTopic(slug);

  // Detecta el cos d'origen (/mossos, /policia-local o /cultura-general)
  // per generar correctament les molles de pa, els enllaços "tornar al
  // llistat" i el pool de preguntes en mode 'tot'.
  const isMossosRoute = location.pathname.startsWith('/mossos');
  const isCulturaRoute = location.pathname.startsWith('/cultura-general');
  const isActualitatRoute = location.pathname.startsWith('/actualitat');
  const corpsRoot = isMossosRoute
    ? '/mossos'
    : isCulturaRoute
      ? '/cultura-general'
      : isActualitatRoute
        ? '/actualitat'
        : '/policia-local';
  const corpsLabel = isMossosRoute
    ? t('mossos.title')
    : isCulturaRoute
      ? t('cultura.title')
      : isActualitatRoute
        ? 'Actualitat'
        : t('test.list.title');

  // Pool de preguntes per a aquest tema (o tots, o repàs).
  // El pool de 'tot' depèn del cos d'origen: a /mossos només Mossos, a
  // /cultura-general només Cultura, a /policia-local només Policia Local.
  const pool: TestQuestion[] = useMemo(() => {
    if (isRepas) return buildRepasPool({ onlyDue: true, max: 50 });
    if (isAll) {
      if (isEverything) return getEverythingQuestions();
      if (isMossosRoute) return getAllMossosQuestions();
      if (isCulturaRoute) return getAllCulturaQuestions();
      if (isActualitatRoute) return getAllActualitatQuestions();
      return getAllQuestions();
    }
    return topic?.questions ?? [];
  }, [isAll, isEverything, isRepas, isMossosRoute, isCulturaRoute, isActualitatRoute, topic]);

  // Per a 'tot', el progrés és la unió dels temes del cos corresponent.
  // Per a 'repas', no usem progrés (les preguntes es repeteixen segons SRS).
  const answeredIds: Set<string> = useMemo(() => {
    if (isRepas) return new Set<string>();
    if (isAll) {
      const set = new Set<string>();
      for (const tp of TOPICS) {
        const cat = tp.category ?? 'temari';
        if (!isEverything) {
          if (isMossosRoute && cat !== 'mossos') continue;
          if (isCulturaRoute && cat !== 'cultura') continue;
          if (isActualitatRoute && cat !== 'actualitat') continue;
          if (!isMossosRoute && !isCulturaRoute && !isActualitatRoute && cat === 'mossos') continue;
        }
        for (const id of getAnsweredIds(tp.slug)) set.add(id);
      }
      return set;
    }
    return getAnsweredIds(slug);
  }, [slug, isAll, isEverything, isRepas, isMossosRoute, isCulturaRoute, isActualitatRoute]);

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
    : isEverything
      ? 'Totes les preguntes'
      : isAll
        ? t('test.list.allMixed')
        : topic!.title;
  const accent = isRepas
    ? 'from-rose-500 to-orange-600'
    : isEverything
      ? 'from-indigo-500 to-purple-700'
      : isAll
        ? 'from-purple-500 to-fuchsia-700'
        : topic!.accent;
  const remaining = isRepas ? pool.length : pool.length - answeredIds.size;

  function startTest(count: number, mode: Mode, all = false) {
    // 'all' = totes les preguntes del tema (ignora les ja respostes i el
    // límit de 50). La resta de comptes filtren les ja respostes.
    const { questions, exhausted } = all
      ? pickQuestions(pool, new Set<string>(), pool.length)
      : pickQuestions(pool, answeredIds, count);
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

    // Auto-avanç:
    //  · mode 'exam' (simulacre): sempre auto-avança ràpid (450 ms) per
    //    mantenir el ritme de simulacre real.
    //  · mode 'study' (interactiu): només auto-avança si l'usuari ha
    //    encertat (1 s per veure el ✓ verd). Si ha fallat, es queda
    //    perquè llegeixi la correcció i pugui passar manualment quan
    //    vulgui — així s'interioritza l'error.
    const isLast = state.index >= state.questions.length - 1;
    if (isLast) return;
    const currentQIdx = state.index;
    const isCorrect = idx === state.questions[state.index].correctIndex;
    if (state.mode === 'exam') {
      setTimeout(() => {
        setState((curr) => {
          if (curr.phase !== 'run') return curr;
          // Només avancem si l'usuari encara és a la mateixa pregunta
          // (per no saltar si ha tornat enrere mentrestant).
          if (curr.index !== currentQIdx) return curr;
          if (curr.index >= curr.questions.length - 1) return curr;
          return { ...curr, index: curr.index + 1 };
        });
      }, 450);
    } else if (state.mode === 'study' && isCorrect) {
      setTimeout(() => {
        setState((curr) => {
          if (curr.phase !== 'run') return curr;
          if (curr.index !== currentQIdx) return curr;
          if (curr.index >= curr.questions.length - 1) return curr;
          return { ...curr, index: curr.index + 1 };
        });
      }, 1000);
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

    // ── 0) Marquem que l'usuari ha acabat (com a mínim) un test ──
    // El RegisterNudge escolta aquest event per oferir registre als visitants.
    try {
      if (!localStorage.getItem('infopol:firstTestDone')) {
        localStorage.setItem('infopol:firstTestDone', '1');
        window.dispatchEvent(new CustomEvent('infopol:test-finished'));
      }
    } catch { /* localStorage indisponible */ }

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
    const statsSlug = isEverything ? 'totes' : isAll ? 'tot' : slug;
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
          title={title}
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
  onStart: (count: number, mode: Mode, all?: boolean) => void;
  onReset: () => void;
  isRepas?: boolean;
}) {
  const { t } = useT();
  // Mode 'study' (interactiu) per defecte sempre — l'usuari va
  // demanar tenir el feedback immediat com a opció principal. Si vol
  // simular un examen real ha de canviar a 'exam' manualment.
  const [mode, setMode] = useState<Mode>('study');
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
            {/* Totes: el tema sencer, ignorant el límit de 50 i les ja respostes */}
            {!isRepas && total > 0 && (
              <button
                type="button"
                onClick={() => onStart(total, mode, true)}
                className={`col-span-2 sm:col-span-4 rounded-xl border-2 px-4 py-3 text-base font-bold transition
                  border-purple-300 bg-purple-50 text-purple-700 hover:border-purple-500 hover:bg-purple-100
                  dark:border-purple-400/40 dark:bg-purple-400/10 dark:text-purple-200 dark:hover:border-purple-400`}
              >
                🎯 Totes ({total})
              </button>
            )}
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

// ── Paleta i icones del Mode Focus (disseny "Test Focus") ───────────
const FP = {
  bg: '#F4F1EA', bgDeep: '#ECE7DC', card: '#FFFFFF',
  ink: '#13131A', inkSoft: '#44444F', inkMuted: '#8A8A95', inkFaint: '#B6B6BE',
  hairline: 'rgba(19,19,26,0.08)', line2: 'rgba(19,19,26,0.12)',
  terracota: '#FF7A1A', terraSoft: '#FFE7D2', terraInk: '#7A2E04',
  green: '#1FB286', greenSoft: '#D2F0E2', greenInk: '#0B5A3D',
  red: '#E0455A', redSoft: '#FBDCE0', redInk: '#7A1B22',
  display: '"Poppins", "Manrope", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  sans: '"Manrope", system-ui, sans-serif',
};

function FIc({ name, size = 20, color = 'currentColor', sw = 2 }:
  { name: string; size?: number; color?: string; sw?: number }) {
  const c = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'x': return <svg {...c}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'check': return <svg {...c}><path d="M5 12l4 4 10-10" /></svg>;
    case 'clock': return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'arrow': return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrowL': return <svg {...c}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case 'keyboard': return <svg {...c}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function RunPhase({
  state, title, onAnswer, onNext, onBack, onFinish,
}: {
  state: Extract<SessionState, { phase: 'run' }>;
  title: string;
  onAnswer: (idx: number | null) => void;
  onNext: () => void; onBack: () => void; onFinish: () => void;
}) {
  const { t } = useT();
  const total = state.questions.length;
  const cur = state.questions[state.index];
  const selected = state.answers[state.index];
  const isLast = state.index === total - 1;
  const answeredCount = state.answers.filter((a) => a !== null).length;
  const correctCount = state.questions.reduce(
    (acc, q, i) => acc + (state.answers[i] === q.correctIndex ? 1 : 0), 0,
  );
  const blanks = total - answeredCount;
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Cronòmetre reactiu.
  const [, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsedSec = Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));

  const revealed = state.mode === 'study' && state.revealedIdx.has(state.index);
  const isCorrectAns = revealed && selected === cur.correctIndex;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  const requestFinish = useCallback(() => {
    if (blanks === 0) { onFinish(); return; }
    setConfirmOpen(true);
  }, [blanks, onFinish]);

  // Teclat: A/B/C/D o 1-4 trien · Enter/→ avancen · ← retrocedeix.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (k in map && map[k] < cur.options.length) {
        if (revealed) return;
        e.preventDefault(); onAnswer(map[k]);
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (isLast) requestFinish(); else onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); onBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cur.options.length, revealed, isLast, onAnswer, onNext, onBack, requestFinish]);

  // Chip de categoria: tema d'origen (pool combinat) o títol del test.
  const qSlug = (cur.question as TestQuestion & { topicSlug?: string }).topicSlug;
  const qTopic = qSlug ? TOPICS.find((tp) => tp.slug === qSlug) : null;
  const chipIcon = qTopic ? qTopic.icon : '📝';
  const chipLabel = qTopic ? qTopic.title : title;

  const pill = {
    fontFamily: FP.mono, fontWeight: 600, fontSize: 13, background: FP.card,
    padding: '9px 14px', borderRadius: 999,
    boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 4px 12px rgba(19,19,26,0.05)',
  } as const;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 120, background: FP.bg,
      display: 'flex', flexDirection: 'column',
      padding: '20px clamp(16px,5vw,64px)', gap: 16, overflow: 'hidden', fontFamily: FP.sans,
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <button onClick={requestFinish} aria-label={t('test.session.finishNow')} style={{
            width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer', background: FP.card,
            boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 4px 12px rgba(19,19,26,0.06)',
            display: 'grid', placeItems: 'center', color: FP.inkSoft, flexShrink: 0,
          }}><FIc name="x" size={18} /></button>
          <span style={{ ...pill, color: FP.inkSoft }}>Pregunta <span style={{ color: FP.ink }}>{state.index + 1}</span> / {total}</span>
          <span style={{ ...pill, color: FP.inkMuted, display: 'flex', alignItems: 'center', gap: 7 }}>
            <FIc name="clock" size={14} color={FP.inkMuted} />{formatMMSS(elapsedSec)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: FP.mono, fontWeight: 700, fontSize: 13, color: FP.greenInk, background: FP.greenSoft, padding: '9px 14px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 7 }}>
            <FIc name="check" size={14} color={FP.green} sw={3} />{correctCount}/{total}
          </span>
          <button onClick={requestFinish} style={{
            fontFamily: FP.mono, fontWeight: 700, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase',
            color: FP.greenInk, background: FP.greenSoft, border: `1px solid ${FP.green}`,
            padding: '9px 16px', borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
          }}><FIc name="check" size={14} color={FP.green} sw={3} />{t('test.session.finishNow')}</button>
        </div>
      </div>

      {/* Segments de progrés */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0, height: 6 }}
        role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answeredCount}>
        {Array.from({ length: total }).map((_, i) => {
          let bg: string = FP.line2;
          if (state.answers[i] != null) bg = state.answers[i] === state.questions[i].correctIndex ? FP.green : FP.red;
          if (i === state.index) bg = FP.terracota;
          return <div key={i} style={{ flex: 1, height: '100%', borderRadius: 999, background: bg, transition: 'background .25s' }} />;
        })}
      </div>

      {/* Contingut */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', maxWidth: 1040, width: '100%', margin: '0 auto' }}>
        {/* Pregunta */}
        <div style={{ flexShrink: 0, paddingTop: 'clamp(6px,2.5vh,28px)', paddingBottom: 'clamp(12px,2.5vh,26px)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: FP.terraSoft, color: FP.terraInk,
            fontFamily: FP.mono, fontWeight: 600, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase',
            padding: '7px 14px', borderRadius: 999, marginBottom: 16, maxWidth: '100%',
          }}>
            <span aria-hidden>{chipIcon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chipLabel}</span>
          </div>
          <div style={{ fontFamily: FP.display, fontWeight: 700, fontSize: 'clamp(22px,3.2vw,38px)', lineHeight: 1.2, color: FP.ink, letterSpacing: -0.6 }}>
            {cur.question.text}
          </div>
        </div>

        {/* Opcions 2×2 */}
        <div style={{
          flex: 1, minHeight: 0, display: 'grid',
          gridTemplateColumns: cur.options.length > 1 ? '1fr 1fr' : '1fr',
          gridAutoRows: '1fr', gap: 12, alignContent: 'stretch',
        }}>
          {cur.options.map((opt, i) => {
            const isSel = selected === i;
            let s: 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed' = 'idle';
            if (revealed) s = i === cur.correctIndex ? 'correct' : (isSel ? 'wrong' : 'dimmed');
            else if (isSel) s = 'selected';
            let bg = FP.card, border: string = FP.hairline, fg: string = FP.ink,
              badgeBg: string = FP.bgDeep, badgeFg: string = FP.inkSoft;
            let icon: string | null = null;
            if (s === 'selected') { border = FP.terracota; badgeBg = FP.terracota; badgeFg = '#fff'; bg = '#FFFAF5'; }
            if (s === 'correct') { border = FP.green; bg = FP.greenSoft; fg = FP.greenInk; badgeBg = FP.green; badgeFg = '#fff'; icon = 'check'; }
            if (s === 'wrong') { border = FP.red; bg = FP.redSoft; fg = FP.redInk; badgeBg = FP.red; badgeFg = '#fff'; icon = 'x'; }
            if (s === 'dimmed') { fg = FP.inkMuted; badgeFg = FP.inkFaint; }
            return (
              <button key={i} className="opt" type="button"
                onClick={() => { if (!revealed) onAnswer(isSel ? null : i); }}
                disabled={revealed}
                style={{
                  textAlign: 'left', cursor: revealed ? 'default' : 'pointer', background: bg,
                  border: `2px solid ${border}`, borderRadius: 16, padding: '0 18px', minHeight: 60, height: '100%',
                  boxShadow: (s === 'idle' || s === 'selected') ? '0 1px 0 rgba(19,19,26,0.04), 0 6px 16px rgba(19,19,26,0.05)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'transform .12s, box-shadow .12s, border-color .15s, background .15s',
                  opacity: s === 'dimmed' ? 0.65 : 1, width: '100%',
                }}>
                <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: badgeBg, color: badgeFg, fontFamily: FP.mono, fontWeight: 700, fontSize: 15, display: 'grid', placeItems: 'center' }}>{letters[i]}</span>
                <span style={{ flex: 1, fontFamily: FP.display, fontWeight: 500, fontSize: 'clamp(14px,1.45vw,18px)', color: fg, letterSpacing: -0.2, lineHeight: 1.25 }}>{opt}</span>
                {icon && <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, background: badgeBg, display: 'grid', placeItems: 'center' }}><FIc name={icon} size={15} color="#fff" sw={3} /></span>}
              </button>
            );
          })}
        </div>

        {/* Peu: explicació (estudi) + navegació */}
        <div style={{ flexShrink: 0, paddingTop: 14, display: 'flex', alignItems: 'center', gap: 16, minHeight: 60 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {revealed ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: isCorrectAns ? FP.greenSoft : FP.redSoft, border: `1px solid ${isCorrectAns ? FP.green : FP.red}`, borderRadius: 14, padding: '11px 15px' }}>
                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: isCorrectAns ? FP.green : FP.red, display: 'grid', placeItems: 'center', marginTop: 1 }}><FIc name={isCorrectAns ? 'check' : 'x'} size={14} color="#fff" sw={3} /></span>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontFamily: FP.display, fontWeight: 700, fontSize: 14, color: isCorrectAns ? FP.greenInk : FP.redInk, marginRight: 8 }}>
                    {isCorrectAns ? t('test.session.correctFeedback') : t('test.session.wrongFeedback')}
                  </span>
                  <span style={{ fontFamily: FP.sans, fontSize: 13.5, lineHeight: 1.4, color: isCorrectAns ? FP.greenInk : FP.redInk, opacity: 0.94 }}>
                    {!isCorrectAns && <><b>{letters[cur.correctIndex]}) {cur.options[cur.correctIndex]}</b>. </>}
                    {cur.question.explanation || (cur.question.reference ? `📖 ${cur.question.reference}` : '')}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: FP.inkMuted, fontFamily: FP.mono, fontSize: 12, letterSpacing: 0.3 }}>
                <FIc name="keyboard" size={16} color={FP.inkFaint} /> Tria amb <b style={{ color: FP.inkSoft }}>A·B·C·D</b> · avança amb <b style={{ color: FP.inkSoft }}>↵</b>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button onClick={onBack} disabled={state.index === 0} aria-label={t('test.session.previous')} style={{
              width: 48, height: 50, borderRadius: 14, cursor: state.index === 0 ? 'default' : 'pointer',
              background: FP.card, border: `1px solid ${FP.line2}`, color: state.index === 0 ? FP.inkFaint : FP.inkSoft,
              display: 'grid', placeItems: 'center', opacity: state.index === 0 ? 0.5 : 1,
              boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 4px 12px rgba(19,19,26,0.05)',
            }}><FIc name="arrowL" size={20} /></button>
            <button onClick={() => (isLast ? requestFinish() : onNext())} style={{
              height: 50, padding: '0 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: FP.terracota, color: '#fff', fontFamily: FP.display, fontWeight: 700, fontSize: 16,
              display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.18)',
            }}>
              {isLast ? t('test.session.finish') : t('test.session.next')}
              <FIc name="arrow" size={19} color="#fff" sw={2.4} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmació */}
      {confirmOpen && (
        <div role="dialog" aria-modal="true" className="ts-modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="ts-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 28, flex: 'none' }} aria-hidden>⚠️</span>
              <div>
                <h3>{t('test.session.confirmTitle')}</h3>
                <p>{t('test.session.confirmFinish').replace('{n}', String(blanks))}</p>
              </div>
            </div>
            <div className="ts-modal-actions">
              <button type="button" onClick={() => setConfirmOpen(false)} className="ts-btn">
                {t('test.session.confirmCancel')}
              </button>
              <button type="button" onClick={() => { setConfirmOpen(false); onFinish(); }} className="ts-btn ts-btn-primary finish">
                {t('test.session.confirmYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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

  const tierStyle: Record<string, { c: string; glow: string; emoji: string }> = {
    excellent: { c: '#9747D6', glow: 'radial-gradient(circle at top, rgba(151,71,214,0.18), transparent 60%)', emoji: '🏆' },
    notable:   { c: '#15803d', glow: 'radial-gradient(circle at top, rgba(21,128,61,0.16), transparent 60%)', emoji: '🌟' },
    pass:      { c: '#D9531A', glow: 'radial-gradient(circle at top, rgba(242,107,31,0.16), transparent 60%)', emoji: '✅' },
    fail:      { c: '#b91c1c', glow: 'radial-gradient(circle at top, rgba(185,28,28,0.16), transparent 60%)', emoji: '💪' },
  };
  const ts = tierStyle[tier];

  // Comparativa amb la propia mitjana del tema (si existia).
  const prev = state.prevStats;
  const diff = prev && prev.attempts > 0 ? score.grade - prev.last : null;
  const wasNewBest = prev && score.grade > prev.best;

  return (
    <div className="ts-shell">
      {/* Hero amb la nota */}
      <div
        className="tr-hero"
        style={{ ['--tier-c' as never]: ts.c, ['--tier-glow' as never]: ts.glow } as React.CSSProperties}
      >
        <div className="tr-hero-emoji" aria-hidden>{ts.emoji}</div>
        <div className="tr-hero-tier">{t(`test.result.tier.${tier}`)}</div>
        <div className="tr-hero-grade">{score.grade.toFixed(2)}</div>
        <div className="tr-hero-outof">{t('test.result.outOf10')}</div>

        {wasNewBest && (
          <div className="tr-newbest">🏅 {t('test.result.newBest')}</div>
        )}
        {diff !== null && !wasNewBest && (
          <div className={`tr-diff ${diff > 0 ? 'up' : diff < 0 ? 'down' : ''}`}>
            {diff > 0
              ? `📈 +${diff.toFixed(2)} ${t('test.result.vsLast')}`
              : diff < 0
                ? `📉 ${diff.toFixed(2)} ${t('test.result.vsLast')}`
                : t('test.result.sameAsLast')}
          </div>
        )}

        <div className="tr-stats">
          <div className="tr-stat ok">
            <div className="tr-stat-num">{score.correct}</div>
            <div className="tr-stat-label">{t('test.result.correct')}</div>
          </div>
          <div className="tr-stat err">
            <div className="tr-stat-num">{score.wrong}</div>
            <div className="tr-stat-label">{t('test.result.wrong')}</div>
          </div>
          <div className="tr-stat">
            <div className="tr-stat-num">{score.blank}</div>
            <div className="tr-stat-label">{t('test.result.blank')}</div>
          </div>
        </div>

        <div className="tr-meta">
          <span><span aria-hidden>⏱</span> {formatMMSS(durationSec)}</span>
          {avgPerQuestion > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{avgPerQuestion.toFixed(1)}s {t('test.result.perQuestion')}</span>
            </>
          )}
        </div>
        <div className="tr-formula">
          {t('test.result.formula').replace('{raw}', score.raw.toFixed(2))}
        </div>
      </div>

      {/* Logros nous desbloquejats */}
      {state.newAchievements.length > 0 && (
        <div className="tr-achievements">
          <div className="tr-achievements-head">🎉 {t('test.result.unlockedTitle')}</div>
          {state.newAchievements.map((a) => (
            <div key={a.id} className="tr-achievement-item">
              <span className="tr-achievement-icon" aria-hidden>{a.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div className="tr-achievement-title">{a.title}</div>
                <div className="tr-achievement-desc">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Llistat de correcció */}
      <div className="tr-review">
        <div className="tr-review-head">📋 Correcció</div>
        {state.questions.map((q, i) => {
          const ans = state.answers[i];
          const isCorrect = ans === q.correctIndex;
          const isBlank = ans === null;
          const cls = isBlank ? 'blank' : isCorrect ? 'ok' : 'err';
          return (
            <div key={q.question.id} className={`tr-review-item ${cls}`}>
              <span className="tr-review-icon" aria-hidden>
                {isBlank ? '⚪' : isCorrect ? '✅' : '❌'}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <TopicBadge question={q.question} compact />
                <div className="tr-review-q">{i + 1}. {q.question.text}</div>
                {!isCorrect && !isBlank && (
                  <div className="tr-review-line wrong">
                    {t('test.result.yourAnswer')}:{' '}
                    <span className="badge">{String.fromCharCode(65 + (ans ?? 0))}</span>
                    {q.options[ans ?? 0]}
                  </div>
                )}
                <div className="tr-review-line right">
                  {t('test.result.correctAnswer')}:{' '}
                  <span className="badge">{String.fromCharCode(65 + q.correctIndex)}</span>
                  {q.options[q.correctIndex]}
                </div>
                {q.question.reference && (
                  <div className="tr-review-ref">📖 {q.question.reference}</div>
                )}
                <ReportQuestionButton
                  topicSlug={(q.question as TestQuestion & { topicSlug?: string }).topicSlug || slug}
                  questionId={q.question.id}
                  questionText={q.question.text}
                  markedCorrect={q.options[q.correctIndex]}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Accions */}
      <div className="tr-actions">
        <button
          type="button"
          onClick={onRestart}
          className="ts-btn ts-btn-primary"
        >
          🔁 {t('test.result.another')}
        </button>
        <Link to={corpsRoot} className="ts-btn">
          {t('test.result.backToList')}
        </Link>
        <span className="hidden">{slug}{isAll ? 'all' : ''}</span>
      </div>
    </div>
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
