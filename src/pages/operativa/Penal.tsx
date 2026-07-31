// Pàgina del mòdul Penal / Seguretat Ciutadana (Operativa) · rebranding 2026.
// Dos modes:
//   - Llistat: /operativa/penal → escenaris organitzats en blocs amb colors.
//   - Runner: /operativa/penal/:id → executa un checklist concret amb
//     el component ChecklistRunner.
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
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('operativa.seguretat-ciutadana.title')}</span>
      </nav>

      <header
        className="op-subhero"
        style={{ ['--accent' as never]: '#2a3a52' } as React.CSSProperties}
      >
        <span className="op-subhero-icon" aria-hidden>🛡️</span>
        <div className="op-subhero-text">
          <span className="eyebrow">{t('operativa.title').toUpperCase()}</span>
          <h1>{PENAL_INDEX.titol}</h1>
          {PENAL_INDEX.descripcio && <p>{PENAL_INDEX.descripcio}</p>}
        </div>
        <span className="op-subhero-count">
          <b>{PENAL_INDEX.total_escenaris}</b>
          <span>escenaris</span>
        </span>
      </header>

      {/* Accés ràpid a pantalles de referència */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--terracotta-2)', marginTop: 24 } as React.CSSProperties}
      >
        <span className="eyebrow">⚡ {t('penal.references').toUpperCase()}</span>
        <span className="rule" />
      </div>

      <div className="penal-refs">
        <ReferenceQuickLink to="/operativa/penal/taula-actes" icon="📋" label={t('penal.taulaActes')} color="#3b82f6" />
        <ReferenceQuickLink to="/operativa/penal/taula-drogues" icon="💊" label={t('penal.taulaDrogues')} color="#8b5cf6" />
        <ReferenceQuickLink to="/operativa/penal/recursos" icon="📞" label={t('penal.recursos')} color="#dc2626" />
        <ReferenceQuickLink to="/operativa/penal/drets-detingut" icon="📜" label={t('penal.dretsDetingut')} color="#ef4444" />
        <ReferenceQuickLink to="/operativa/actes-viladecans" icon="🗂️" label="Actes PL Viladecans" color="#B6531F" />
      </div>

      {/* Blocs amb escenaris */}
      {PENAL_INDEX.blocs.map((bloc) => (
        <BlockSection key={bloc.bloc} bloc={bloc} />
      ))}
    </div>
  );
}

function ReferenceQuickLink({
  to, icon, label, color,
}: {
  to: string;
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="penal-ref"
      style={{ ['--accent' as never]: color } as React.CSSProperties}
    >
      <span className="penal-ref-icon" aria-hidden>{icon}</span>
      <span className="penal-ref-label">{label}</span>
      <span className="penal-ref-arr" aria-hidden>→</span>
    </Link>
  );
}

function BlockSection({ bloc }: { bloc: PenalBloc }) {
  return (
    <section className="penal-bloc" style={{ ['--accent' as never]: bloc.color } as React.CSSProperties}>
      <div className="penal-bloc-head">
        <span className="penal-bloc-icon" aria-hidden>{bloc.icono}</span>
        <h2 className="penal-bloc-title">{bloc.bloc}</h2>
        <span className="penal-bloc-count">{bloc.escenaris.length}</span>
      </div>
      <div className="op-procs op-procs-compact">
        {bloc.escenaris.map((e) => (
          <ScenarioCard key={e.id} entry={e} color={bloc.color} />
        ))}
      </div>
    </section>
  );
}

function ScenarioCard({ entry, color }: { entry: PenalIndexEntry; color: string }) {
  return (
    <Link
      to={`/operativa/penal/${encodeURIComponent(entry.id)}`}
      className="op-proc"
      style={{
        ['--accent' as never]: color,
        ['--accent-bg' as never]: color + '14',
      } as React.CSSProperties}
    >
      <div className="top">
        <span className="op-proc-emoji" aria-hidden>{extractEmoji(entry.titol) ?? '📋'}</span>
        <span className="lvl">SC / PENAL</span>
      </div>
      <h4>{stripEmoji(entry.titol)}</h4>
      <div className="footer-row">
        <span className="open">Obrir →</span>
      </div>
    </Link>
  );
}

function PenalRunnerScreen({ id }: { id: string }) {
  const { t } = useT();
  const entry = getPenalEntry(id);
  const checklist = getPenalChecklist(id);
  const bloc = getPenalBlocForId(id);
  const accent = bloc?.color ?? '#2a3a52';

  if (!entry || !checklist) {
    return (
      <div className="shell py-10">
        <p className="text-text-2">{t('checklist.notFound')}</p>
        <Link to="/operativa/penal" className="text-sm font-bold text-ink underline mt-3 inline-block">
          ← {t('penal.backToList')}
        </Link>
      </div>
    );
  }

  const principiClau = (checklist as unknown as { principi_clau?: string }).principi_clau;

  return (
    <div className="shell pb-10" style={{ maxWidth: 760 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa/penal">{t('operativa.seguretat-ciutadana.title')}</Link>
        <span className="sep">/</span>
        <span className="here truncate">{stripEmoji(entry.titol)}</span>
      </nav>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: accent } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>
          {extractEmoji(entry.titol) ?? checklist.icono ?? '📋'}
        </span>
        <div className="op-runner-text">
          {bloc && (
            <span className="eyebrow">{bloc.icono} {bloc.bloc}</span>
          )}
          <h1>{stripEmoji(entry.titol)}</h1>
          {principiClau && (
            <p className="op-runner-principi">{principiClau}</p>
          )}
          {checklist.base_legal && checklist.base_legal.length > 0 && (
            <ul className="op-runner-refs">
              {checklist.base_legal.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
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
