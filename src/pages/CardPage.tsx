// Pàgina d'una fitxa concreta.
// - Si la fitxa és HTML: ocupa tot l'ample de la pantalla ("edge-to-edge").
// - Si és Markdown: columna còmoda de lectura.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCard } from '../lib/content';
import { Markdown } from '../lib/markdown';
import HtmlInline from '../components/HtmlInline';
import { useT } from '../lib/i18n';

export default function CardPage() {
  const { moduleSlug = '', slug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const card = getCard(moduleSlug, slug);
  const { t, locale } = useT();

  if (!mod || !card) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">{t('card.notFound')}</p>
        <Link to="/" className="text-amber-600 dark:text-amber-400 underline">
          {t('back.home')}
        </Link>
      </div>
    );
  }

  const modTitle = t(`module.${mod.slug}.title`);
  const langMismatch = card.lang !== locale;

  const breadcrumb = (
    <nav className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
      <Link to="/" className="hover:underline">{t('nav.home')}</Link>
      <span aria-hidden>/</span>
      <Link to={`/s/${mod.slug}`} className="hover:underline">
        <span className="inline-flex items-center gap-1">
          <span
            aria-hidden
            className={`inline-block h-2 w-2 rounded-full bg-gradient-to-br ${mod.accent}`}
          />
          {modTitle}
        </span>
      </Link>
      <span aria-hidden>/</span>
      <span className="truncate text-slate-700 dark:text-slate-200">{card.title}</span>
    </nav>
  );

  // Avís quan l'idioma de la fitxa no coincideix amb l'idioma de l'app
  // (a hores d'ara les infografies HTML no es tradueixen al canviar el
  // toggle ES/CA, així que avisem que el contingut estarà en l'altre).
  const langNotice = langMismatch ? (
    <div className="flex items-start gap-2 rounded-lg border px-3 py-2 text-xs
      border-amber-300/70 bg-amber-50 text-amber-900
      dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
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
        <div className="font-semibold">{t(`card.lang.notice.${card.lang}`)}</div>
        <div className="opacity-80">{t('card.lang.notice.hint')}</div>
      </div>
    </div>
  ) : null;

  if (card.kind === 'html') {
    return (
      <article>
        <div className="w-full border-b border-slate-200 dark:border-white/10 bg-white/85 dark:bg-[#0a1628]/60 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-2 space-y-2">
            {breadcrumb}
            {langNotice}
          </div>
        </div>
        <HtmlInline html={card.body} title={card.title} />
      </article>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-6">
      {breadcrumb}
      {langNotice ? <div className="mt-3">{langNotice}</div> : null}
      <div className="fitxa mt-4">
        <Markdown source={card.body} />
      </div>
    </article>
  );
}
