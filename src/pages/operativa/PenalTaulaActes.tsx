// Pàgina de referència ràpida — Taula d'actes policials.
// Renderitza el contingut de _taula-actes-policials.json: actes
// administratives (D-10, D-10.b…), actes penals (A-20…), documents
// d'atestat (atestat, diligència, minuta), frases prohibides i
// consideracions transversals.
//
// El JSON és força flexible (cada secció és array d'objectes O array
// de strings), així que aquesta pàgina pinta dinàmicament el que troba.
import { Link } from 'react-router-dom';
import { useT } from '../../lib/i18n';

// Importem el JSON via Vite. Tipat com a `any` perquè el contingut és
// flexible i preferim no enumerar-ho tot.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import taulaJson from '../../data/penal-checklists/_taula-actes-policials.json';

type ActaItem = Record<string, string | string[]>;

const data = taulaJson as Record<string, unknown> & {
  titol: string;
  descripcio?: string;
};

// Etiquetes humanes per a les seccions principals.
const SECTION_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  actes_administratives: { label: 'Actes administratives', icon: '📋', color: '#3b82f6' },
  actes_penals: { label: 'Actes penals', icon: '⚖️', color: '#ef4444' },
  documents_atestat: { label: "Documents de l'atestat", icon: '📄', color: '#8b5cf6' },
  frases_prohibides_pautes_UF_3_3: { label: 'Frases PROHIBIDES (Pautes UF 3.3)', icon: '🚫', color: '#dc2626' },
  consideracions_transversals: { label: 'Consideracions transversals', icon: '📌', color: '#10b981' },
};

// Etiquetes humanes per a camps dins de cada acta.
const FIELD_LABELS: Record<string, string> = {
  tipus: 'Tipus',
  nom_complet: 'Nom complet',
  base_legal: 'Base legal',
  quan_usar: 'Quan usar',
  contingut_obligatori: 'Contingut obligatori',
  contingut_obligatori_pautes_3_3: 'Contingut obligatori (Pautes UF 3.3)',
  lliurament: 'Lliurament',
  tramitacio: 'Tramitació',
  diferencia_amb_D10: 'Diferència amb D-10',
  destinacio: 'Destinació',
  definicio: 'Definició',
  estructura_basica: 'Estructura bàsica',
  diligencies_habituals: 'Diligències habituals',
};

export default function PenalTaulaActes() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
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
          {t('penal.taulaActes')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">📋</span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
              {t('operativa.seguretat-ciutadana.title')}
            </div>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {data.titol}
            </h1>
            {data.descripcio && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {data.descripcio}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mt-6 space-y-7">
        {Object.entries(data).map(([key, value]) => {
          if (key === 'id' || key === 'titol' || key === 'descripcio') return null;
          if (!Array.isArray(value)) return null;
          return <SectionBlock key={key} sectionKey={key} value={value as unknown[]} />;
        })}
      </div>
    </div>
  );
}

function SectionBlock({ sectionKey, value }: { sectionKey: string; value: unknown[] }) {
  const meta = SECTION_LABELS[sectionKey];
  const label = meta?.label ?? sectionKey;
  const icon = meta?.icon ?? '📂';
  const color = meta?.color ?? '#64748b';

  // Detectem si la llista és de strings o d'objectes.
  const isStringList = value.every((x) => typeof x === 'string');

  return (
    <section>
      <div
        className="flex items-center gap-3 mb-3 px-4 py-2 rounded-xl"
        style={{
          backgroundColor: color + '14',
          borderLeft: `4px solid ${color}`,
        }}
      >
        <span aria-hidden className="text-2xl">{icon}</span>
        <h2 className="text-sm font-black uppercase tracking-[0.15em]" style={{ color }}>
          {label}
        </h2>
        <span className="ml-auto text-xs font-mono opacity-70" style={{ color }}>
          {value.length}
        </span>
      </div>

      {isStringList ? (
        <ul className="space-y-1.5 list-disc pl-6 text-sm">
          {value.map((s, i) => (
            <li key={i}>{s as string}</li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3">
          {(value as ActaItem[]).map((item, i) => (
            <ActaCard key={i} item={item} accent={color} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ActaCard({ item, accent }: { item: ActaItem; accent: string }) {
  const tipus = item.tipus as string | undefined;
  const nom = item.nom_complet as string | undefined;
  const definicio = item.definicio as string | undefined;
  return (
    <li
      className="rounded-xl border p-4 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      {/* Capçalera: tipus + nom complet */}
      <div className="flex items-start gap-3">
        {tipus && (
          <span
            className="rounded-md px-2 py-1 text-sm font-mono font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {tipus}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {nom && <div className="font-semibold leading-tight">{nom}</div>}
          {definicio && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {definicio}
            </p>
          )}
        </div>
      </div>

      {/* Resta de camps */}
      <div className="mt-3 space-y-2.5 text-sm">
        {Object.entries(item).map(([k, v]) => {
          if (k === 'tipus' || k === 'nom_complet' || k === 'definicio') return null;
          const label = FIELD_LABELS[k] ?? humanize(k);
          if (Array.isArray(v)) {
            return (
              <div key={k}>
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-1">
                  {label}
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {v.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
            );
          }
          if (typeof v === 'string') {
            return (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-3">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-70 self-start">
                  {label}
                </div>
                <div>{v}</div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </li>
  );
}

function humanize(key: string): string {
  return key.replace(/_/g, ' ').replace(/^(.)/, (m) => m.toUpperCase());
}
