// Pàgina de "Lleis" · rebranding 2026.
// Hero card amb stripe groc + grid de 9 mòduls (.ley-card) amb accent per mòdul.
import { Link } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';

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
  'transit': '#F26B1F',
};

function IconLeyes() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="m4 13 2-6 2 6c0 1.5-1 2.5-2 2.5s-2-1-2-2.5Z" />
      <path d="m16 13 2-6 2 6c0 1.5-1 2.5-2 2.5s-2-1-2-2.5Z" />
    </svg>
  );
}

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

      {/* Hero card */}
      <header
        className="card card-accent"
        style={{ ['--accent' as never]: 'var(--c-leyes)' } as React.CSSProperties}
      >
        <div className="card-grid">
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: 'var(--c-leyes)' } as React.CSSProperties}
          >
            <IconLeyes />
          </span>
          <div>
            <div className="eyebrow" style={{ color: 'var(--c-leyes)' }}>
              {t('home.leyes.badge')}
            </div>
            <h1 className="card-title xl mt-1">{t('leyes.title')}</h1>
            <p className="card-desc">
              {t('leyes.subtitle')}
              {' · '}
              <span className="font-mono">
                {MODULES.length} {t('home.sections').toLowerCase()} · {totalCards}{' '}
                {plural(t, totalCards, 'cards')}
              </span>
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
