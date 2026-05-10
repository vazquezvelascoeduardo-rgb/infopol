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
    <div className="shell pb-10" style={{ maxWidth: 880 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa/penal">{t('operativa.seguretat-ciutadana.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('penal.taulaActes')}</span>
      </nav>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: '#3b82f6' } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>📋</span>
        <div className="op-runner-text">
          <span className="eyebrow">SC / PENAL · ACTES POLICIALS</span>
          <h1>{data.titol}</h1>
          {data.descripcio && (
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: '6px 0 0' }}>
              {data.descripcio}
            </p>
          )}
        </div>
      </header>

      {Object.entries(data).map(([key, value]) => {
        if (key === 'id' || key === 'titol' || key === 'descripcio') return null;
        if (!Array.isArray(value)) return null;
        return <SectionBlock key={key} sectionKey={key} value={value as unknown[]} />;
      })}
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
    <section
      className="penal-bloc"
      style={{ ['--accent' as never]: color } as React.CSSProperties}
    >
      <div className="penal-bloc-head">
        <span className="penal-bloc-icon" aria-hidden>{icon}</span>
        <h2 className="penal-bloc-title">{label}</h2>
        <span className="penal-bloc-count">{value.length}</span>
      </div>

      {isStringList ? (
        <ul className="op-string-list">
          {value.map((s, i) => (
            <li key={i}>{s as string}</li>
          ))}
        </ul>
      ) : (
        <ul className="acta-list">
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
      className="acta-card"
      style={{ ['--accent' as never]: accent } as React.CSSProperties}
    >
      <div className="acta-head">
        {tipus && <span className="acta-tag">{tipus}</span>}
        <div className="acta-head-text">
          {nom && <div className="acta-nom">{nom}</div>}
          {definicio && <p className="acta-def">{definicio}</p>}
        </div>
      </div>

      <div className="acta-fields">
        {Object.entries(item).map(([k, v]) => {
          if (k === 'tipus' || k === 'nom_complet' || k === 'definicio') return null;
          const label = FIELD_LABELS[k] ?? humanize(k);
          if (Array.isArray(v)) {
            return (
              <div key={k} className="acta-field">
                <div className="acta-field-label">{label}</div>
                <ul className="acta-field-list">
                  {v.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
            );
          }
          if (typeof v === 'string') {
            return (
              <div key={k} className="acta-field acta-field-row">
                <div className="acta-field-label">{label}</div>
                <div className="acta-field-value">{v}</div>
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
