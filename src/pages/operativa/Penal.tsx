// Pàgina del mòdul Penal / Seguretat Ciutadana (Operativa).
// Dos modes:
//   - Llistat: /operativa/penal → 19 escenaris organitzats en 5 blocs
//     amb colors (Operatiu/LOPSC, Persones, Patrimoni, Ordre Públic,
//     Emergències).
//   - Runner: /operativa/penal/:id → executa un checklist concret amb
//     el component ChecklistRunner (compartit amb el mòdul Trànsit).
import { Link, useParams } from 'react-router-dom';
import {
  PENAL_INDEX,
  getPenalChecklist,
  getPenalEntry,
  getPenalBlocForId,
  type PenalBloc,
  type PenalIndexEntry,
} from '../../lib/operativa-penal';
import ChecklistRunner from '../../components/ChecklistRunner';
import { useT } from '../../lib/i18n';

export default function Penal() {
  const { '*': rest = '' } = useParams();
  const id = rest.split('/').filter(Boolean)[0];
  if (!id) return <PenalList />;
  return <PenalRunnerScreen id={id} />;
}

function PenalList() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">
          {t('operativa.seguretat-ciutadana.title')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-7 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] dark:shadow-none">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 text-3xl text-white shadow-inner"
          >
            🛡️
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
              {t('operativa.title')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {PENAL_INDEX.titol}
            </h1>
            {PENAL_INDEX.descripcio && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {PENAL_INDEX.descripcio}
              </p>
            )}
            {PENAL_INDEX.data_versio && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                v{PENAL_INDEX.data_versio} · {PENAL_INDEX.total_escenaris} {t('penal.totalScenarios')}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Accés ràpid a pantalles de referència */}
      <div className="mt-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-5 w-1 rounded-full bg-slate-500"></span>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
            {t('penal.references')}
          </h2>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ReferenceQuickLink to="/operativa/penal/taula-actes" icon="📋" label={t('penal.taulaActes')} color="#3b82f6" />
          <ReferenceQuickLink to="/operativa/penal/taula-drogues" icon="💊" label={t('penal.taulaDrogues')} color="#8b5cf6" />
          <ReferenceQuickLink to="/operativa/penal/recursos" icon="📞" label={t('penal.recursos')} color="#dc2626" />
          <ReferenceQuickLink to="/operativa/penal/drets-detingut" icon="📜" label={t('penal.dretsDetingut')} color="#ef4444" />
        </ul>
      </div>

      <div className="mt-6 space-y-7">
        {PENAL_INDEX.blocs.map((bloc) => (
          <BlockSection key={bloc.bloc} bloc={bloc} />
        ))}
      </div>
    </div>
  );
}

function ReferenceQuickLink({
  to,
  icon,
  label,
  color,
}: {
  to: string;
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-2 rounded-xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md min-h-[60px]
          border-slate-200 bg-white
          dark:border-white/10 dark:bg-[#0f1d34]"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <span aria-hidden className="text-2xl shrink-0">{icon}</span>
        <span className="text-sm font-semibold leading-tight">{label}</span>
      </Link>
    </li>
  );
}

function BlockSection({ bloc }: { bloc: PenalBloc }) {
  return (
    <section>
      {/* Capçalera del bloc amb el seu color */}
      <div
        className="flex items-center gap-3 mb-3 px-4 py-2 rounded-xl"
        style={{
          backgroundColor: bloc.color + '14', // ~8% opacity
          borderLeft: `4px solid ${bloc.color}`,
        }}
      >
        <span aria-hidden className="text-2xl">{bloc.icono}</span>
        <h2
          className="text-sm font-black uppercase tracking-[0.2em]"
          style={{ color: bloc.color }}
        >
          {bloc.bloc}
        </h2>
        <span
          aria-hidden
          className="ml-auto text-xs font-mono opacity-70"
          style={{ color: bloc.color }}
        >
          {bloc.escenaris.length}
        </span>
      </div>

      {/* Targetes dels escenaris del bloc */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bloc.escenaris.map((e) => (
          <ScenarioCard key={e.id} entry={e} color={bloc.color} />
        ))}
      </ul>
    </section>
  );
}

function ScenarioCard({ entry, color }: { entry: PenalIndexEntry; color: string }) {
  return (
    <li>
      <Link
        to={`/operativa/penal/${encodeURIComponent(entry.id)}`}
        className="group relative block h-full overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md min-h-[64px]
          border-slate-200 bg-white
          dark:border-white/10 dark:bg-[#0f1d34]"
        style={
          {
            // Highlight on hover via the bloc color (inline style for dynamic color).
          }
        }
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: color }}
        />
        <div className="flex items-start gap-3 pt-1">
          <span aria-hidden className="text-2xl shrink-0">
            {extractEmoji(entry.titol) ?? '📋'}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-bold leading-tight">
              {stripEmoji(entry.titol)}
            </div>
            <div
              className="text-[10px] uppercase tracking-wider mt-1 font-semibold"
              style={{ color }}
            >
              Obrir →
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function PenalRunnerScreen({ id }: { id: string }) {
  const { t } = useT();
  const entry = getPenalEntry(id);
  const checklist = getPenalChecklist(id);
  const bloc = getPenalBlocForId(id);

  if (!entry || !checklist) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">
          {t('checklist.notFound')}
        </p>
        <Link to="/operativa/penal" className="text-blue-600 dark:text-blue-400 underline">
          {t('penal.backToList')}
        </Link>
      </div>
    );
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
          {stripEmoji(entry.titol)}
        </span>
      </nav>

      {/* Capçalera amb el color del bloc */}
      <header
        className="rounded-2xl border p-4 sm:p-5 mb-4
          border-slate-200 bg-white
          dark:border-white/10 dark:bg-[#0f1d34]"
        style={
          bloc
            ? { borderLeft: `6px solid ${bloc.color}` }
            : undefined
        }
      >
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">
            {extractEmoji(entry.titol) ?? checklist.icono ?? '📋'}
          </span>
          <div className="min-w-0">
            {bloc && (
              <div
                className="text-[11px] uppercase tracking-[0.25em] font-bold"
                style={{ color: bloc.color }}
              >
                {bloc.icono} {bloc.bloc}
              </div>
            )}
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {stripEmoji(entry.titol)}
            </h1>
            {/* Principi clau si hi és (camp opcional al JSON) */}
            {(checklist as unknown as { principi_clau?: string }).principi_clau && (
              <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">
                {(checklist as unknown as { principi_clau?: string }).principi_clau}
              </p>
            )}
            {checklist.base_legal && checklist.base_legal.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {checklist.base_legal.map((b, i) => (
                  <li
                    key={i}
                    className="rounded-md border px-2 py-0.5 text-xs font-mono
                      border-slate-300 bg-slate-100 text-slate-700
                      dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <ChecklistRunner checklist={checklist} key={checklist.id} />
    </div>
  );
}

const EMOJI_RE = /^([\p{Extended_Pictographic}\u{200D}️]+)\s*/u;

function extractEmoji(s: string): string | undefined {
  const m = s.match(EMOJI_RE);
  return m ? m[1] : undefined;
}

function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, '').trim();
}
