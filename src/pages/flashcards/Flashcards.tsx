// Flashcards · cartes per estudiar les preguntes dels tests sense
// haver de fer un test sencer.
//
// Dos modes en una sola pàgina:
//   1. PICKER — quan no hi ha :slug a la URL: graella amb tots els
//      temes del cos (Policia Local o Mossos), per triar quin estudiar.
//   2. RUNNER — quan hi ha :slug: mostra les preguntes del tema com
//      a cartes. Click a la carta = flip per veure la resposta correcta.
//      Navegació prev/següent + barreja + reset.
//
// Rutes:
//   /policia-local/flashcards               → picker PL
//   /policia-local/flashcards/:slug         → runner PL del tema
//   /mossos/flashcards                      → picker Mossos
//   /mossos/flashcards/:slug                → runner Mossos del tema
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { TOPICS, getTopic } from '../../data/tests';
import { shuffle, shuffleQuestion, type ShuffledQuestion } from '../../lib/testRunner';
import { useT } from '../../lib/i18n';
import type { TestTopic } from '../../data/tests/types';

function accentToColors(accent: string): { c: string; bg: string } {
  const m = accent.match(/from-([a-z]+)-/);
  const color = m ? m[1] : 'slate';
  const map: Record<string, { c: string; bg: string }> = {
    amber: { c: '#9c7a1f', bg: '#FFF1D2' },
    yellow: { c: '#9c7a1f', bg: '#FFF8E0' },
    red: { c: '#C13030', bg: '#FFE4E4' },
    rose: { c: '#C13030', bg: '#FFE4E4' },
    pink: { c: '#C13030', bg: '#FFE4EE' },
    orange: { c: '#D9531A', bg: '#FFE4D2' },
    blue: { c: '#2F6BD8', bg: '#EAF1FE' },
    sky: { c: '#2F6BD8', bg: '#EAF6FE' },
    indigo: { c: '#4338CA', bg: '#E7E5FE' },
    violet: { c: '#7C3AED', bg: '#EFE5FE' },
    purple: { c: '#9747D6', bg: '#F5E9FF' },
    fuchsia: { c: '#A21CAF', bg: '#FCE7FA' },
    emerald: { c: '#0E8A6F', bg: '#E1F4EE' },
    green: { c: '#1f8a4d', bg: '#DFF7E9' },
    teal: { c: '#0E8A8A', bg: '#E1F4F4' },
    slate: { c: '#475569', bg: '#EEF2F6' },
    gray: { c: '#475569', bg: '#EEF2F6' },
    stone: { c: '#57534E', bg: '#F1EFEC' },
  };
  return map[color] ?? map.slate;
}

export default function Flashcards() {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const isMossosRoute = location.pathname.startsWith('/mossos');
  const corpsRoot = isMossosRoute ? '/mossos' : '/policia-local';
  const corpsLabel = isMossosRoute ? "Mossos d'Esquadra" : 'Policia Local';

  if (!slug) return <FlashcardsPicker isMossosRoute={isMossosRoute} corpsRoot={corpsRoot} corpsLabel={corpsLabel} />;
  return <FlashcardsRunner slug={slug} corpsRoot={corpsRoot} corpsLabel={corpsLabel} />;
}

