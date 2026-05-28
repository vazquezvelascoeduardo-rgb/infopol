// Pàgina d'índex d'Actualitat 2025-2026.
// Mateix patró que CulturaGeneral: hero + CTA gros al pool mesclat
// (totes les preguntes barrejades) + llegenda dels blocs temàtics.
// Categoria 'actualitat' — no entra al pool combinat del temari oficial.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS } from '../data/tests';

const ACCENT = '#F26B1F'; // terracotta — encaixa amb el rebranding 2026

// Blocs temàtics inclosos al pool d'Actualitat (informatiu, sense link).
const BLOCS = [
  { ico: '🏛️', label: 'Càrrecs Catalunya' },
  { ico: '🇪🇸', label: 'Càrrecs Espanya' },
  { ico: '🌍', label: 'Càrrecs internacionals' },
  { ico: '✝️', label: 'Vaticà i casa reial' },
  { ico: '🏆', label: 'Premis i cultura' },
  { ico: '🎬', label: 'Oscars, Goyas, Grammy' },
  { ico: '⚽', label: 'Esports i Eurovisió' },
  { ico: '📰', label: 'Actualitat política i social' },
];

export default function Actualitat() {
  const { t } = useT();
  const topics = TOPICS.filter((tp) => tp.category === 'actualitat');
  const totalQuestions = topics.reduce((acc, tp) => acc + tp.questions.length, 0);

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">Actualitat</span>
      </nav>

      {/* HERO */}
      <header
        className="card card-accent"
        style={{ ['--accent' as never]: ACCENT } as React.CSSProperties}
      >
        <div className="card-grid">
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: ACCENT } as React.CSSProperties}
          >
            <span style={{ fontSize: 30 }}>📰</span>
          </span>
          <div>
            <div className="eyebrow" style={{ color: ACCENT }}>
              📰 Actualitat 2025–2026
            </div>
            <h1 className="card-title xl mt-1">Actualitat — Policia Local</h1>
            <p className="card-desc">
              Càrrecs vigents, premis, esports i fets clau (actualitzat maig 2026).
              {' · '}
              <span className="font-mono">
                {totalQuestions} preguntes · {BLOCS.length} blocs temàtics
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ZONA DE TESTS · només el mode mesclat */}
      <section
        className="tests-zone"
        style={{
          background: 'linear-gradient(180deg, #FFE9D8 0%, var(--white) 60%)',
          borderColor: 'color-mix(in oklab, #F26B1F 28%, transparent)',
          boxShadow: '0 2px 14px -8px rgba(242, 107, 31, 0.22)',
        }}
      >
        <header className="tests-zone-head">
          <div className="eyebrow" style={{ color: ACCENT }}>
            📰 Test d'actualitat
          </div>
          <h2>Test d'actualitat 2025–2026</h2>
          <p>
            {totalQuestions} preguntes mesclades sobre càrrecs vigents, premis i fets
            recents — patrons d'exàmens oficials de Policia Local de Catalunya.
          </p>
        </header>

        {/* CTA gros: test mesclat de totes les preguntes d'actualitat */}
        <div className="tests-zone-modes" style={{ gridTemplateColumns: '1fr' }}>
          <Link to="/actualitat/tot" className="ts-mode featured">
            <span className="mtag">⚡ Pool d'actualitat</span>
            <div>
              <h3>Test mesclat d'actualitat</h3>
              <p>
                Totes les preguntes d'actualitat barrejades — càrrecs, premis,
                esports i fets recents.
              </p>
            </div>
            <div className="footer">
              <div className="specs">
                <span>{totalQuestions} preguntes</span>
                <span>·</span>
                <span>{BLOCS.length} blocs temàtics</span>
              </div>
              <span className="cta">
                ▶ {t('test.start')} <span className="arr">→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Llegenda informativa dels blocs (sense links a tests individuals) */}
        <div
          style={{
            marginTop: 24,
            padding: '16px 18px',
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid var(--line)',
            borderRadius: 14,
          }}
        >
          <div
            className="eyebrow"
            style={{ color: 'var(--text-3)', marginBottom: 10 }}
          >
            🗂️ Blocs temàtics inclosos al pool
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BLOCS.map((b) => (
              <span
                key={b.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: 'var(--paper-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--text-2)',
                }}
              >
                <span aria-hidden>{b.ico}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
