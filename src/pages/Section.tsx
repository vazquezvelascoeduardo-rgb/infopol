// Pàgina d'un mòdul · rebranding 2026.
// Hero amb stripe del mòdul + llistat de fitxes (.tool-style row).
import { Link, useParams, useLocation } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';
import { A, Mono } from '../lib/design';

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
  const location = useLocation();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const { t } = useT();
  // Si venim del temari de l'Acadèmia, els enllaços a les fitxes es queden
  // dins del marc de l'Acadèmia (no salten al shell d'Operativa).
  const cardBase = location.pathname.startsWith('/academia/temari') ? '/academia/temari' : '/leyes/s';

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

      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, color: '#fff', padding: 'clamp(22px,3vw,30px)', boxShadow: A.shadowMd, background: `linear-gradient(150deg, ${accent}, color-mix(in srgb, ${accent} 78%, #000))` }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 28, boxShadow: A.inset }}>{mod.icon}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Mono size={11} color="rgba(255,255,255,0.85)">{t('home.leyes.badge')}</Mono>
            <h1 style={{ margin: '6px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.4vw,34px)', letterSpacing: -1, lineHeight: 1.05 }}>{modTitle}</h1>
            <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.5, opacity: 0.92, maxWidth: 520 }}>{modDesc}</p>
          </div>
          <span style={{ alignSelf: 'center', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.16)', borderRadius: 999, padding: '7px 13px', fontFamily: A.mono, fontWeight: 600, fontSize: 12, color: '#fff' }} className="hidden sm:inline-flex">
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
                to={`${cardBase}/${c.moduleSlug}/${c.slug}`}
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