// ─── PICKER ──────────────────────────────────────────────────────
function FlashcardsPicker({
  isMossosRoute,
  corpsRoot,
  corpsLabel,
}: {
  isMossosRoute: boolean;
  corpsRoot: string;
  corpsLabel: string;
}) {
  const { t } = useT();
  const topics = useMemo(
    () =>
      TOPICS.filter((tp) =>
        isMossosRoute ? tp.category === 'mossos' : (tp.category ?? 'temari') !== 'mossos',
      ),
    [isMossosRoute],
  );

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to={corpsRoot}>{corpsLabel}</Link>
        <span className="sep">/</span>
        <span className="here">{t('flashcards.title')}</span>
      </nav>

      <header className="ts-hero">
        <div className="eyebrow">🃏 {t('flashcards.eyebrow')}</div>
        <h1>
          {t('flashcards.heroA')}<br />
          {t('flashcards.heroB')}
        </h1>
        <p className="lead">{t('flashcards.lead')}</p>
      </header>

      <div
        className="section-head"
        style={{ ['--accent' as never]: '#9c7a1f', marginTop: 24 } as React.CSSProperties}
      >
        <span className="eyebrow">📚 {t('flashcards.pick')}</span>
        <span className="rule" />
      </div>

      <section className="test-grid">
        {topics.map((topic) => {
          const colors = accentToColors(topic.accent);
          return (
            <Link
              key={topic.slug}
              to={`${corpsRoot}/flashcards/${topic.slug}`}
              className="tcard"
              style={{
                ['--accent' as never]: colors.c,
                ['--accent-bg' as never]: colors.bg,
              } as React.CSSProperties}
            >
              <div className="head">
                <span className="ico" aria-hidden>{topic.icon}</span>
                <span className="lvl none">🃏 {topic.questions.length}</span>
              </div>
              <h4>{topic.title}</h4>
              {topic.description && <p>{topic.description}</p>}
              <div className="footer-row">
                <span className="start">{t('flashcards.start')} →</span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

// ─── RUNNER ──────────────────────────────────────────────────────
function FlashcardsRunner({
  slug,
  corpsRoot,
  corpsLabel,
}: {
  slug: string;
  corpsRoot: string;
  corpsLabel: string;
}) {
  const { t } = useT();
  const topic: TestTopic | undefined = getTopic(slug);

  // Cartes barrejades (preguntes en ordre aleatori, opcions també).
  const [deck, setDeck] = useState<ShuffledQuestion[]>(() =>
    topic ? shuffle(topic.questions).map(shuffleQuestion) : [],
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Reseteja el revealed al canviar de carta.
  useEffect(() => {
    setRevealed(false);
  }, [index]);

  // Atajos de teclat: ← → per navegar, espai/enter per flip.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(deck.length - 1, i + 1));
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealed((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deck.length]);

  if (!topic) {
    return (
      <div className="shell py-10">
        <p className="text-text-2">{t('test.notFound')}</p>
        <Link to={`${corpsRoot}/flashcards`} className="text-sm font-bold text-ink underline mt-3 inline-block">
          ← {t('flashcards.backToPicker')}
        </Link>
      </div>
    );
  }

  const total = deck.length;
  const card = deck[index];
  const colors = accentToColors(topic.accent);

  function reshuffle() {
    setDeck(shuffle(topic!.questions).map(shuffleQuestion));
    setIndex(0);
    setRevealed(false);
  }

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to={corpsRoot}>{corpsLabel}</Link>
        <span className="sep">/</span>
        <Link to={`${corpsRoot}/flashcards`}>{t('flashcards.title')}</Link>
        <span className="sep">/</span>
        <span className="here truncate">{topic.title}</span>
      </nav>

      {/* Header del tema */}
      <header className="flex items-center gap-3 mt-4 mb-3">
        <span className="text-3xl" aria-hidden>{topic.icon}</span>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink truncate">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-sm text-text-2 truncate">{topic.description}</p>
          )}
        </div>
      </header>

      {/* Progrés numèric */}
      <div className="flex items-center justify-between mb-3 text-sm font-bold text-text-2">
        <span>
          {index + 1} <span className="text-text-3">/ {total}</span>
        </span>
        <button
          type="button"
          onClick={reshuffle}
          className="text-xs font-semibold uppercase tracking-wide text-ink underline underline-offset-4"
        >
          🔀 {t('flashcards.shuffle')}
        </button>
      </div>

      {/* Barra de progrés visual */}
      <div className="h-1.5 rounded-full bg-line mb-5 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{
            width: `${((index + 1) / total) * 100}%`,
            background: colors.c,
          }}
        />
      </div>

      {/* La carta */}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-pressed={revealed}
        className="fc-card"
        style={{
          ['--accent' as never]: colors.c,
          ['--accent-bg' as never]: colors.bg,
        } as React.CSSProperties}
      >
        <div className="fc-side fc-question">
          <span className="fc-tag">PREGUNTA</span>
          <p className="fc-text">{card.question.text}</p>
          {!revealed && (
            <span className="fc-hint">{t('flashcards.flipHint')}</span>
          )}
        </div>

        {revealed && (
          <div className="fc-side fc-answer">
            <span className="fc-tag good">RESPOSTA</span>
            <ul className="fc-options">
              {card.options.map((opt, i) => {
                const isCorrect = i === card.correctIndex;
                return (
                  <li key={i} className={isCorrect ? 'opt correct' : 'opt'}>
                    <span className="opt-letter">
                      {isCorrect ? '✓' : ''}
                    </span>
                    <span className="opt-text">{opt}</span>
                  </li>
                );
              })}
            </ul>
            {card.question.reference && (
              <p className="fc-ref">📖 {card.question.reference}</p>
            )}
          </div>
        )}
      </button>

      {/* Controls */}
      <div className="fc-controls">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="fc-btn"
        >
          ← {t('flashcards.prev')}
        </button>
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="fc-btn primary"
        >
          {revealed ? t('flashcards.hide') : t('flashcards.reveal')}
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          disabled={index === total - 1}
          className="fc-btn"
        >
          {t('flashcards.next')} →
        </button>
      </div>
    </div>
  );
}
