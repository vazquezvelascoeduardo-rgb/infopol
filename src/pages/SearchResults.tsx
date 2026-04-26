// Pàgina de resultats de cerca.
// Cerca a 2 corpus diferents:
//   1) LLEIS — fitxes HTML/MD del temari (mòdul Lleis)
//   2) OPERATIVA — checklists interactius de Trànsit i Penal
// Els resultats es mostren en seccions separades, amb Operativa
// primer (sol ser el que un agent vol trobar abans).
import { Link, useSearchParams } from 'react-router-dom';
import { MODULES, searchCards } from '../lib/content';
import { searchOperativa, type OpSearchResult } from '../lib/operativa-search';
import { plural, useT } from '../lib/i18n';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const leyesResults = q ? searchCards(q) : [];
  const opResults = q ? searchOperativa(q) : [];
  const totalResults = leyesResults.length + opResults.length;
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-amber-500 dark:bg-amber-400" />
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
          {t('search.resultsLabel')}
        </h1>
      </div>
      <p className="mt-2 text-lg">
        <span className="text-slate-500 dark:text-slate-400">{t('search.query')}</span>{' '}
        <span className="font-semibold text-amber-600 dark:text-amber-400">“{q}”</span>
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
          {totalResults === 0
            ? `· ${t('search.none')}`
            : `· ${totalResults} ${plural(t, totalResults, 'results')}`}
        </span>
      </p>

      {/* OPERATIVA — checklists interactius (Tràfic + Penal) */}
      {opResults.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            <span aria-hidden>🚨</span> {t('search.operativaSection')}
            <span className="font-mono text-[10px] opacity-70">({opResults.length})</span>
          </h2>
          <ul className="grid grid-cols-1 gap-2">
            {opResults.map((r) => (
              <OperativaResultCard key={`${r.module}/${r.scenarioId}`} result={r} q={q} />
            ))}
          </ul>
        </section>
      )}

      {/* LLEIS — fitxes del temari */}
      {leyesResults.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            <span aria-hidden>⚖️</span> {t('search.leyesSection')}
            <span className="font-mono text-[10px] opacity-70">({leyesResults.length})</span>
          </h2>
          <ul className="grid grid-cols-1 gap-2">
            {leyesResults.map((c) => {
              const mod = MODULES.find((m) => m.slug === c.moduleSlug);
              const modTitle = mod ? t(`module.${mod.slug}.title`) : c.moduleSlug;
              return (
                <li key={`${c.moduleSlug}/${c.slug}`}>
                  <Link
                    to={`/leyes/s/${c.moduleSlug}/${c.slug}`}
                    className="group flex items-start gap-3 rounded-xl border px-4 py-3 transition
                      border-slate-200 bg-white hover:border-amber-400/60 hover:bg-slate-50
                      dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40 dark:hover:bg-[#13243e]"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ring-1
                        bg-slate-50 ring-slate-200
                        dark:bg-white/5 dark:ring-white/10"
                    >
                      {c.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400/80">
                        {modTitle}
                      </div>
                      <div className="font-semibold">{c.title}</div>
                      <div
                        className="mt-1 text-sm text-slate-500 dark:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: snippet(c.searchText, q) }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

// ── Card per a un resultat de l'Operativa (Trànsit o Penal) ─────────

function OperativaResultCard({ result, q }: { result: OpSearchResult; q: string }) {
  const { t } = useT();
  const moduleLabel =
    result.module === 'trafico'
      ? t('operativa.trafico.title')
      : t('operativa.seguretat-ciutadana.title');
  const moduleColor =
    result.module === 'trafico' ? '#f59e0b' : (result.blocColor ?? '#3b82f6');

  return (
    <li>
      <Link
        to={result.url}
        className="group block rounded-xl border p-4 transition
          border-slate-200 bg-white hover:border-blue-400/60
          dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
        style={{ borderLeft: `4px solid ${moduleColor}` }}
      >
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-bold text-white"
            style={{ backgroundColor: moduleColor }}
          >
            {moduleLabel}
          </span>
          {result.blocLabel && (
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
              {result.blocLabel}
            </span>
          )}
        </div>
        <div className="font-bold">{stripEmoji(result.scenarioTitle)}</div>

        {/* Hits — fragments coincidents */}
        <ul className="mt-2 space-y-1.5 text-sm">
          {result.hits.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-0.5 inline-block shrink-0 rounded text-[9px] uppercase tracking-wider font-mono px-1 py-0.5
                  bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
              >
                {prettifyField(h.field)}
              </span>
              <span
                className="text-slate-600 dark:text-slate-300 flex-1"
                dangerouslySetInnerHTML={{ __html: highlight(h.snippet, q) }}
              />
            </li>
          ))}
        </ul>

        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100">
          {t('search.openChecklist')} →
        </div>
      </Link>
    </li>
  );
}

// Etiquetes humanes per al "field" d'origen del hit.
const FIELD_PRETTY: Record<string, string> = {
  titol: 'TÍTOL',
  text: 'PREGUNTA',
  info: 'INFO',
  concepte_butlleta: 'CONCEPTE',
  article_butlleta: 'ARTICLE',
  pena: 'PENA',
  base_legal: 'BASE LEGAL',
  accions_ordenades: 'ACTUACIONS',
  accions_operatives: 'ACTUACIONS',
  accions_ordenades_critiques: 'CRÍTICS',
  drets_informar_conductor: 'DRETS',
  documentacio: 'DOCUMENTACIÓ',
  documentacio_clau: 'DOC CLAU',
  principi_clau: 'PRINCIPI',
  descripcio: 'DESCRIPCIÓ',
  import: 'MULTA',
  punts: 'PUNTS',
};

function prettifyField(field: string): string {
  return (
    FIELD_PRETTY[field] ?? field.toUpperCase().replace(/_/g, ' ').slice(0, 16)
  );
}

const EMOJI_RE = /^([\p{Extended_Pictographic}\u{200D}️]+)\s*/u;
function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, '').trim();
}

// ── Helpers per highlight ───────────────────────────────────────────

function snippet(text: string, q: string): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  const re = new RegExp(escapeRegExp(q), 'i');
  const idx = plain.search(re);
  if (idx < 0) return escapeHtml(plain.slice(0, 140)) + (plain.length > 140 ? '…' : '');
  const start = Math.max(0, idx - 40);
  const end = Math.min(plain.length, idx + q.length + 80);
  const slice = plain.slice(start, end);
  const before = start > 0 ? '…' : '';
  const after = end < plain.length ? '…' : '';
  const highlighted = escapeHtml(slice).replace(
    new RegExp(escapeRegExp(escapeHtml(q)), 'ig'),
    (m) =>
      `<mark class="rounded px-0.5 bg-amber-200/80 text-amber-900 dark:bg-amber-300/30 dark:text-amber-100">${m}</mark>`,
  );
  return before + highlighted + after;
}

function highlight(text: string, q: string): string {
  if (!q) return escapeHtml(text);
  return escapeHtml(text).replace(
    new RegExp(escapeRegExp(escapeHtml(q)), 'ig'),
    (m) =>
      `<mark class="rounded px-0.5 bg-amber-200/80 text-amber-900 dark:bg-amber-300/30 dark:text-amber-100">${m}</mark>`,
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
