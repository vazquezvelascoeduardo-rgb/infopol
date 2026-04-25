// Pàgina de Trànsit (Operativa).
// Dos modes:
//   - Llistat: /operativa/trafico → mostra els 12 escenaris (alcoholèmia,
//     drogues, velocitat, etc.) com a targetes seleccionables.
//   - Runner: /operativa/trafico/:id → executa un escenari concret amb
//     ChecklistRunner (estat propi: pila de nodes visitats).
import { Link, useParams } from 'react-router-dom';
import {
  TRAFICO_INDEX,
  getChecklist,
  getChecklistEntry,
} from '../../lib/operativa-trafico';
import ChecklistRunner from '../../components/ChecklistRunner';
import { useT } from '../../lib/i18n';

export default function Trafico() {
  const { '*': rest = '' } = useParams();
  const id = rest.split('/').filter(Boolean)[0];

  if (!id) return <ChecklistList />;
  return <ChecklistRunnerScreen id={id} />;
}

function ChecklistList() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">
          {t('operativa.trafico.title')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-7 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] dark:shadow-none">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-3xl text-white shadow-inner"
          >
            🚦
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400/90">
              {t('operativa.title')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {TRAFICO_INDEX.titol}
            </h1>
            {TRAFICO_INDEX.descripcio && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {TRAFICO_INDEX.descripcio}
              </p>
            )}
          </div>
        </div>
      </header>

      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TRAFICO_INDEX.escenaris.map((e) => (
          <li key={e.id}>
            <Link
              to={`/operativa/trafico/${encodeURIComponent(e.id)}`}
              className="group relative block h-full overflow-hidden rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
                border-slate-200 bg-white hover:border-amber-400/60
                dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700" />
              <div className="flex items-start gap-3">
                <span aria-hidden className="text-3xl shrink-0">
                  {extractEmoji(e.titol) ?? '🚦'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold leading-tight">
                    {stripEmoji(e.titol)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider mt-1 text-amber-600 dark:text-amber-400">
                    {t('checklist.start')} →
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistRunnerScreen({ id }: { id: string }) {
  const { t } = useT();
  const entry = getChecklistEntry(id);
  const checklist = getChecklist(id);

  if (!entry || !checklist) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">
          {t('checklist.notFound')}
        </p>
        <Link to="/operativa/trafico" className="text-amber-600 dark:text-amber-400 underline">
          {t('checklist.backToList')}
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
        <Link to="/operativa/trafico" className="hover:underline">
          {t('operativa.trafico.title')}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          {stripEmoji(entry.titol)}
        </span>
      </nav>

      {/* Capçalera amb títol del checklist */}
      <header className="rounded-2xl border p-4 sm:p-5 mb-4
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">
            {extractEmoji(entry.titol) ?? checklist.icono ?? '🚦'}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400/90">
              {t('operativa.trafico.title')}
            </div>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {stripEmoji(entry.titol)}
            </h1>
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

// El títol al fitxer index pot començar per un emoji ("🍺 Alcoholèmia").
// Aquestes utilitats el separen perquè el puguem mostrar de forma
// independent (icona gran + text al costat).
const EMOJI_RE = /^([\p{Extended_Pictographic}\u{200D}️]+)\s*/u;

function extractEmoji(s: string): string | undefined {
  const m = s.match(EMOJI_RE);
  return m ? m[1] : undefined;
}

function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, '').trim();
}
