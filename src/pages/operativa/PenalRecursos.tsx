// Pàgina de recursos d'atenció a víctimes — telèfons i serveis útils
// per a casos de violència de gènere, domèstica, sexual, suïcidi,
// desaparició, menors, etc.
import { Link } from 'react-router-dom';
import { useT } from '../../lib/i18n';

type Recurs = {
  numero?: string;
  nom: string;
  descripcio: string;
  tipus: 'emergencia' | 'victima' | 'menors' | 'salut' | 'social';
  url?: string;
};

const RECURSOS: Recurs[] = [
  // EMERGÈNCIES
  { numero: '112', nom: "Emergències", descripcio: "Telèfon únic d'emergències (24h)", tipus: 'emergencia' },
  { numero: '061', nom: 'Emergències sanitàries', descripcio: 'Atenció sanitària urgent (24h)', tipus: 'emergencia' },
  { numero: '091', nom: 'Policia Nacional', descripcio: 'Cos Nacional de Policia (24h)', tipus: 'emergencia' },
  { numero: '092', nom: 'Policia Local', descripcio: 'Policia Local (24h)', tipus: 'emergencia' },
  { numero: '088', nom: "Mossos d'Esquadra", descripcio: "Policia de la Generalitat (24h)", tipus: 'emergencia' },

  // VÍCTIMES
  { numero: '016', nom: 'Atenció víctimes violència de gènere', descripcio: 'Gratuït · 24h · NO deixa rastre a la factura · sms 600 000 016', tipus: 'victima' },
  { numero: '024', nom: 'Conducta suïcida', descripcio: 'Línia d\'atenció a la conducta suïcida (24h)', tipus: 'victima' },
  { numero: '717 003 717', nom: 'Telèfon de l\'Esperança', descripcio: 'Suport emocional i suïcidi (24h)', tipus: 'victima' },

  // MENORS
  { numero: '900 20 20 10', nom: 'Fundació ANAR', descripcio: 'Ajuda a infància i adolescència (24h)', tipus: 'menors' },

  // SOCIAL
  { nom: 'SIAD', descripcio: "Servei d'Informació i Atenció a les Dones (cada municipi té el seu — Generalitat de Catalunya)", tipus: 'social' },
  { nom: 'SARA', descripcio: "Servei d'Atenció, Recuperació i Acolliment per a dones víctimes de violència masclista", tipus: 'social' },
];

const TIPUS_META: Record<Recurs['tipus'], { label: string; color: string; icon: string }> = {
  emergencia: { label: 'Emergències', color: '#ef4444', icon: '🚨' },
  victima: { label: 'Atenció a víctimes', color: '#dc2626', icon: '💔' },
  menors: { label: 'Menors', color: '#f59e0b', icon: '👶' },
  salut: { label: 'Salut', color: '#10b981', icon: '🏥' },
  social: { label: 'Serveis socials', color: '#3b82f6', icon: '🤝' },
};

export default function PenalRecursos() {
  const { t } = useT();
  // Agrupem per tipus respectant l'ordre.
  const grouped = new Map<Recurs['tipus'], Recurs[]>();
  for (const r of RECURSOS) {
    if (!grouped.has(r.tipus)) grouped.set(r.tipus, []);
    grouped.get(r.tipus)!.push(r);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa/penal" className="hover:underline">
          {t('operativa.seguretat-ciutadana.title')}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          {t('penal.recursos')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5 mb-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">📞</span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-red-600 dark:text-red-400">
              {t('operativa.seguretat-ciutadana.title')}
            </div>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {t('penal.recursos.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('penal.recursos.desc')}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {[...grouped.entries()].map(([tipus, items]) => {
          const meta = TIPUS_META[tipus];
          return (
            <section key={tipus}>
              <div
                className="flex items-center gap-3 mb-3 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: meta.color + '14',
                  borderLeft: `4px solid ${meta.color}`,
                }}
              >
                <span aria-hidden className="text-2xl">{meta.icon}</span>
                <h2 className="text-sm font-black uppercase tracking-[0.15em]" style={{ color: meta.color }}>
                  {meta.label}
                </h2>
              </div>
              <ul className="space-y-2">
                {items.map((r, i) => (
                  <li key={i}>
                    {r.numero ? (
                      <a
                        href={`tel:${r.numero.replace(/\s+/g, '')}`}
                        className="group flex items-start gap-3 rounded-xl border p-4 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md
                          border-slate-200 bg-white
                          dark:border-white/10 dark:bg-[#0f1d34]"
                      >
                        <span
                          className="rounded-md px-3 py-1.5 font-mono font-bold text-white text-base shrink-0"
                          style={{ backgroundColor: meta.color }}
                        >
                          {r.numero}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold">{r.nom}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {r.descripcio}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 rounded-xl border p-4
                        border-slate-200 bg-white
                        dark:border-white/10 dark:bg-[#0f1d34]">
                        <span
                          className="rounded-md px-3 py-1.5 font-bold text-white text-sm shrink-0"
                          style={{ backgroundColor: meta.color }}
                        >
                          {r.nom}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400 self-center">
                          {r.descripcio}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
