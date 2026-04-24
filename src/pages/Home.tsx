// Pantalla d'inici: targetes de cada mòdul.
import { Link } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Seccions</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Tria una secció per consultar les fitxes. Fes servir la cerca per trobar ràpid.
      </p>

      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODULES.map((m) => {
          const count = getCardsByModule(m.slug).length;
          return (
            <li key={m.slug}>
              <Link
                to={`/s/${m.slug}`}
                className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${m.accent}`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{m.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {m.description}
                    </div>
                  </div>
                  <span className="ml-auto text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300">
                    {count} {count === 1 ? 'fitxa' : 'fitxes'}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
