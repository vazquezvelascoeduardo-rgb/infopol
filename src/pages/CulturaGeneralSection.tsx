// Pàgina d'una matèria de Cultura General (independent).
// Mostra una sola secció amb el seu sub-nav, cerca i contingut.
//
// URL: /cultura-general/:id (ex: /cultura-general/invents)
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../lib/i18n';
import {
  CULTURA, type CultSubsection, type CultEntry,
} from '../lib/cultura-general';

export default function CulturaGeneralSection() {
  const { t } = useT();
  const { id = '' } = useParams();
  const [query, setQuery] = useState('');

  const section = CULTURA.find((s) => s.id === id);

  // Si no existeix la matèria → not found.
  if (!section) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          <Link to="/" className="hover:underline">{t('nav.home')}</Link>
          <span className="mx-2" aria-hidden>/</span>
          <Link to="/cultura-general" className="hover:underline">{t('cultura.title')}</Link>
        </nav>
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 dark:bg-white/5 p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>🤔</div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            {t('cultura.sectionNotFound')}
          </p>
          <Link to="/cultura-general" className="inline-block text-sm font-semibold text-violet-700 dark:text-violet-400 hover:underline">
            ← {t('cultura.backToIndex')}
          </Link>
        </div>
      </div>
    );
  }

  // Filtre de cerca dins d'aquesta matèria.
  const q = query.trim().toLowerCase();
  const subsections: CultSubsection[] = q
    ? section.subsections.map((sub) => ({
        ...sub,
        entries: sub.entries.filter(
          (e) =>
            e.name.toLowerCase().includes(q)
            || e.position.toLowerCase().includes(q)
            || (e.detail ?? '').toLowerCase().includes(q),
        ),
      })).filter((sub) => sub.entries.length > 0)
    : section.subsections;

  function scrollToSubsection(subIdx: number) {
    const el = document.getElementById(`sub-${subIdx}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/cultura-general" className="hover:underline">{t('cultura.title')}</Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{section.title}</span>
      </nav>

      {/* Capçalera amb gradient propi de la matèria */}
      <header className={`rounded-2xl p-5 sm:p-6 mb-5 text-white shadow-md
        bg-gradient-to-br ${section.accent}`}>
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-inner">
            {section.icon}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold opacity-80">
              {t('cultura.materia')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {section.title}
            </h1>
            <p className="mt-1.5 text-sm opacity-90 leading-relaxed">
              {section.subsections.length} {t('cultura.subsectionsLabel')} · {section.subsections.reduce((acc, sub) => acc + sub.entries.length, 0)} {t('cultura.entriesLabel')}
            </p>
          </div>
        </div>
      </header>

      {/* SUB-NAV STICKY — pills per saltar a cada subsecció dins la matèria */}
      {section.subsections.length >= 2 && (
        <nav className="sticky top-2 z-20 mb-4 rounded-2xl border p-3 backdrop-blur
          border-slate-200 bg-white/95
          dark:border-white/10 dark:bg-[#0f1d34]/95">
          <div className="flex items-center gap-2 mb-2">
            <span aria-hidden className="text-base">🧭</span>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
              {t('cultura.subQuickNav')}
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {section.subsections.map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSubsection(i)}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition
                  border-transparent bg-gradient-to-r ${section.accent} text-white shadow-sm
                  hover:shadow-md hover:-translate-y-0.5`}
              >
                {sub.icon && <span aria-hidden>{sub.icon}</span>}
                <span className="truncate max-w-[180px]">{sub.title ?? `${t('cultura.section')} ${i + 1}`}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Cerca */}
      <div className="mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('cultura.searchInMateria').replace('{materia}', section.title)}
          className="w-full rounded-xl border-2 px-4 py-2.5 text-sm
            border-slate-200 bg-white text-slate-800 placeholder-slate-400
            focus:border-violet-400 focus:outline-none
            dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-violet-400/40"
        />
      </div>

      {/* Contingut: subseccions */}
      {subsections.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 dark:bg-white/5 p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>🔍</div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('cultura.empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subsections.map((sub, i) => (
            <SubsectionView
              key={i}
              sub={sub}
              index={i}
              accent={section.accent}
            />
          ))}
        </div>
      )}

      {/* Tornar a l'índex */}
      <div className="mt-6">
        <Link
          to="/cultura-general"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-700 dark:hover:text-violet-300"
        >
          ← {t('cultura.backToIndex')}
        </Link>
      </div>

      {/* Navegació a altres matèries (peu) */}
      <OtherSubjectsNav currentId={section.id} />
    </div>
  );
}

// ── Render d'una subsecció ──
function SubsectionView({
  sub, index, accent,
}: {
  sub: CultSubsection;
  index: number;
  accent: string;
}) {
  return (
    <section
      id={`sub-${index}`}
      className="rounded-2xl border overflow-hidden scroll-mt-32
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/70 dark:border-white/10
        bg-slate-50/50 dark:bg-white/5">
        {sub.icon && (
          <span aria-hidden className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-base text-white shadow-inner`}>
            {sub.icon}
          </span>
        )}
        {sub.title && (
          <h2 className="font-black text-sm sm:text-base tracking-tight">
            {sub.title}
          </h2>
        )}
        <span className="ml-auto rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
          {sub.entries.length}
        </span>
      </header>
      <ul className={sub.compact
        ? 'p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5'
        : 'p-3 space-y-1.5'}>
        {sub.entries.map((e, j) => (
          <EntryItem key={j} entry={e} />
        ))}
      </ul>
    </section>
  );
}

function EntryItem({ entry: e }: { entry: CultEntry }) {
  return (
    <li className="rounded-lg border px-3 py-2 transition
      border-slate-200/70 bg-slate-50/40 hover:border-slate-300
      dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10">
      <div className="flex items-start gap-3">
        {e.flag && (
          <span
            aria-hidden
            className="shrink-0 inline-flex h-9 w-11 items-center justify-center rounded-md text-2xl select-none
              bg-white border border-slate-200/70
              dark:bg-white/10 dark:border-white/10"
          >
            {e.flag}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 leading-tight">
            {e.position}
          </div>
          <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug mt-0.5">
            {e.name}
          </div>
          {e.detail && (
            <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
              {e.detail}
            </div>
          )}
        </div>
        {e.recent && (
          <span className="shrink-0 self-start rounded-full bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider inline-flex items-center gap-1">
            <span aria-hidden>⭐</span>
            Clau
          </span>
        )}
      </div>
    </li>
  );
}

// ── Navegació a altres matèries (peu) ──
function OtherSubjectsNav({ currentId }: { currentId: string }) {
  const { t } = useT();
  const others = CULTURA.filter((s) => s.id !== currentId);
  if (others.length === 0) return null;
  return (
    <section className="mt-8 rounded-2xl border p-4
      border-slate-200 bg-slate-50/50
      dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden className="text-base">🎓</span>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
          {t('cultura.otherSubjects')}
        </h3>
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {others.map((s) => (
          <li key={s.id}>
            <Link
              to={`/cultura-general/${encodeURIComponent(s.id)}`}
              className={`group relative block rounded-lg border-2 px-3 py-2 transition
                border-transparent bg-gradient-to-r ${s.accent} text-white text-xs font-semibold shadow-sm
                hover:shadow-md hover:-translate-y-0.5`}
            >
              <span aria-hidden className="mr-1.5">{s.icon}</span>
              {s.shortLabel}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
