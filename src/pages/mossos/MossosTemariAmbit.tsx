// Llistat de temes d'un àmbit del temari de Mossos.
// Disseny basat en /leyes/s/<modul>: hero + llista de fitxes (.tool).
import { Link, useParams } from 'react-router-dom';
import { AMBIT_META, getTemesByAmbit, type MossosAmbit } from '../../lib/mossosTemari';
import { useT } from '../../lib/i18n';

const VALID: MossosAmbit[] = ['A', 'B', 'C'];

export default function MossosTemariAmbit() {
  const { ambit: rawAmbit = '' } = useParams();
  const { t } = useT();
  const ambit = rawAmbit.toUpperCase() as MossosAmbit;

  if (!VALID.includes(ambit)) {
    return (
      <div className="shell py-6">
        <p className="text-text-2">{t('section.notFound')}</p>
        <Link to="/mossos/temari" className="text-terracotta underline">
          ← {t('mossosTemari.title')}
        </Link>
      </div>
    );
  }

  const meta = AMBIT_META[ambit];
  const temes = getTemesByAmbit(ambit);

  return (
    <div className="shell">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/mossos">{t('mossos.title')}</Link>
        <span className="sep">/</span>
        <Link to="/mossos/temari">{t('mossosTemari.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{meta.short}</span>
      </nav>

      <header
        className="card card-accent"
        style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
      >
        <div className="card-grid" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
          >
            {meta.icon}
          </span>
          <div>
            <div className="eyebrow" style={{ color: meta.color }}>
              📚 {t('mossos.temari.eyebrow')}
            </div>
            <h1 className="card-title xl mt-1">{meta.label}</h1>
            <p className="card-desc">{meta.desc}</p>
          </div>
          <span
            className="chip self-center hidden sm:inline-flex"
            style={{
              background: 'var(--paper-2)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              color: 'var(--text-2)',
              fontWeight: 600,
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full mr-1.5"
              style={{ background: meta.color }}
            />
            {temes.length} {temes.length === 1 ? 'tema' : 'temes'}
          </span>
        </div>
      </header>

      {temes.length === 0 ? (
        <div className="mt-6 mb-8 rounded-md border border-dashed border-line p-8 text-center text-sm text-text-3 bg-paper-2">
          {t('section.empty')}
        </div>
      ) : (
        <ul className="mt-5 mb-10 grid gap-2.5">
          {temes.map((tm) => (
            <li key={tm.slug}>
              <Link
                to={`/mossos/temari/${ambit.toLowerCase()}/${tm.slug}`}
                className="tool"
                style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
              >
                <span
                  className="tool-icon"
                  style={{ background: meta.bg, color: meta.color, fontWeight: 700 }}
                >
                  {tm.tema}
                </span>
                <div className="min-w-0">
                  <h4>{tm.shortTitle}</h4>
                  <p className="line-clamp-1">{summary(tm.searchText)}</p>
                </div>
                <span
                  className="play"
                  style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function summary(text: string): string {
  const s = text.replace(/\s+/g, ' ').trim();
  return s.length > 140 ? s.slice(0, 137) + '…' : s;
}
