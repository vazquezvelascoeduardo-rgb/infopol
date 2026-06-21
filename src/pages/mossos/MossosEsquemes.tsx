// Índex d'Esquemes detallats de Mossos (format temari jeràrquic).
// Substitueix el format "esquema ràpid" visual. Llista per àmbit (A/B/C).
import { Link } from 'react-router-dom';
import { listEsquemesDetall } from '../../data/esquemes-mossos-detall';
import { AMBIT_META } from '../../lib/mossosTemari';
import { useT } from '../../lib/i18n';

const TERRACOTA = '#FF7A1A';
const TERRACOTA_INK = '#7A2E04';
const TERRACOTA_SOFT = '#FFE0CB';

export default function MossosEsquemes() {
  const { t } = useT();
  const esquemes = listEsquemesDetall();

  const byAmbit = esquemes.reduce<Record<'A' | 'B' | 'C', typeof esquemes>>(
    (acc, e) => { (acc[e.ambit] ??= []).push(e); return acc; },
    { A: [], B: [], C: [] },
  );

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/academia">{t('sidebar.academia')}</Link>
        <span className="sep">/</span>
        <Link to="/mossos">{t('mossos.title')}</Link>
        <span className="sep">/</span>
        <span className="here">Esquemes</span>
      </nav>

      {/* HERO */}
      <header className="ts-hero" style={{ ['--accent' as never]: TERRACOTA } as React.CSSProperties}>
        <div className="eyebrow">📝 Esquemes detallats</div>
        <h1>Esquemes <em style={{ color: TERRACOTA }}>de temari</em></h1>
        <p className="lead">
          Resum estructurat de cada tema: seccions, subapartats i totes les dades clau
          (lleis, dates, xifres) en un sol cop d'ull per repassar abans del test.
        </p>
        <div className="ts-stats">
          <span className="ts-pill"><b>{esquemes.length}</b> esquema{esquemes.length === 1 ? '' : 's'}</span>
          <span className="ts-pill">format temari</span>
          <span className="ts-pill">àmbits A · B · C</span>
        </div>
      </header>

      {(['A', 'B', 'C'] as const).map((ambit) => {
        const items = byAmbit[ambit];
        if (!items || items.length === 0) return null;
        const meta = AMBIT_META[ambit];
        return (
          <section key={ambit} style={{ marginTop: 28 }}>
            <div className="section-head" style={{ ['--accent' as never]: meta.color } as React.CSSProperties}>
              <span className="eyebrow"><span aria-hidden>{meta.icon}</span> {meta.short}</span>
              <span className="rule" />
            </div>
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {items.map((e) => (
                <Link key={e.slug} to={`/mossos/esquemes/${e.slug}`} style={{
                  display: 'flex', flexDirection: 'column', gap: 9, padding: 18, background: '#fff',
                  border: '1px solid var(--line)', borderRadius: 16, textDecoration: 'none', color: 'var(--ink)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: TERRACOTA }} />
                  <span style={{
                    display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, marginTop: 6,
                    padding: '4px 10px', borderRadius: 999, background: TERRACOTA_SOFT, color: TERRACOTA_INK,
                    fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 10.5, fontWeight: 800,
                    letterSpacing: 1.6, textTransform: 'uppercase',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: 3, background: TERRACOTA }} />
                    Tema {e.codi}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.18, color: 'var(--ink)' }}>{e.title}</h3>
                  {e.subtitle && (
                    <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.45 }}>
                      {e.subtitle.length > 150 ? e.subtitle.slice(0, 147) + '…' : e.subtitle}
                    </p>
                  )}
                  <span style={{ marginTop: 6, alignSelf: 'flex-end', color: TERRACOTA, fontWeight: 800, fontSize: 14 }}>Obrir esquema →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p style={{ marginTop: 32, fontSize: 13.5, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.55 }}>
        Anirem afegint més temes en aquest format. Vols un tema concret?{' '}
        Escriu-nos a <a href="mailto:info@infopol.app" style={{ color: TERRACOTA, textDecoration: 'underline' }}>info@infopol.app</a>
      </p>
    </div>
  );
}
