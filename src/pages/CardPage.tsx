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
  const { t } = useT();

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

  if (card.kind === 'html') {
    return (
      <article>
        <div className="w-full border-b border-slate-200 dark:border-white/10 bg-white/85 dark:bg-[#0a1628]/60 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-2">
            {breadcrumb}
          </div>
        </div>
        <HtmlInline html={card.body} title={card.title} />
      </article>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-6">
      {breadcrumb}
      <div className="fitxa mt-4">
        <Markdown source={card.body} />
      </div>
    </article>
  );
}
