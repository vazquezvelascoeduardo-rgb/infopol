// Pantalla d'inici: tauler amb targetes per cada mòdul.
// Disseny inspirat en les infografies operatives (fons fosc, accent
// daurat, targetes amb vora superior de color i etiquetes.
import { Link } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';

export default function Home() {
  // Separem el mapa de colors de cada mòdul per a un accent superior
  // consistent amb el mateix gradient que ja tenia definit.
  return (
    <div>
      {/* Banda superior tipus "esquema operatiu" */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1d34] to-[#0a1628] px-5 py-6 sm:px-8 sm:py-8 shadow-lg">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-black text-xl shadow ring-1 ring-amber-300/40">
            PL
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-amber-400/90">
              Esquema operatiu policial
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-50">
              InfoPol · Consulta ràpida
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Normativa, infografies i fitxes operatives per a l'agent de
              policia local. Tria una secció o usa la cerca per anar directe.
            </p>
          </div>
        </div>
      </section>

      {/* Títol seccions */}
      <div className="mt-6 mb-3 flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-amber-400"></span>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
          Seccions
        </h2>
      </div>

      {/* Graella de targetes de mòduls */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MODULES.map((m) => {
          const count = getCardsByModule(m.slug).length;
          return (
            <li key={m.slug}>
              <Link
                to={`/s/${m.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0f1d34] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-lg"
              >
                {/* Barra superior de color accent */}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${m.accent}`}
                />
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.accent} text-lg text-white shadow-inner`}
                  >
                    {m.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-50 truncate">
                      {m.title}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {m.description}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {count} {count === 1 ? 'fitxa' : 'fitxes'}
                  </span>
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition" aria-hidden>
                    →
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
