// Pàgina d'una fitxa concreta: renderitza el Markdown de la fitxa.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCard } from '../lib/content';
import { Markdown } from '../lib/markdown';

export default function CardPage() {
  const { moduleSlug = '', slug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const card = getCard(moduleSlug, slug);

  if (!mod || !card) {
    return (
      <div>
        <p className="text-slate-600 dark:text-slate-400">Fitxa no trobada.</p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline">
          Torna a l'inici
        </Link>
      </div>
    );
  }

  return (
    <article>
      <nav className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:underline">
          Inici
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/s/${mod.slug}`} className="hover:underline">
          {mod.title}
        </Link>
      </nav>

      <div className="fitxa mt-2">
        <Markdown source={card.body} />
      </div>
    </article>
  );
}
