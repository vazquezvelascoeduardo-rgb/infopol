// Pàgina d'una fitxa concreta.
// - Si la fitxa és HTML: ocupa tot l'ample de la pantalla ("edge-to-edge"),
//   sense cap caixa al voltant. Damunt hi ha una fina barra de navegació
//   amb les molles de pa, visualment continuada amb la capçalera.
// - Si és Markdown: es mostra en una columna còmoda de lectura.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCard } from '../lib/content';
import { Markdown } from '../lib/markdown';
import HtmlFrame from '../components/HtmlFrame';

export default function CardPage() {
  const { moduleSlug = '', slug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const card = getCard(moduleSlug, slug);

  if (!mod || !card) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">Fitxa no trobada.</p>
        <Link to="/" className="text-amber-600 dark:text-amber-400 underline">
          Torna a l'inici
        </Link>
      </div>
    );
  }

  // Breadcrumb reutilitzable. Per HTML va a ample complet; per Markdown,
  // dins del contenidor.
  const breadcrumb = (
    <nav className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
      <Link to="/" className="hover:underline">Inici</Link>
      <span aria-hidden>/</span>
      <Link to={`/s/${mod.slug}`} className="hover:underline">
        <span className="inline-flex items-center gap-1">
          <span
            aria-hidden
            className={`inline-block h-2 w-2 rounded-full bg-gradient-to-br ${mod.accent}`}
          />
          {mod.title}
        </span>
      </Link>
      <span aria-hidden>/</span>
      <span className="truncate text-slate-700 dark:text-slate-200">{card.title}</span>
    </nav>
  );

  if (card.kind === 'html') {
    return (
      <article>
        {/* Tira de breadcrumb a amplada completa, enganxada visualment a la capçalera */}
        <div className="w-full border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#0a1628]/60 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-2">
            {breadcrumb}
          </div>
        </div>

        {/* Iframe edge-to-edge (sense caixa ni vora), s'ajusta sol a l'alçada */}
        <HtmlFrame html={card.body} title={card.title} />
      </article>
    );
  }

  // Markdown: columna de lectura còmoda
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-6">
      {breadcrumb}
      <div className="fitxa mt-4">
        <Markdown source={card.body} />
      </div>
    </article>
  );
}
