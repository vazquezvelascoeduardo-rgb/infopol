// Pàgina de resultats de cerca.
import { Link, useSearchParams } from 'react-router-dom';
import { MODULES, searchCards } from '../lib/content';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const results = q ? searchCards(q) : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-amber-500 dark:bg-amber-400" />
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
          Resultats
        </h1>
      </div>
      <p className="mt-2 text-lg">
        <span className="text-slate-500 dark:text-slate-400">Cerca:</span>{' '}
        <span className="font-semibold text-amber-600 dark:text-amber-400">“{q}”</span>
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
          {results.length === 0
            ? '· cap coincidència'
            : `· ${results.length} ${results.length === 1 ? 'resultat' : 'resultats'}`}
        </span>
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-2">
        {results.map((c) => {
          const mod = MODULES.find((m) => m.slug === c.moduleSlug);
          return (
            <li key={`${c.moduleSlug}/${c.slug}`}>
              <Link
                to={`/s/${c.moduleSlug}/${c.slug}`}
                className="group flex items-start gap-3 rounded-xl border px-4 py-3 transition
                  border-slate-200 bg-white hover:border-amber-400/60 hover:bg-amber-50/50
                  dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40 dark:hover:bg-[#13243e]"
              >
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ring-1
                    bg-slate-100 ring-slate-200
                    dark:bg-white/5 dark:ring-white/10"
                >
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400/80">
                    {mod?.title ?? c.moduleSlug}
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
    </div>
  );
}

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
