// Pàgina d'una fitxa concreta · rebranding 2026.
// Chrome estilitzat (crumbs + page-actions amb ★/share + page-foot prev/next).
// El cos de la fitxa (HTML/Markdown) es preserva tal com està.
import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MODULES, getCard, pickBody } from '../lib/content';
import { Markdown } from '../lib/markdown';
import HtmlInline from '../components/HtmlInline';
import { useT } from '../lib/i18n';
import { useFavorites } from '../lib/bookmarks';
import { useSeo } from '../lib/seo';

const MODULE_ACCENT: Record<string, string> = {
  'ce78': '#E5484D',
  'codi-penal': '#C13030',
  'eac': '#E89A1C',
  'fcs': '#2F6BD8',
  'lecrim': '#9747D6',
  'menors': '#E85D8C',
  'municipi': '#2FB66B',
  'sc': '#2a3a52',
  'transit': '#FF7A1A',
};

function FavButton({ moduleSlug, slug, title }: { moduleSlug: string; slug: string; title: string }) {
  const { t } = useT();
  const { isFav, toggle } = useFavorites();
  const fav = isFav(moduleSlug, slug);
  return (
    <button
      type="button"
      onClick={() => toggle({ moduleSlug, slug, title })}
      aria-pressed={fav}
      aria-label={fav ? t('fav.remove') : t('fav.add')}
      title={fav ? t('fav.remove') : t('fav.add')}
      className={fav ? 'btn btn-primary' : 'btn btn-ghost'}
      style={{ height: 36, padding: '0 14px', fontSize: 13.5 }}
    >
      <span aria-hidden>{fav ? '★' : '☆'}</span>
      <span className="hidden sm:inline">{fav ? t('fav.saved') : t('fav.save')}</span>
    </button>
  );
}

export default function CardPage() {
  const params = useParams<{ moduleSlug?: string; slug?: string }>();
  const location = useLocation();
  const { t, locale } = useT();

  // Les rutes públiques de PUBLIC_LEYES_CARDS a App.tsx usen paths
  // hardcodejats (sense ':moduleSlug/:slug'), de manera que useParams
  // retorna undefined. Extraiem els slugs del pathname com a fallback.
  const { moduleSlug, slug } = useMemo(() => {
    if (params.moduleSlug && params.slug) {
      return { moduleSlug: params.moduleSlug, slug: params.slug };
    }
    const m = location.pathname.match(/^\/leyes\/s\/([^/]+)\/(.+?)\/?$/);
    if (m) return { moduleSlug: m[1], slug: m[2] };
    return { moduleSlug: '', slug: '' };
  }, [params.moduleSlug, params.slug, location.pathname]);

  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const card = getCard(moduleSlug, slug);

  // SEO a mida de la fitxa (títol = nom de la fitxa + mòdul).
  useSeo(mod && card
    ? { title: `${card.title} · InfoPol`, description: `${card.title} — ${t(`module.${mod.slug}.title`)}. Consulta la normativa per a policia local de Catalunya a InfoPol.` }
    : { title: '' });

  if (!mod || !card) {
    return (
      <div className="shell py-6">
        <p className="text-text-2">{t('card.notFound')}</p>
        <Link to="/" className="text-terracotta underline">
          {t('back.home')}
        </Link>
      </div>
    );
  }

  const modTitle = t(`module.${mod.slug}.title`);
  const accent = MODULE_ACCENT[mod.slug] ?? 'var(--terracotta-2)';
  // Context: si la fitxa s'obre des del temari de l'Acadèmia, els enllaços
  // de tornada es queden al marc de l'Acadèmia (no salten a Operativa).
  const inAcademia = location.pathname.startsWith('/academia/temari');
  const sectionBack = inAcademia ? `/academia/temari/${mod.slug}` : `/leyes/s/${mod.slug}`;
  const { body, lang: bodyLang } = pickBody(card, locale);
  const langMismatch = bodyLang !== locale;

  const crumbs = (
    <nav className="crumbs" style={{ padding: 0 }}>
      <Link to="/">{t('nav.home')}</Link>
      <span className="sep">/</span>
      <Link to="/leyes">{t('leyes.title')}</Link>
      <span className="sep">/</span>
      <Link to={`/leyes/s/${mod.slug}`} className="inline-flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: accent }}
        />
        {modTitle}
      </Link>
      <span className="sep">/</span>
      <span className="here truncate">{card.title}</span>
    </nav>
  );

  const langNotice = langMismatch ? (
    <div
      className="flex items-start gap-2 rounded-md border-l-4 px-3 py-2 text-xs"
      style={{
        borderLeftColor: 'var(--warn, #b8651b)',
        background: 'var(--warn-soft, #f7e3cf)',
        color: 'var(--ink)',
      }}
    >
      <svg
        aria-hidden
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="mt-0.5 shrink-0"
      >
        <path d="M5 8l6 6" />
        <path d="M4 14l6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="M22 22l-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
      <div className="min-w-0">
        <div className="font-semibold">{t(`card.lang.notice.${bodyLang}`)}</div>
        <div className="opacity-80">{t('card.lang.notice.hint')}</div>
      </div>
    </div>
  ) : null;

  if (card.kind === 'html') {
    return (
      <article>
        <div className="topbar" style={{ position: 'static', borderBottom: '1px solid var(--line)' }}>
          <div className="shell">
            <div className="page-actions">
              {crumbs}
              <FavButton moduleSlug={mod.slug} slug={card.slug} title={card.title} />
            </div>
            {langNotice && <div className="pb-2">{langNotice}</div>}
          </div>
        </div>
        {/* Wrapper centrat per a la fitxa (max 5xl). La fitxa interna
            té el seu propi max (.wrapper a 720px) i conserva l'estil. */}
        <div className="shell" style={{ paddingTop: 16 }}>
          <HtmlInline html={body} title={card.title} key={bodyLang} />
        </div>
        <div className="shell">
          <div className="page-foot">
            <Link to={sectionBack} className="btn btn-ghost">
              ← {t('section.back')}
            </Link>
            <Link to="/policia-local" className="btn btn-primary">
              {t('home.tests.cta')} →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="shell" style={{ maxWidth: 760 }}>
      <div className="page-actions">
        {crumbs}
        <FavButton moduleSlug={mod.slug} slug={card.slug} title={card.title} />
      </div>
      {langNotice && <div className="mt-2 mb-3">{langNotice}</div>}
      <div className="fitxa mt-3">
        <Markdown source={body} />
      </div>
      <div className="page-foot">
        <Link to={sectionBack} className="btn btn-ghost">
          ← {t('section.back')}
        </Link>
        <Link to="/policia-local" className="btn btn-primary">
          {t('home.tests.cta')} →
        </Link>
      </div>
    </article>
  );
}
