// Pàgina d'un mòdul: mostra el llistat de fitxes.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';

export default function Section() {
  const { moduleSlug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);

  if (!mod) {
    return (
      <div>
        <p className="text-slate-600 dark:text-slate-400">Secció no trobada.</p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline">
          Torna a l'inici
        </Link>
      </div>
    );
  }

  const cards = getCardsByModule(moduleSlug);

  return (
    <div>
      <nav className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:underline">
          Inici
        </Link>
        <span className="mx-2">/</span>
        <span>{mod.title}</span>
      </nav>

      <h1 className="mt-1 text-2xl font-bold tracking-tight">{mod.title}</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{mod.description}</p>

      {cards.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-slate-500 dark:text-slate-400">
          Encara no hi ha fitxes en aquesta secció.
          <br />
          Afegeix un fitxer <code>.md</code> a <code>content/{mod.slug}/</code>.
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {cards.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/s/${c.moduleSlug}/${c.slug}`}
                className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="font-medium">{c.title}</div>
                <div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 truncate">
                  {summary(c.body)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Extreu un resum curt del cos per mostrar al llistat.
function summary(body: string): string {
  const text = body
    .replace(/^#.*$/gm, '') // treu encapçalaments
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 120 ? text.slice(0, 117) + '…' : text;
}
