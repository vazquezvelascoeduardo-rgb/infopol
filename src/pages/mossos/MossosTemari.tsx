// Temari oficial de Mossos d'Esquadra · índex amb 3 àmbits.
// Disseny basat en /leyes (rebranding 2026): hero card + grid de mòduls.
import { Link } from 'react-router-dom';
import { AMBIT_META, getTemesByAmbit, type MossosAmbit } from '../../lib/mossosTemari';
import { useT } from '../../lib/i18n';

const AMBITS: MossosAmbit[] = ['A', 'B', 'C'];

function IconBook() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

export default function MossosTemari() {
  const { t } = useT();
  const totalTemes = AMBITS.reduce((acc, a) => acc + getTemesByAmbit(a).length, 0);

  return (
    <div className="shell">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/academia">{t('sidebar.academia')}</Link>
        <span className="sep">/</span>
        <Link to="/mossos">{t('mossos.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('mossos.temari.eyebrow')}</span>
      </nav>

      {/* Hero card */}
      <header
        className="card card-accent"
        style={{ ['--accent' as never]: '#9A5B00' } as React.CSSProperties}
      >
        <div className="card-grid">
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: '#9A5B00' } as React.CSSProperties}
          >
            <IconBook />
          </span>
          <div>
            <div className="eyebrow" style={{ color: '#9A5B00' }}>
              📚 {t('mossos.temari.eyebrow')}
            </div>
            <h1 className="card-title xl mt-1">{t('mossosTemari.title')}</h1>
            <p className="card-desc">
              {t('mossosTemari.subtitle')}
              {' · '}
              <span className="font-mono">
                {AMBITS.length} {t('mossosTemari.ambits')} · {totalTemes} {t('mossosTemari.temes')}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* Section head */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: '#9A5B00' } as React.CSSProperties}
      >
        <span className="eyebrow">{t('mossosTemari.ambits')}</span>
        <span className="rule" />
      </div>

      {/* Grid de 3 àmbits */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-10">
        {AMBITS.map((ambit) => {
          const meta = AMBIT_META[ambit];
          const count = getTemesByAmbit(ambit).length;
          return (
            <li key={ambit}>
              <Link
                to={`/mossos/temari/${ambit.toLowerCase()}`}
                className="ley-card"
                style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
              >
                <span
                  className="appicon"
                  style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
                >
                  {meta.icon}
                </span>
                <div>
                  <h3>{meta.short}</h3>
                  <p>{meta.desc}</p>
                  <span className="chip">
                    📑 {count} {count === 1 ? 'tema' : 'temes'}
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
