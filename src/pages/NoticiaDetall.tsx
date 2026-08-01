// Pàgina de detall d'una notícia · rebranding 2026.
// Crumbs + article amb stripe blau + hero image + cos format simple
// (## sub-títols, - llistes, > cites, **negreta**) + tags + relacionades.
import { Link, useParams } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useNoticia } from '../lib/noticiesRemote';
import { useSeo, SITE } from '../lib/seo';

const ACCENT = '#2F6BD8';
const ACCENT_BG = '#EAF1FE';

export default function NoticiaDetall() {
  const { slug = '' } = useParams();
  const { t } = useT();
  const { noticia, all } = useNoticia(slug);

  // SEO a mida de la notícia (títol, descripció, imatge i JSON-LD).
  useSeo(noticia ? {
    title: `${noticia.title} · InfoPol`,
    description: noticia.summary,
    image: noticia.image,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'NewsArticle',
      headline: noticia.title,
      datePublished: noticia.publishedAt,
      ...(noticia.image ? { image: [noticia.image] } : {}),
      description: noticia.summary,
      ...(noticia.source ? { author: { '@type': 'Organization', name: noticia.source } } : {}),
      publisher: { '@type': 'Organization', name: 'InfoPol', logo: { '@type': 'ImageObject', url: `${SITE}/pwa-512x512.png` } },
      mainEntityOfPage: `${SITE}/noticies/${noticia.slug}`,
    },
  } : { title: '' });

  if (!noticia) {
    return (
      <div className="v3-page v3-anim">
        <p className="text-text-2">{t('noticies.notFound')}</p>
        <Link to="/noticies" className="text-terracotta underline">
          ← {t('noticies.backToList')}
        </Link>
      </div>
    );
  }

  // Notícies relacionades: mateix mes (any-mes), excloent l'actual, max 3.
  const monthKey = noticia.publishedAt.slice(0, 7);
  const related = all
    .filter((n) => n.publishedAt.slice(0, 7) === monthKey && n.slug !== noticia.slug)
    .slice(0, 3);

  return (
    <div
      className="v3-page v3-anim"
      style={{
        ['--accent' as never]: ACCENT,
        ['--accent-bg' as never]: ACCENT_BG,
        maxWidth: 820,
      } as React.CSSProperties}
    >

      <article className="noticia-detall">
        <span className="nd-stripe" aria-hidden />

        {noticia.image && (
          <div className="nd-hero">
            <img
              src={noticia.image}
              alt={noticia.imageAlt ?? noticia.title}
              loading="eager"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="nd-body">
          <div className="nd-meta">
            <time className="nd-date">{formatDate(noticia.publishedAt)}</time>
            {noticia.source && (
              <>
                <span aria-hidden className="sep">·</span>
                <span className="nd-source">{noticia.source}</span>
              </>
            )}
          </div>

          <h1 className="nd-title">{noticia.title}</h1>
          <p className="nd-summary">{noticia.summary}</p>

          {noticia.sourceUrl && (
            <a
              href={noticia.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nd-source-cta"
            >
              <span className="nd-source-icon" aria-hidden>🔗</span>
              <div className="nd-source-text">
                <span className="nd-source-label">{t('noticies.externalSource')}</span>
                <span className="nd-source-url">{prettyUrl(noticia.sourceUrl)}</span>
              </div>
              <span className="nd-source-arr" aria-hidden>↗</span>
            </a>
          )}

          {/* Cos amb format lleuger */}
          <div className="nd-content">
            {renderBody(noticia.body)}
          </div>

          {/* Tags */}
          {noticia.tags && noticia.tags.length > 0 && (
            <div className="nd-tags">
              {noticia.tags.map((tg) => (
                <span key={tg} className="nd-tag">#{tg}</span>
              ))}
            </div>
          )}

          {/* Enllaç a fitxa interna */}
          {noticia.linkedTo && (
            <Link
              to={`/leyes/s/${noticia.linkedTo.moduleSlug}/${noticia.linkedTo.slug}`}
              className="nd-linked"
            >
              <span aria-hidden>📖</span>
              <span>{t('noticies.linkedTo')}</span>
              <span className="arr" aria-hidden>→</span>
            </Link>
          )}
        </div>
      </article>

      {/* Relacionades */}
      {related.length > 0 && (
        <section className="nd-related">
          <div
            className="section-head"
            style={{ ['--accent' as never]: ACCENT } as React.CSSProperties}
          >
            <span className="eyebrow">📰 {t('noticies.related')}</span>
            <span className="rule" />
          </div>
          <ul className="nd-related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to={`/noticies/${encodeURIComponent(r.slug)}`}
                  className="nd-related-card"
                >
                  <span className="rc-date">{formatDate(r.publishedAt)}</span>
                  <span className="rc-title">{r.title}</span>
                  <span className="rc-arr" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="page-foot">
        <Link to="/noticies" className="btn btn-ghost">
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
        <ul key={`list-${out.length}`}>
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
    if (lines.every((l) => l.trim().startsWith('- '))) {
      lines.forEach((l) => listBuffer.push(l.trim().slice(2)));
      flushList();
      return;
    }
    flushList();

    if (lines[0].startsWith('## ')) {
      out.push(<h2 key={idx}>{lines[0].slice(3)}</h2>);
      const rest = lines.slice(1).join(' ').trim();
      if (rest) {
        out.push(<p key={`${idx}-p`}>{renderInline(rest)}</p>);
      }
      return;
    }

    if (lines.every((l) => l.trim().startsWith('> '))) {
      const text = lines.map((l) => l.trim().slice(2)).join(' ');
      out.push(<blockquote key={idx}>{renderInline(text)}</blockquote>);
      return;
    }

    const text = lines.join(' ').trim();
    if (text) {
      out.push(<p key={idx}>{renderInline(text)}</p>);
    }
  });

  flushList();
  return out;
}

function renderInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={i++}>{m[1]}</strong>);
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

function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 30 ? u.pathname.slice(0, 28) + '…' : u.pathname;
    return u.host + path;
  } catch {
    return url;
  }
}
