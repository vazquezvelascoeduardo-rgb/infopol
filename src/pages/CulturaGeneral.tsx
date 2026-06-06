// Pàgina d'índex de Cultura General · pool mesclat.
// L'usuari va decidir treure els tests per matèria — totes les preguntes
// sortejen barrejades del mode "Tots els temes" (/cultura-general/tot).
// Aquí només mostrem hero + CTA gros + petita llegenda de matèries
// incloses (informativa, sense links a tests per matèria).
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS } from '../data/tests';
import { A, Mono } from '../lib/design';

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

      {/* HERO amb degradat */}
      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, color: '#fff', padding: 'clamp(22px,3vw,30px)', boxShadow: A.shadowMd, background: `linear-gradient(150deg, ${ACCENT}, #5B2C9E)`, marginBottom: 8 }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 28, boxShadow: A.inset }}>🎓</span>
          <div style={{ minWidth: 0 }}>
            <Mono size={11} color="rgba(255,255,255,0.85)">{t('cultura.badge')}</Mono>
            <h1 style={{ margin: '6px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.4vw,34px)', letterSpacing: -1, lineHeight: 1.05 }}>{t('cultura.title')}</h1>
            <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.5, opacity: 0.92, maxWidth: 520 }}>{t('cultura.testsSubtitle')} · {culturaTopics.length} {t('cultura.subjects')} · {totalQuestions} preguntes</p>
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

        {/* 2 modes: Temari de repàs (estudi) + Test mesclat.
            (Sense gridTemplateColumns inline: la classe ja fa 2 columnes a
            desktop i 1 a mòbil; l'inline trencava el responsive.) */}
        <div className="tests-zone-modes">
          {/* Temari de repàs (fitxa d'estudi nova) */}
          <Link
            to="/cultura-general/temari"
            className="ts-mode featured"
            style={{
              ['--accent' as never]: '#FF7A1A',
              background: 'linear-gradient(135deg, #FF7A1A 0%, #E85D04 100%)',
              borderColor: '#E85D04',
              color: '#fff',
            } as React.CSSProperties}
          >
            <span className="mtag" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>📖 Fitxa de repàs</span>
            <div>
              <h3 style={{ color: '#fff' }}>Temari de cultura general</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)' }}>16 àrees i +400 fets clau per repassar de pressa abans del test.</p>
            </div>
            <div className="footer">
              <div className="specs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span>16 àrees</span>
                <span>·</span>
                <span>repàs ràpid</span>
              </div>
              <span className="cta" style={{ color: '#E85D04' }}>
                📚 Estudiar <span className="arr">→</span>
              </span>
            </div>
          </Link>

          {/* Test mesclat de totes les matèries */}
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
                <span>{culturaTopics.length} matèries</span>
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
