// Pàgina d'un mòdul · rebranding 2026.
// Hero amb stripe del mòdul + llistat de fitxes (.tool-style row).
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';

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

export default function Section() {
  const { moduleSlug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const { t } = useT();

  if (!mod) {
    return (
      <div className="shell py-6">
        <p className="text-text-2">{t('section.notFound')}</p>
        <Link to="/" className="text-terracotta underline">
          {t('back.home')}
        </Link>
      </div>
    );
  }

  const cards = getCardsByModule(moduleSlug);
  const modTitle = t(`module.${mod.slug}.title`);
  const modDesc = t(`module.${mod.slug}.desc`);
  const accent = MODULE_ACCENT[mod.slug] ?? 'var(--terracotta)';

  return (
    <div className="shell">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/leyes">{t('leyes.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{modTitle}</span>
      </nav>

      <header
        className="card card-accent"
        style={{ ['--accent' as never]: accent } as React.CSSProperties}
      >
        <div className="card-grid" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: accent } as React.CSSProperties}
          >
            {mod.icon}
          </span>
          <div>
            <div className="eyebrow" style={{ color: accent }}>
              {t('home.leyes.badge')}
            </div>
            <h1 className="card-title xl mt-1">{modTitle}</h1>
            <p className="card-desc">{modDesc}</p>
          </div>
          <span className="chip self-center hidden sm:inline-flex"
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
              style={{ background: accent }}
            />
            {cards.length} {plural(t, cards.length, 'cards')}
          </span>
        </div>
      </header>

      {cards.length === 0 ? (
        <div className="mt-6 mb-8 rounded-md border border-dashed border-line p-8 text-center text-sm text-text-3 bg-paper-2">
          {t('section.empty')}
        </div>
      ) : (
        <ul className="mt-5 mb-10 grid gap-2.5">
          {cards.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/leyes/s/${c.moduleSlug}/${c.slug}`}
                className="tool"
                style={{ ['--accent' as never]: accent } as React.CSSProperties}
              >
                <span
                  className="tool-icon"
                  style={{ background: 'var(--paper-2)' }}
                >
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <h4>{c.title}</h4>
                  <p className="line-clamp-1">{summary(c.searchText)}</p>
                </div>
                <span
                  className="play"
                  style={{ ['--accent' as never]: accent } as React.CSSProperties}
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
