// Pàgina de resultats de cerca.
import { Link, useSearchParams } from 'react-router-dom';
import { MODULES, searchCards } from '../lib/content';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const results = q ? searchCards(q) : [];

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-amber-400" />
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
          Resultats
        </h1>
      </div>
      <p className="mt-2 text-lg text-slate-100">
        <span className="text-slate-400">Cerca:</span>{' '}
        <span className="font-semibold text-amber-400">“{q}”</span>
        <span className="ml-2 text-sm text-slate-400">
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
                className="group block rounded-xl border border-white/10 bg-[#0f1d34] px-4 py-3 hover:border-amber-400/40 hover:bg-[#13243e] transition"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80">
                  {mod?.title ?? c.moduleSlug}
                </div>
                <div className="font-semibold text-slate-100">{c.title}</div>
                <div
                  className="mt-1 text-sm text-slate-400"
                  dangerouslySetInnerHTML={{ __html: snippet(c.searchText, q) }}
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
    (m) => `<mark class="bg-amber-300/30 text-amber-100 rounded px-0.5">${m}</mark>`,
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
