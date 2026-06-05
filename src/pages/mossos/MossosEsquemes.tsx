// Índex d'Esquemes ràpids · categoria pròpia dins Mossos d'Esquadra
// (paral·lela a Temari, Tests i Flashcards).
//
// Cada esquema és un repàs visual del tema en 4 seccions
// (Resum / Línia temporal / Personatges / Examen). Disseny pensat
// per repassar un tema sencer en ~5 minuts abans d'un test.

import { Link } from 'react-router-dom';
import { listEsquemas } from '../../data/esquemas';
import { AMBIT_META } from '../../lib/mossosTemari';
import { useT } from '../../lib/i18n';

const TERRACOTA = '#FF7A1A';
const TERRACOTA_INK = '#7A2E04';
const TERRACOTA_SOFT = '#FFE0CB';

export default function MossosEsquemes() {
  const { t } = useT();
  const esquemas = listEsquemas();

  // Agrupem per àmbit perquè el llistat respecti l'ordre A → B → C.
  const byAmbit = esquemas.reduce<Record<'A' | 'B' | 'C', typeof esquemas>>(
    (acc, e) => {
      (acc[e.ambit] ??= []).push(e);
      return acc;
    },
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
        <span className="here">Esquemes ràpids</span>
      </nav>

      {/* HERO */}
      <header className="ts-hero" style={{ ['--accent' as never]: TERRACOTA } as React.CSSProperties}>
        <div className="eyebrow">✨ Format nou</div>
        <h1>
          Esquemes <em style={{ color: TERRACOTA }}>ràpids</em>
        </h1>
        <p className="lead">
          Repàs visual d'un tema sencer en 5 minuts. Línia temporal, personatges i
          fets clau organitzats per època — l'antídot al mur de bullets.
        </p>
        <div className="ts-stats">
          <span className="ts-pill"><b>{esquemas.length}</b> esquema{esquemas.length === 1 ? '' : 's'} disponible{esquemas.length === 1 ? '' : 's'}</span>
          <span className="ts-pill">4 seccions per tema</span>
          <span className="ts-pill">~ 5 min lectura</span>
        </div>
      </header>

      {/* CARDS per àmbit */}
      {(['A', 'B', 'C'] as const).map((ambit) => {
        const items = byAmbit[ambit];
        if (!items || items.length === 0) return null;
        const meta = AMBIT_META[ambit];
        return (
          <section key={ambit} style={{ marginTop: 28 }}>
            <div
              className="section-head"
              style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
            >
              <span className="eyebrow">
                <span aria-hidden>{meta.icon}</span> {meta.short}
              </span>
              <span className="rule" />
            </div>
            <div
              style={{
                marginTop: 14,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {items.map((e) => (
                <Link
                  key={e.id}
                  to={`/mossos/esquemes/${e.temaSlug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    padding: 18,
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 16,
                    textDecoration: 'none',
                    color: 'var(--ink)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Strip top */}
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: TERRACOTA,
                    }}
                  />

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginTop: 6,
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 999,
                      background: TERRACOTA_SOFT, color: TERRACOTA_INK,
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 10.5, fontWeight: 800,
                      letterSpacing: 1.6, textTransform: 'uppercase',
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: 3, background: TERRACOTA,
                      }} />
                      {e.kicker}
                    </span>
                  </div>

                  <h3 style={{
                    margin: 0, fontSize: 20, fontWeight: 900,
                    letterSpacing: -0.5, lineHeight: 1.18, color: 'var(--ink)',
                  }}>
                    {e.title}
                    {e.titleHighlight && (
                      <span style={{ color: TERRACOTA }}>{' '}{e.titleHighlight}</span>
                    )}
                  </h3>

                  <p style={{
                    margin: 0, fontSize: 13.5, color: 'var(--text-2)',
                    lineHeight: 1.45,
                  }}>
                    {e.introOneLiner.length > 140
                      ? e.introOneLiner.slice(0, 137) + '…'
                      : e.introOneLiner}
                  </p>

                  {/* KPI footer */}
                  <div style={{
                    marginTop: 6,
                    display: 'flex', flexWrap: 'wrap', gap: 8,
                    paddingTop: 10, borderTop: '1px solid var(--line)',
                  }}>
                    {e.kpis.slice(0, 4).map((k, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11.5, fontWeight: 700,
                          color: 'var(--text-2)',
                        }}
                      >
                        <b style={{ color: 'var(--ink)' }}>{k.value}</b>{' '}{k.label}
                        {i < 3 && i < e.kpis.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>

                  <span style={{
                    marginTop: 6, alignSelf: 'flex-end',
                    color: TERRACOTA, fontWeight: 800, fontSize: 14,
                  }}>Obrir esquema →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer info */}
      <p
        style={{
          marginTop: 32,
          fontSize: 13.5,
          color: 'var(--text-3)',
          textAlign: 'center',
          lineHeight: 1.55,
        }}
      >
        Els esquemes són un format nou. Anirem afegint més temes —
        prioritzant els que cauen sempre a l'examen. Vols un tema concret?
        <br />
        Escriu-nos a <a href="mailto:info@infopol.app" style={{ color: TERRACOTA, textDecoration: 'underline' }}>
          info@infopol.app
        </a>
      </p>
    </div>
  );
}
