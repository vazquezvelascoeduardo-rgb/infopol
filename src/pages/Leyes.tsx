// Pàgina de "Lleis" · rebranding 2026.
// Hero card amb stripe groc + grid de 9 mòduls (.ley-card) amb accent per mòdul.
import { Link } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';
import { A, Ic, Mono } from '../lib/design';

// Accent de color per mòdul (rebranding 2026).
const MODULE_ACCENT: Record<string, string> = {
  'ce78': '#E5484D',
  'codi-penal': '#C13030',
  'eac': '#E89A1C',
  'fcs': '#2F6BD8',
  'lecrim': '#9747D6',
  'menors': '#E85D8C',
  'municipi': '#2FB66B',
  'sc': '#2a3a52',
  'transit': '#FF7A1A',
};

export default function Leyes() {
  const { t } = useT();
  const totalCards = MODULES.reduce((acc, m) => acc + getCardsByModule(m.slug).length, 0);

  return (
    <div className="shell">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('leyes.title')}</span>
      </nav>

      {/* Hero amb degradat (estil Claude Design) */}
      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: `linear-gradient(150deg, ${A.amber}, #B8770E)`, color: '#fff', padding: 'clamp(22px,3vw,30px)', boxShadow: A.shadowMd, marginBottom: 8 }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: A.inset }}><Ic name="scale" size={28} color="#fff" sw={2.2} /></span>
          <div style={{ minWidth: 0 }}>
            <Mono size={11} color="rgba(255,255,255,0.85)">{t('home.leyes.badge')}</Mono>
            <h1 style={{ margin: '6px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.4vw,34px)', letterSpacing: -1, lineHeight: 1.05 }}>{t('leyes.title')}</h1>
            <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.5, opacity: 0.92, maxWidth: 520 }}>
              {t('leyes.subtitle')} · {MODULES.length} {t('home.sections').toLowerCase()} · {totalCards} {plural(t, totalCards, 'cards')}
            </p>
          </div>
        </div>
      </header>

      {/* Section head */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--c-leyes)' } as React.CSSProperties}
      >
        <span className="eyebrow">{t('home.sections')}</span>
        <span className="rule" />
      </div>

      {/* Grid de mòduls */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-10">
        {MODULES.map((m) => {
          const count = getCardsByModule(m.slug).length;
          const title = t(`module.${m.slug}.title`);
          const desc = t(`module.${m.slug}.desc`);
          const accent = MODULE_ACCENT[m.slug] ?? 'var(--terracotta)';
          return (
            <li key={m.slug}>
              <Link
                to={`/leyes/s/${m.slug}`}
                className="ley-card"
                style={{ ['--accent' as never]: accent } as React.CSSProperties}
              >
                <span
                  className="appicon"
                  style={{ ['--accent' as never]: accent } as React.CSSProperties}
                >
                  {m.icon}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="chip">
                    📑 {count} {plural(t, count, 'cards')}
                  </span>
                </div>
                <span className="arr">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
