// Pàgina d'índex de Cultura General · pool mesclat.
// L'usuari va decidir treure els tests per matèria — totes les preguntes
// sortejen barrejades del mode "Tots els temes" (/cultura-general/tot).
// Aquí només mostrem hero + CTA gros + petita llegenda de matèries
// incloses (informativa, sense links a tests per matèria).
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS } from '../data/tests';

const ACCENT = '#9747D6';

export default function CulturaGeneral() {
  const { t } = useT();
  const culturaTopics = TOPICS.filter((tp) => tp.category === 'cultura');
  const totalQuestions = culturaTopics.reduce((acc, tp) => acc + tp.questions.length, 0);

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('cultura.title')}</span>
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
            <span style={{ fontSize: 30 }}>🎓</span>
          </span>
          <div>
            <div className="eyebrow" style={{ color: ACCENT }}>
              {t('cultura.badge')}
            </div>
            <h1 className="card-title xl mt-1">{t('cultura.title')}</h1>
            <p className="card-desc">
              {t('cultura.testsSubtitle')}
              {' · '}
              <span className="font-mono">
                {culturaTopics.length} {t('cultura.subjects')} · {totalQuestions} preguntes
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ZONA DE TESTS · només el mode mesclat */}
      <section
        className="tests-zone"
        style={{
          background: 'linear-gradient(180deg, #F5E9FF 0%, var(--white) 60%)',
          borderColor: 'color-mix(in oklab, #9747D6 28%, transparent)',
          boxShadow: '0 2px 14px -8px rgba(151, 71, 214, 0.22)',
        }}
      >
        <header className="tests-zone-head">
          <div className="eyebrow" style={{ color: ACCENT }}>
            🎓 {t('cultura.zoneEyebrow')}
          </div>
          <h2>{t('cultura.zoneTitle')}</h2>
          <p>{t('cultura.zoneSubtitle').replace('{n}', String(totalQuestions))}</p>
        </header>

        {/* CTA gros: test mesclat de totes les matèries */}
        <div className="tests-zone-modes" style={{ gridTemplateColumns: '1fr' }}>
          <Link to="/cultura-general/tot" className="ts-mode featured">
            <span className="mtag">⚡ {t('cultura.allTag')}</span>
            <div>
              <h3>{t('cultura.allTitle')}</h3>
              <p>{t('cultura.allSub')}</p>
            </div>
            <div className="footer">
              <div className="specs">
                <span>{totalQuestions} preguntes</span>
                <span>·</span>
                <span>{culturaTopics.length} matèries mesclades</span>
              </div>
              <span className="cta">
                ▶ {t('test.start')} <span className="arr">→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Llegenda informativa de matèries incloses (sense links) */}
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
            📚 Matèries incloses al pool
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {culturaTopics.map((topic) => (
              <span
                key={topic.slug}
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
                <span aria-hidden>{topic.icon}</span>
                {topic.title}
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: 'var(--text-3)',
                  }}
                >
                  {topic.questions.length}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
