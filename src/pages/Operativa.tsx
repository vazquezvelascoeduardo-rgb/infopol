// Pàgina principal del bloc "Operativa" · rebranding 2026.
// Hero card + 2 grans cards (Trànsit + SC/Penal) + grid 6 procediments destacats.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';

/* ── Icones inline ───────────────────────────────────────────── */
function IconShield() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18h14" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 7V4" />
      <path d="m9 5 1 2" />
      <path d="m15 5-1 2" />
    </svg>
  );
}
function IconSC() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v7c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5z" />
    </svg>
  );
}

type Proc = {
  to: string;
  accent: string;
  eyebrowKey: string;
  titleKey: string;
  descKey: string;
};

const PROCS: Proc[] = [
  {
    to: '/operativa/trafico/alcoholemia',
    accent: 'var(--c-trafico)',
    eyebrowKey: 'operativa.proc.alcoholemia.eyebrow',
    titleKey: 'operativa.proc.alcoholemia.title',
    descKey: 'operativa.proc.alcoholemia.desc',
  },
  {
    to: '/operativa/penal/identificacio',
    accent: '#2a3a52',
    eyebrowKey: 'operativa.proc.identificacio.eyebrow',
    titleKey: 'operativa.proc.identificacio.title',
    descKey: 'operativa.proc.identificacio.desc',
  },
  {
    to: '/operativa/penal/violencia-genere',
    accent: 'var(--c-alcoholemia)',
    eyebrowKey: 'operativa.proc.vg.eyebrow',
    titleKey: 'operativa.proc.vg.title',
    descKey: 'operativa.proc.vg.desc',
  },
  {
    to: '/operativa/penal/detencio',
    accent: 'var(--c-superbuscador)',
    eyebrowKey: 'operativa.proc.detencio.eyebrow',
    titleKey: 'operativa.proc.detencio.title',
    descKey: 'operativa.proc.detencio.desc',
  },
  {
    to: '/operativa/trafico/accident',
    accent: 'var(--c-trafico)',
    eyebrowKey: 'operativa.proc.accident.eyebrow',
    titleKey: 'operativa.proc.accident.title',
    descKey: 'operativa.proc.accident.desc',
  },
  {
    to: '/operativa/trafico/doc-falsa',
    accent: 'var(--c-recursos)',
    eyebrowKey: 'operativa.proc.docs.eyebrow',
    titleKey: 'operativa.proc.docs.title',
    descKey: 'operativa.proc.docs.desc',
  },
];

export default function Operativa() {
  const { t } = useT();

  return (
    <div className="shell">
      {/* Crumbs */}
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('operativa.title')}</span>
      </nav>

      {/* Hero card */}
      <header
        className="card card-accent"
        style={{ ['--accent' as never]: 'var(--c-operativa)' } as React.CSSProperties}
      >
        <div className="card-grid">
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: 'var(--c-operativa)' } as React.CSSProperties}
          >
            <IconShield />
          </span>
          <div>
            <div className="eyebrow" style={{ color: 'var(--c-operativa)' }}>
              {t('operativa.badge')}
            </div>
            <h1 className="card-title xl mt-1">{t('operativa.title')}</h1>
            <p className="card-desc">{t('operativa.subtitle')}</p>
          </div>
        </div>
      </header>

      {/* 2 cards principals — Trànsit + SC/Penal */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[18px]">
        <Link
          to="/operativa/trafico"
          className="card card-accent"
          style={{ ['--accent' as never]: 'var(--c-trafico)' } as React.CSSProperties}
        >
          <div className="card-grid">
            <span
              className="appicon lg"
              style={{ ['--accent' as never]: 'var(--c-trafico)' } as React.CSSProperties}
            >
              🚦
            </span>
            <div>
              <h2 className="card-title lg">{t('operativa.trafico.title')}</h2>
              <p className="card-desc">
                {t('operativa.trafico.desc')}. {t('home.cataleg.desc')}
              </p>
              <span className="card-cta" style={{ ['--accent' as never]: 'var(--c-trafico)' } as React.CSSProperties}>
                {t('operativa.open')} <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </Link>
        <Link
          to="/operativa/penal"
          className="card card-accent"
          style={{ ['--accent' as never]: '#2a3a52' } as React.CSSProperties}
        >
          <div className="card-grid">
            <span
              className="appicon lg"
              style={{ ['--accent' as never]: '#2a3a52' } as React.CSSProperties}
            >
              <IconSC />
            </span>
            <div>
              <h2 className="card-title lg">{t('operativa.seguretat-ciutadana.title')}</h2>
              <p className="card-desc">{t('operativa.seguretat-ciutadana.desc')}</p>
              <span className="card-cta" style={{ ['--accent' as never]: '#2a3a52' } as React.CSSProperties}>
                {t('operativa.open')} <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Procediments destacats */}
      <div className="section-head">
        <span className="eyebrow">{t('operativa.destacats.eyebrow')}</span>
        <span className="rule" />
        <Link to="/operativa/penal" className="see-all" style={{ color: 'var(--terracotta)' }}>
          {t('operativa.destacats.viewAll')} →
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {PROCS.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="proc"
            style={{ ['--accent' as never]: p.accent } as React.CSSProperties}
          >
            <span className="dot" />
            <div>
              <div className="eyebrow" style={{ color: 'var(--text-3)' }}>
                {t(p.eyebrowKey)}
              </div>
              <h4>{t(p.titleKey)}</h4>
              <p>{t(p.descKey)}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
