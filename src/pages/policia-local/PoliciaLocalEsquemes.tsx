// Índex d'Esquemes ràpids de Lleis · Policia Local.
// Categoria pròpia paral·lela a Tests, Flashcards i Temari.
// Agrupa per CATEGORIA_META (CE, Codi Penal, FCS, Trànsit, etc.).

import { Link } from 'react-router-dom';
import { listEsquemasLleis, CATEGORIA_META, type LleiCategoria } from '../../data/esquemas-pl';

const BLUE = '#3B6BF5';
const BLUE_INK = '#0E2B7A';
const BLUE_SOFT = '#D8E2FE';

const CATEGORIA_ORDER: LleiCategoria[] = [
  'constitucio', 'eac', 'codi-penal', 'lecrim', 'menors',
  'sc', 'fcs', 'armes', 'transit', 'municipi',
];

export default function PoliciaLocalEsquemes() {
  const esquemas = listEsquemasLleis();

  // Agrupar respectant l'ordre de definició.
  const byCategoria = esquemas.reduce<Record<string, typeof esquemas>>((acc, e) => {
    (acc[e.categoria] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">Inici</Link>
        <span className="sep">/</span>
        <Link to="/policia-local">Policia Local</Link>
        <span className="sep">/</span>
        <span className="here">Esquemes ràpids</span>
      </nav>

      {/* HERO */}
      <header className="ts-hero" style={{ ['--accent' as never]: BLUE } as React.CSSProperties}>
        <div className="eyebrow">✨ Format nou</div>
        <h1>
          Esquemes <em style={{ color: BLUE }}>ràpids</em>
        </h1>
        <p className="lead">
          Repàs visual d'una llei sencera en 5 minuts. Cronologia, ponents, articles
          i fets clau organitzats per època — l'antídot al mur de bullets.
        </p>
        <div className="ts-stats">
          <span className="ts-pill">
            <b>{esquemas.length}</b> esquema{esquemas.length === 1 ? '' : 's'} disponible{esquemas.length === 1 ? '' : 's'}
          </span>
          <span className="ts-pill">4 seccions per llei</span>
          <span className="ts-pill">~ 5 min lectura</span>
        </div>
      </header>

      {/* CARDS per categoria */}
      {CATEGORIA_ORDER.map((cat) => {
        const items = byCategoria[cat];
        if (!items || items.length === 0) return null;
        const meta = CATEGORIA_META[cat];
        return (
          <section key={cat} style={{ marginTop: 28 }}>
            <div
              className="section-head"
              style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
            >
              <span className="eyebrow">
                <span aria-hidden>{meta.emoji}</span> {meta.label}
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
                  to={`/policia-local/esquemes/${e.slug}`}
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
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 5,
                      background: BLUE,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 999,
                      background: BLUE_SOFT, color: BLUE_INK,
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 10.5, fontWeight: 800,
                      letterSpacing: 1.6, textTransform: 'uppercase',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: BLUE }} />
                      {e.kicker}
                    </span>
                  </div>

                  <h3 style={{
                    margin: 0, fontSize: 20, fontWeight: 900,
                    letterSpacing: -0.5, lineHeight: 1.18, color: 'var(--ink)',
                  }}>
                    {e.title}
                    {e.titleHighlight && (
                      <span style={{ color: BLUE }}>{' '}{e.titleHighlight}</span>
                    )}
                  </h3>

                  <p style={{
                    margin: 0, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.45,
                  }}>
                    {e.introOneLiner.length > 140
                      ? e.introOneLiner.slice(0, 137) + '…'
                      : e.introOneLiner}
                  </p>

                  <div style={{
                    marginTop: 6,
                    display: 'flex', flexWrap: 'wrap', gap: 8,
                    paddingTop: 10, borderTop: '1px solid var(--line)',
                  }}>
                    {e.kpis.slice(0, 4).map((k, i) => (
                      <span key={i} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)' }}>
                        <b style={{ color: 'var(--ink)' }}>{k.value}</b>{' '}{k.label}
                        {i < 3 && i < e.kpis.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>

                  <span style={{
                    marginTop: 6, alignSelf: 'flex-end',
                    color: BLUE, fontWeight: 800, fontSize: 14,
                  }}>Obrir esquema →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p
        style={{
          marginTop: 32,
          fontSize: 13.5,
          color: 'var(--text-3)',
          textAlign: 'center',
          lineHeight: 1.55,
        }}
      >
        Anirem afegint més lleis · prioritzem les que cauen sempre a l'examen.
        Vols una llei concreta? Escriu-nos a{' '}
        <a href="mailto:info@infopol.app" style={{ color: BLUE, textDecoration: 'underline' }}>
          info@infopol.app
        </a>
      </p>
    </div>
  );
}
