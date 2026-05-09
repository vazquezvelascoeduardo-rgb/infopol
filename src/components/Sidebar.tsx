// Menú lateral desplegable · rebranding 2026.
// Slide-in des de la dreta amb backdrop. Estructura del disseny:
//   Header amb shield + wordmark + close
//   Nav: Inicio · Tests (badge) · Superbuscador · Recursos · Actualidad · Cultura
//   Lleis (col·lapsable) i Operativa (col·lapsable)
//   Ajustes: Idioma · Tema · Mida text
//   CTA: Sugerir mejora
//   Foot: versió + enllaços
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useT } from '../lib/i18n';
import { useFailuresCounts } from '../lib/failures';
import { useUnreadNoticiesCount } from '../lib/noticies';
import { useAuth } from '../lib/auth';
import LoginModal from './LoginModal';
import type { Theme } from '../lib/theme';
import { applyTextSize, getInitialTextSize, type TextSize } from '../lib/fontSize';

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
};

/* ── Icones (mateix style que el disseny) ────────────────────── */
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}
function IconTests() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </svg>
  );
}
function IconRecursos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}
function IconActualidad() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 12h10M7 15h6" />
    </svg>
  );
}
function IconCultura() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9 12 4l10 5-10 5z" />
      <path d="M6 11v5c0 2 3 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}
function IconLang() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18A14 14 0 0 1 12 3" />
    </svg>
  );
}
function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}
function IconText() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6M12 4v16" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function BrandShield() {
  // Shield-i (rebranding 2026): mateix mark que la topbar, en path-only.
  return (
    <svg width="28" height="32" viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z"
        fill="var(--ink)"
      />
      <circle cx="32" cy="22" r="4.2" fill="var(--terracotta)" />
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill="var(--terracotta)" />
    </svg>
  );
}

