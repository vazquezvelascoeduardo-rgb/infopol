// Pàgina d'una fitxa concreta.
// Si la fitxa és HTML, la mostrem dins d'un iframe perquè conservi tot
// el seu disseny original (colors, gradients, timelines, icones, etc.).
// Si és Markdown, la renderitzem amb el nostre mini-renderer.
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
      <div className="px-4 py-6">
        <p className="text-slate-400">Fitxa no trobada.</p>
        <Link to="/" className="text-amber-400 underline">
          Torna a l'inici
        </Link>
      </div>
    );
  }

  return (
    <article>
      <nav className="text-sm text-slate-400 mb-3">
        <Link to="/" className="hover:underline">
          Inici
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/s/${mod.slug}`} className="hover:underline">
          {mod.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{card.title}</span>
      </nav>

      {card.kind === 'html' ? (
        // Iframe aïllat: 0 interferències entre els estils de la ficha i l'app.
        <div className="rounded-2xl overflow-hidden bg-slate-950 shadow-lg ring-1 ring-white/10">
          <HtmlFrame html={card.body} title={card.title} />
        </div>
      ) : (
        <div className="fitxa max-w-3xl">
          <Markdown source={card.body} />
        </div>
      )}
    </article>
  );
}
