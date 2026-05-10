// Pàgina de Trànsit (Operativa) · rebranding 2026.
// Dos modes:
//   - Llistat: /operativa/trafico → mostra els escenaris (alcoholèmia,
//     drogues, velocitat, etc.) com a targetes seleccionables.
//   - Runner: /operativa/trafico/:id → executa un escenari concret amb
//     el component ChecklistRunner.
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
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('operativa.trafico.title')}</span>
      </nav>

      {/* Header compacte amb escut + títol + descripció + comptador */}
      <header className="op-subhero" style={{ ['--accent' as never]: '#F26B1F' } as React.CSSProperties}>
        <span className="op-subhero-icon" aria-hidden>🚦</span>
        <div className="op-subhero-text">
          <span className="eyebrow">{t('operativa.title').toUpperCase()}</span>
          <h1>{TRAFICO_INDEX.titol}</h1>
          {TRAFICO_INDEX.descripcio && <p>{TRAFICO_INDEX.descripcio}</p>}
        </div>
        <span className="op-subhero-count">
          <b>{TRAFICO_INDEX.escenaris.length}</b>
          <span>escenaris</span>
        </span>
      </header>

      <div
        className="section-head"
        style={{ ['--accent' as never]: '#F26B1F', marginTop: 24 } as React.CSSProperties}
      >
        <span className="eyebrow">📋 ESCENARIS DISPONIBLES</span>
        <span className="rule" />
      </div>

      <section className="op-procs op-procs-compact">
        {TRAFICO_INDEX.escenaris.map((e) => (
          <Link
            key={e.id}
            to={`/operativa/trafico/${encodeURIComponent(e.id)}`}
            className="op-proc"
            style={{
              ['--accent' as never]: '#F26B1F',
              ['--accent-bg' as never]: '#FFEFE4',
            } as React.CSSProperties}
          >
            <div className="top">
              <span className="op-proc-emoji" aria-hidden>{extractEmoji(e.titol) ?? '🚦'}</span>
              <span className="lvl">TRÀNSIT</span>
            </div>
            <h4>{stripEmoji(e.titol)}</h4>
            <div className="footer-row">
              <span className="open">Obrir checklist →</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function ChecklistRunnerScreen({ id }: { id: string }) {
  const { t } = useT();
  const entry = getChecklistEntry(id);
  const checklist = getChecklist(id);

  if (!entry || !checklist) {
    return (
      <div className="shell py-10">
        <p className="text-text-2">{t('checklist.notFound')}</p>
        <Link to="/operativa/trafico" className="text-sm font-bold text-ink underline mt-3 inline-block">
          ← {t('checklist.backToList')}
        </Link>
      </div>
    );
  }

  return (
    <div className="shell pb-10" style={{ maxWidth: 760 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa/trafico">{t('operativa.trafico.title')}</Link>
        <span className="sep">/</span>
        <span className="here truncate">{stripEmoji(entry.titol)}</span>
      </nav>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: '#F26B1F' } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>
          {extractEmoji(entry.titol) ?? checklist.icono ?? '🚦'}
        </span>
        <div className="op-runner-text">
          <span className="eyebrow">{t('operativa.trafico.title').toUpperCase()}</span>
          <h1>{stripEmoji(entry.titol)}</h1>
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

// Utilitats per separar l'emoji inicial del títol (per posar-lo gran al costat).
const EMOJI_RE = /^([\p{Extended_Pictographic}\u{200D}️]+)\s*/u;

function extractEmoji(s: string): string | undefined {
  const m = s.match(EMOJI_RE);
  return m ? m[1] : undefined;
}

function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, '').trim();
}