export default function Sidebar({ open, onClose, theme, onThemeChange }: Props) {
  const { t, locale, setLocale } = useT();
  const location = useLocation();
  const [textSize, setTextSize] = useState<TextSize>(() => getInitialTextSize());
  const failures = useFailuresCounts();
  const unreadNoticies = useUnreadNoticiesCount();
  const auth = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  function changeTextSize(s: TextSize) {
    setTextSize(s);
    applyTextSize(s);
  }

  // Tanca el menú quan canviem de ruta.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Tanca amb la tecla Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Bloqueig de l'scroll del body mentre el menú està obert.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const path = location.pathname;
  const isActive = (...prefixes: string[]) =>
    prefixes.some((p) => (p === '/' ? path === '/' : path.startsWith(p)));

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer (lliscant des de la dreta) */}
      <aside
        role="dialog"
        aria-label={t('sidebar.title')}
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-paper text-ink shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sb">
          <header className="sb-head">
            <Link to="/" className="brand" onClick={onClose}>
              <BrandShield />
            </Link>
            <span className="brand-wordmark" style={{ fontSize: 20 }}>
              <span className="info">info</span>
              <span className="pol">pol</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="sb-close"
              aria-label={t('sidebar.close')}
            >
              <IconClose />
            </button>
          </header>

          {/* Caixa de sessió — només visible si el backend està
              configurat al build (variables VITE_SUPABASE_*). */}
          {auth.backendEnabled && (
            <div className="sb-session">
              {auth.isAuthenticated && auth.user ? (
                (() => {
                  const displayName =
                    auth.profile?.name
                    ?? auth.user.user_metadata?.full_name
                    ?? auth.user.user_metadata?.name
                    ?? auth.user.email
                    ?? '?';
                  // Sub-text: cuerpo + dept del profile si en tenim;
                  // si no, "Progrés sincronitzat" + XP del user_progress.
                  const subParts: string[] = [];
                  if (auth.profile?.cuerpo) subParts.push(auth.profile.cuerpo);
                  if (auth.profile?.department) subParts.push(auth.profile.department);
                  if (subParts.length === 0 && auth.progress) {
                    subParts.push(`${auth.progress.xp.toLocaleString('es-ES')} XP`);
                  }
                  if (subParts.length === 0) subParts.push(t('sidebar.session.synced'));
                  return (
                    <div className="sb-user">
                      <span className="sb-user-avatar">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                      <div className="sb-user-meta">
                        <span className="sb-user-name">{displayName}</span>
                        <span className="sb-user-sub">{subParts.join(' · ')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          void auth.signOut();
                        }}
                        className="sb-user-logout"
                      >
                        {t('sidebar.session.signOut')}
                      </button>
                    </div>
                  );
                })()
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="sb-login"
                >
                  <span aria-hidden>🔐</span>
                  <span>{t('sidebar.session.signIn')}</span>
                  <span aria-hidden className="sb-login-arr">→</span>
                </button>
              )}
            </div>
          )}

          {/* Navegació principal */}
          <nav className="sb-section pt-2.5">
            <Link
              to="/"
              className={`sb-item ${isActive('/') && path === '/' ? 'active' : ''}`}
            >
              <span className="sb-icon ic-bg-orange"><IconHome /></span>
              <span>{t('sidebar.home')}</span>
              <span />
            </Link>

            <Link
              to="/test"
              className={`sb-item ${isActive('/test') ? 'active' : ''}`}
            >
              <span className="sb-icon ic-bg-blue"><IconTests /></span>
              <span>{t('sidebar.tests')}</span>
              {failures.due > 0 ? (
                <span className="sb-badge" title={t('sidebar.tests.duePending')}>
                  🔁 {failures.due}
                </span>
              ) : (
                <span className="sb-badge">📚 {t('sidebar.tests.badge')}</span>
              )}
            </Link>

            <Link
              to="/superbuscador"
              className={`sb-item ${isActive('/superbuscador') ? 'active' : ''}`}
            >
              <span className="sb-icon ic-bg-purple"><IconSearch /></span>
              <span>{t('sidebar.superbuscador')}</span>
              <span />
            </Link>

            <Link
              to="/recursos"
              className={`sb-item ${isActive('/recursos') ? 'active' : ''}`}
            >
              <span className="sb-icon ic-bg-green"><IconRecursos /></span>
              <span>{t('sidebar.recursos')}</span>
              <span />
            </Link>

            <Link
              to="/noticies"
              className={`sb-item ${isActive('/noticies') ? 'active' : ''}`}
            >
              <span className="sb-icon ic-bg-blue"><IconActualidad /></span>
              <span>{t('sidebar.noticies')}</span>
              {unreadNoticies > 0 ? (
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: '#E5484D' }}
                  aria-label={`${unreadNoticies} ${t('sidebar.noticies.unreadAria')}`}
                />
              ) : (
                <span />
              )}
            </Link>

            <Link
              to="/cultura-general"
              className={`sb-item ${isActive('/cultura-general') ? 'active' : ''}`}
            >
              <span className="sb-icon ic-bg-yellow"><IconCultura /></span>
              <span>{t('sidebar.cultura')}</span>
              <span />
            </Link>
          </nav>

          <div className="sb-divider" />

          {/* Lleis i Operativa col·lapsables */}
          <nav className="sb-section">
            <details className="group">
              <summary
                className={`sb-item list-none ${isActive('/leyes') ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <span className="sb-icon ic-bg-yellow">⚖️</span>
                <Link
                  to="/leyes"
                  onClick={(e) => e.stopPropagation()}
                  className="text-inherit no-underline flex-1"
                >
                  {t('sidebar.leyes')}
                </Link>
                <span className="arr">▸</span>
              </summary>
              <div className="pl-2 mt-1 space-y-0.5">
                {MODULES.map((m) => (
                  <SubLink
                    key={m.slug}
                    to={`/leyes/s/${m.slug}`}
                    icon={m.icon}
                    label={t(`module.${m.slug}.title`)}
                    active={path.startsWith(`/leyes/s/${m.slug}`)}
                  />
                ))}
              </div>
            </details>

            <details className="group">
              <summary
                className={`sb-item list-none ${isActive('/operativa') ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <span className="sb-icon ic-bg-blue">🚨</span>
                <Link
                  to="/operativa"
                  onClick={(e) => e.stopPropagation()}
                  className="text-inherit no-underline flex-1"
                >
                  {t('sidebar.operativa')}
                </Link>
                <span className="arr">▸</span>
              </summary>
              <div className="pl-2 mt-1 space-y-0.5">
                <SubLink
                  to="/operativa/trafico"
                  icon="🚦"
                  label={t('operativa.trafico.title')}
                  active={path.startsWith('/operativa/trafico')}
                />
                <SubLink
                  to="/operativa/penal"
                  icon="🛡️"
                  label={t('operativa.seguretat-ciutadana.title')}
                  active={path.startsWith('/operativa/penal') &&
                    !path.startsWith('/operativa/penal/taula') &&
                    !path.startsWith('/operativa/penal/recursos') &&
                    !path.startsWith('/operativa/penal/drets-detingut')}
                />
                <div className="sb-label">{t('sidebar.references')}</div>
                <SubLink to="/operativa/penal/taula-actes" icon="📋" label={t('penal.taulaActes')} active={path.startsWith('/operativa/penal/taula-actes')} />
                <SubLink to="/operativa/penal/taula-drogues" icon="💊" label={t('penal.taulaDrogues')} active={path.startsWith('/operativa/penal/taula-drogues')} />
                <SubLink to="/operativa/penal/recursos" icon="📞" label={t('penal.recursos')} active={path.startsWith('/operativa/penal/recursos')} />
                <SubLink to="/operativa/penal/drets-detingut" icon="📜" label={t('penal.dretsDetingut')} active={path.startsWith('/operativa/penal/drets-detingut')} />
              </div>
            </details>
          </nav>

          <div className="sb-divider" />

          {/* Ajustes */}
          <div className="sb-label">{t('sidebar.settings')}</div>
          <div className="sb-section">
            {/* Idioma */}
            <div className="sb-setting">
              <span className="sb-setting-icon"><IconLang /></span>
              <span className="sb-setting-label">{t('sidebar.language')}</span>
              <div className="seg" role="group">
                <button
                  type="button"
                  className={locale === 'es' ? 'on' : ''}
                  onClick={() => setLocale('es')}
                  aria-pressed={locale === 'es'}
                >ES</button>
                <button
                  type="button"
                  className={locale === 'ca' ? 'on' : ''}
                  onClick={() => setLocale('ca')}
                  aria-pressed={locale === 'ca'}
                >CA</button>
              </div>
            </div>

            {/* Tema */}
            <div className="sb-setting">
              <span className="sb-setting-icon">{theme === 'dark' ? <IconMoon /> : <IconSun />}</span>
              <span className="sb-setting-label">{t('sidebar.theme')}</span>
              <div className="theme-pick" role="group">
                <button
                  type="button"
                  className={`theme-chip ${theme === 'light' ? 'on' : ''}`}
                  onClick={() => onThemeChange('light')}
                  aria-pressed={theme === 'light'}
                >
                  <span className="swatch" style={{ background: 'var(--terracotta)' }} />
                  {t('theme.light')}
                </button>
                <button
                  type="button"
                  className={`theme-chip dark ${theme === 'dark' ? 'on' : ''}`}
                  onClick={() => onThemeChange('dark')}
                  aria-pressed={theme === 'dark'}
                >
                  <span
                    className="swatch"
                    style={{ background: theme === 'dark' ? '#fff' : 'var(--ink)' }}
                  />
                  {t('theme.dark')}
                </button>
              </div>
            </div>

            {/* Mida del text */}
            <div className="sb-setting">
              <span className="sb-setting-icon"><IconText /></span>
              <span className="sb-setting-label">{t('sidebar.textSize')}</span>
              <div className="tsize" role="group">
                {(['sm', 'md', 'lg'] as TextSize[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`${val === 'sm' ? 's' : val === 'md' ? 'm' : 'l'} ${textSize === val ? 'on' : ''}`}
                    onClick={() => changeTextSize(val)}
                    aria-pressed={textSize === val}
                    title={t(`sidebar.textSize.${val}`)}
                  >A</button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA: Sugerir mejora — enllaça a mailto suport */}
          <a
            href="mailto:suport@infopol.app?subject=InfoPol%20%E2%80%94%20Suggeriment"
            className="sb-cta"
          >
            <span className="ic">📤</span>
            <div>
              <h5>{t('sidebar.cta.title')}</h5>
              <p>{t('sidebar.cta.desc')}</p>
            </div>
          </a>

          {/* Footer */}
          <footer className="sb-foot">
            <strong>infopol</strong> · {t('footer.unofficial')}
            <div className="sb-foot-row">
              <span>v3.0</span>
              <span>·</span>
              <Link to="/avis-legal" onClick={onClose}>{t('footer.legal')}</Link>
              <span>·</span>
              <Link to="/privacitat" onClick={onClose}>{t('footer.privacy')}</Link>
            </div>
          </footer>
        </div>
      </aside>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

function SubLink({
  to, icon, label, active,
}: {
  to: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className="sb-item"
      style={{
        padding: '7px 12px 7px 36px',
        fontSize: 13,
        ...(active ? { background: 'var(--paper-2)', color: 'var(--terracotta)' } : {}),
      }}
    >
      <span aria-hidden style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{icon}</span>
      <span className="leading-tight">{label}</span>
      <span />
    </Link>
  );
}
