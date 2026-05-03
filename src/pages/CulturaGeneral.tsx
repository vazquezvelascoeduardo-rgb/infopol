// Pàgina de Cultura General — directori d'estudi amb 7 matèries.
// Mateix patró que els directoris de /noticies (Personalitats, Esports,
// Premis): navegació ràpida sticky + cerca + seccions amb subseccions.
//
// Accessible des del menú lateral (no apareix a la pàgina d'inici).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import {
  CULTURA, CULTURA_UPDATED_AT, type CultSection,
} from '../lib/cultura-general';

export default function CulturaGeneral() {
  const { t } = useT();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const sections = q
    ? CULTURA.map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          entries: sub.entries.filter(
            (e) =>
              e.name.toLowerCase().includes(q)
              || e.position.toLowerCase().includes(q)
              || (e.detail ?? '').toLowerCase().includes(q),
          ),
        })).filter((sub) => sub.entries.length > 0),
      })).filter((sec) => sec.subsections.length > 0)
    : CULTURA;

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('cultura.title')}</span>
      </nav>

      {/* Capçalera */}
      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-violet-200/70 bg-gradient-to-br from-violet-50/60 via-white to-purple-50/40
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a0f2e] dark:to-[#0f1d34]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-3xl text-white shadow-inner">
            🎓
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-violet-700 dark:text-violet-400/90">
              {t('cultura.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('cultura.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('cultura.subtitle').replace('{date}', formatLongDate(CULTURA_UPDATED_AT))}
            </p>
          </div>
        </div>
      </header>

      {/* NAVEGACIÓ RÀPIDA — pills per saltar a cada matèria */}
      <nav className="sticky top-2 z-20 mb-4 rounded-2xl border p-3 backdrop-blur
        border-slate-200 bg-white/95
        dark:border-white/10 dark:bg-[#0f1d34]/95">
        <div className="flex items-center gap-2 mb-2">
          <span aria-hidden className="text-base">🧭</span>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
            {t('cultura.quickNav')}
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CULTURA.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition
                border-transparent bg-gradient-to-r ${sec.accent} text-white shadow-sm
                hover:shadow-md hover:-translate-y-0.5`}
            >
              <span aria-hidden>{sec.icon}</span>
              <span>{sec.shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Cerca */}
      <div className="mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('cultura.searchPlaceholder')}
          className="w-full rounded-xl border-2 px-4 py-2.5 text-sm
            border-slate-200 bg-white text-slate-800 placeholder-slate-400
            focus:border-violet-400 focus:outline-none
            dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-violet-400/40"
        />
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 dark:bg-white/5 p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>🔍</div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('cultura.empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sections.map((sec) => (
            <SectionView key={sec.id} sec={sec} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Render d'una secció (mateix shape que els altres directoris) ──
function SectionView({ sec }: { sec: CultSection }) {
  // Sub-nav inline: només mostrem si hi ha 2+ subseccions amb títol.
  const subsWithTitle = sec.subsections.filter((s) => s.title);
  const showInlineNav = subsWithTitle.length >= 2;

  function scrollToSubsection(secId: string, subIdx: number) {
    const el = document.getElementById(`${secId}-sub-${subIdx}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section
      id={sec.id}
      className="rounded-2xl border overflow-hidden scroll-mt-28
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
    >
      <header className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${sec.accent} text-white`}>
        <span aria-hidden className="text-2xl">{sec.icon}</span>
        <h2 className="font-black text-base sm:text-lg leading-tight">
          {sec.title}
        </h2>
      </header>

      {/* Sub-navegació inline (només quan hi ha 2+ subseccions) */}
      {showInlineNav && (
        <div className="px-4 py-3 border-b border-slate-200/70 dark:border-white/10
          bg-slate-50/50 dark:bg-white/5">
          <div className="flex flex-wrap gap-1.5">
            {sec.subsections.map((sub, i) => sub.title && (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSubsection(sec.id, i)}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition
                  border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:-translate-y-0.5
                  dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:border-white/30"
              >
                {sub.icon && <span aria-hidden>{sub.icon}</span>}
                <span className="truncate max-w-[200px]">{sub.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-200/70 dark:divide-white/10">
        {sec.subsections.map((sub, i) => (
          <div key={i} id={`${sec.id}-sub-${i}`} className="px-4 py-3 scroll-mt-32">
            {(sub.title || sub.icon) && (
              <div className="flex items-center gap-2 mb-2">
                {sub.icon && (
                  <span aria-hidden className="text-base">{sub.icon}</span>
                )}
                {sub.title && (
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">
                    {sub.title}
                  </div>
                )}
              </div>
            )}
            <ul className={sub.compact
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-1.5'
              : 'space-y-1.5'}>
              {sub.entries.map((e, j) => (
                <li key={j} className="rounded-lg border px-3 py-2 transition
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
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatLongDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}
