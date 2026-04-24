// Pàgina de resultats de cerca.
// Agafa el paràmetre `q` de la URL i mostra totes les fitxes que coincideixen.
import { Link, useSearchParams } from 'react-router-dom';
import { MODULES, searchCards } from '../lib/content';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const results = q ? searchCards(q) : [];

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Resultats per a <span className="text-blue-600 dark:text-blue-400">“{q}”</span>
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {results.length === 0
          ? 'Cap coincidència.'
          : `${results.length} ${results.length === 1 ? 'resultat' : 'resultats'}`}
      </p>

      <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {results.map((c) => {
          const mod = MODULES.find((m) => m.slug === c.moduleSlug);
          return (
            <li key={`${c.moduleSlug}/${c.slug}`}>
              <Link
                to={`/s/${c.moduleSlug}/${c.slug}`}
                className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {mod?.title ?? c.moduleSlug}
                </div>
                <div className="font-medium">{c.title}</div>
                <div
                  className="mt-0.5 text-sm text-slate-500 dark:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: snippet(c.body, q) }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Construeix un petit fragment amb el terme cercat ressaltat.
function snippet(body: string, q: string): string {
  const plain = body.replace(/\s+/g, ' ').trim();
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
    (m) => `<mark class="bg-yellow-200 dark:bg-yellow-500/40 rounded px-0.5">${m}</mark>`,
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
