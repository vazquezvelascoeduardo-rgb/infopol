// Pàgina de detall d'una notícia. Renderitza el cos amb format simple
// (paràgrafs, sub-títols ##, llistes -, citacions >).
import { Link, useParams } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { getNoticia, NOTICIES } from '../lib/noticies';

export default function NoticiaDetall() {
  const { slug = '' } = useParams();
  const { t } = useT();
  const noticia = getNoticia(slug);

  if (!noticia) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">{t('noticies.notFound')}</p>
        <Link to="/noticies" className="text-blue-600 dark:text-blue-400 underline">
          {t('noticies.backToList')}
        </Link>
      </div>
    );
  }

  // Notícies relacionades: mateix mes (any-mes), excloent l'actual, max 3.
  const monthKey = noticia.publishedAt.slice(0, 7);
  const related = NOTICIES
    .filter((n) => n.publishedAt.slice(0, 7) === monthKey && n.slug !== noticia.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/noticies" className="hover:underline">{t('noticies.title')}</Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 truncate">{noticia.title}</span>
      </nav>

      <article className="rounded-2xl border overflow-hidden
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        {/* Hero image (si la notícia en porta) */}
        {noticia.image && (
          <div className="relative w-full aspect-[16/9] bg-slate-100 dark:bg-white/5 overflow-hidden">
            <img
              src={noticia.image}
              alt={noticia.imageAlt ?? noticia.title}
              loading="eager"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
              }}
            />
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-700" />
          </div>
        )}

        <div className="p-5 sm:p-7">
        {/* Cabecera amb metadades */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-wider mb-3">
          <time className="font-mono text-slate-500 dark:text-slate-400">
            {formatDate(noticia.publishedAt)}
          </time>
          {noticia.source && (
            <>
              <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {noticia.source}
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-3">
          {noticia.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-snug font-medium border-l-4 border-blue-400 dark:border-blue-500/60 pl-4 py-1 mb-5">
          {noticia.summary}
        </p>

        {/* CTA — font original destacada (al cim, sota el resum) */}
        {noticia.sourceUrl && (
          <a
            href={noticia.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border-2 p-3 mb-5 transition
              border-blue-200 bg-blue-50 hover:border-blue-400 hover:shadow-md
              dark:border-blue-400/30 dark:bg-blue-500/10 dark:hover:border-blue-400/60"
          >
            <span aria-hidden className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 text-base text-white shadow-inner">
              🔗
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-blue-800 dark:text-blue-200">
                {t('noticies.externalSource')}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                {prettyUrl(noticia.sourceUrl)}
              </div>
            </div>
            <span aria-hidden className="shrink-0 text-blue-700 dark:text-blue-300 group-hover:translate-x-1 transition">↗</span>
          </a>
        )}

        {/* Cos amb format lleuger */}
        <div className="prose-content text-slate-800 dark:text-slate-200 leading-relaxed">
          {renderBody(noticia.body)}
        </div>

        {/* Tags */}
        {noticia.tags && noticia.tags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap gap-1.5">
            {noticia.tags.map((tg) => (
              <span key={tg}
                className="rounded-md border px-2 py-0.5 text-[11px] font-mono
                  border-slate-200 bg-slate-50 text-slate-600
                  dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                #{tg}
              </span>
            ))}
          </div>
        )}

        {/* Enllaç a fitxa interna */}
        {noticia.linkedTo && (
          <Link
            to={`/leyes/s/${noticia.linkedTo.moduleSlug}/${noticia.linkedTo.slug}`}
            className="mt-3 block rounded-xl border-2 p-3 text-sm transition
              border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100/60
              dark:border-amber-400/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
          >
            <span className="font-bold text-amber-800 dark:text-amber-200">
              📖 {t('noticies.linkedTo')}
            </span>
            <span aria-hidden className="ml-2">→</span>
          </Link>
        )}
        </div>
      </article>

      {/* Notícies relacionades */}
      {related.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
              {t('noticies.related')}
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
          </div>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to={`/noticies/${encodeURIComponent(r.slug)}`}
                  className="block rounded-xl border p-3 transition
                    border-slate-200 bg-white hover:border-blue-300
                    dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
                >
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400 mb-0.5">
                    {formatDate(r.publishedAt)}
                  </div>
                  <div className="font-bold text-sm leading-snug">
                    {r.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6">
        <Link
          to="/noticies"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          ← {t('noticies.backToList')}
        </Link>
      </div>
    </div>
  );
}

/**
 * Render bàsic del cos. Reconeix:
 *   "## "  → sub-títol
 *   "- "   → element de llista
 *   "> "   → citació destacada
 *   "**…**" → negreta
 *   text normal → paràgraf
 * Línies en blanc separen blocs.
 */
function renderBody(body: string): JSX.Element[] {
  const blocks = body.split(/\n\n+/);
  const out: JSX.Element[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length > 0) {
      out.push(
        <ul key={`list-${out.length}`} className="my-3 space-y-1.5 list-disc pl-5">
          {listBuffer.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  blocks.forEach((block, idx) => {
    const lines = block.split(/\n/);
    // Llista: TOTES les línies comencen amb "- ".
    if (lines.every((l) => l.trim().startsWith('- '))) {
      lines.forEach((l) => listBuffer.push(l.trim().slice(2)));
      flushList();
      return;
    }
    flushList();

    // Sub-títol: comença amb "## ".
    if (lines[0].startsWith('## ')) {
      out.push(
        <h2 key={idx} className="mt-5 mb-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
          {lines[0].slice(3)}
        </h2>
      );
      // Resta del bloc com a paràgraf normal.
      const rest = lines.slice(1).join(' ').trim();
      if (rest) {
        out.push(
          <p key={`${idx}-p`} className="my-2.5 leading-relaxed">
            {renderInline(rest)}
          </p>
        );
      }
      return;
    }

    // Citació: TOTES les línies comencen amb "> ".
    if (lines.every((l) => l.trim().startsWith('> '))) {
      const text = lines.map((l) => l.trim().slice(2)).join(' ');
      out.push(
        <blockquote key={idx} className="my-4 border-l-4 border-blue-400 dark:border-blue-500/70 bg-blue-50/40 dark:bg-blue-500/10 pl-4 pr-3 py-2 italic text-slate-700 dark:text-slate-300 rounded-r-lg">
          {renderInline(text)}
        </blockquote>
      );
      return;
    }

    // Paràgraf normal (joining lines with espai).
    const text = lines.join(' ').trim();
    if (text) {
      out.push(
        <p key={idx} className="my-2.5 leading-relaxed">
          {renderInline(text)}
        </p>
      );
    }
  });

  flushList();
  return out;
}

/** Render inline: només **negreta** per simplicitat. */
function renderInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={i++} className="font-bold text-slate-900 dark:text-slate-100">{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

/** Mostra un URL net per al CTA de font (ex: "boe.es/buscar/..."). */
function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 30 ? u.pathname.slice(0, 28) + '…' : u.pathname;
    return u.host + path;
  } catch {
    return url;
  }
}
