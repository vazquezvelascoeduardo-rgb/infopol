// Menú lateral desplegable amb totes les categories de l'app.
// S'obre des del botó hamburguesa de la capçalera. Slide-in des de
// l'esquerra amb un backdrop semitransparent que tanca al clicar fora.
//
// Estructura:
//   🏠 Inici
//   🔍 Superbuscador trànsit
//   ⚖️ Lleis (col·lapsable → 9 mòduls)
//   🚨 Operativa (col·lapsable → Trànsit + Seguretat Ciutadana + 4
//       referències ràpides)
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useT } from '../lib/i18n';
import { useFailuresCounts } from '../lib/failures';
import { useUnreadNoticiesCount } from '../lib/noticies';
import type { Theme } from '../lib/theme';
import { applyTextSize, getInitialTextSize, type TextSize } from '../lib/fontSize';

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
};

export default function Sidebar({ open, onClose, theme, onThemeChange }: Props) {
  const { t, locale, setLocale } = useT();
  const location = useLocation();
  const [textSize, setTextSize] = useState<TextSize>(() => getInitialTextSize());

  function changeTextSize(s: TextSize) {
    setTextSize(s);
    applyTextSize(s);
  }

  // Tanca el menú quan canviem de ruta (l'usuari ha clicat un enllaç).
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
        className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto
          bg-white text-slate-900 shadow-2xl
          dark:bg-[#0a1628] dark:text-slate-100
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Capçalera amb botó tancar */}
        <header className="sticky top-0 flex items-center gap-3 border-b px-4 py-3
          border-slate-200 bg-white/95 backdrop-blur
          dark:border-white/10 dark:bg-[#0a1628]/95">
          <span className="text-xl" aria-hidden>🚓</span>
          <div className="font-black text-lg flex-1">
            Info<span className="text-blue-700 dark:text-blue-400">Pol</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('sidebar.close')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg
              text-slate-500 hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Contingut */}
        <nav className="px-3 py-3 space-y-1 text-sm">
          {/* Inici */}
          <SimpleLink to="/" icon="🏠" label={t('sidebar.home')} />

          {/* Tests — entrada destacada */}
          <TestsFeatureLink t={t} />

          {/* Superbuscador */}
          <SimpleLink
            to="/superbuscador"
            icon="💸"
            label={t('sidebar.superbuscador')}
            accent="purple"
          />

          {/* Recursos rapids */}
          <SimpleLink
            to="/recursos"
            icon="🧰"
            label={t('sidebar.recursos')}
          />

          {/* Noticies */}
          <NoticiesLink t={t} />

          {/* Cultura General */}
          <SimpleLink
            to="/cultura-general"
            icon="🎓"
            label={t('sidebar.cultura')}
          />

          {/* Lleis (col·lapsable) — el chevron desplega les categories;
              el titol mateix es enllaç al llistat complet. */}
          <details className="group rounded-lg border border-slate-200/70 dark:border-white/10 mt-2">
            <summary className="flex items-center gap-3 px-3 py-2.5 cursor-pointer
              hover:bg-amber-50 dark:hover:bg-white/5 rounded-lg select-none">
              <span aria-hidden className="text-lg">⚖️</span>
              <Link
                to="/leyes"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold flex-1 hover:text-amber-700 dark:hover:text-amber-400"
              >
                {t('sidebar.leyes')}
              </Link>
              <span aria-hidden className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="border-t border-slate-200/70 dark:border-white/10">
              {MODULES.map((m) => (
                <SubLink
                  key={m.slug}
                  to={`/leyes/s/${m.slug}`}
                  icon={m.icon}
                  label={t(`module.${m.slug}.title`)}
                />
              ))}
            </div>
          </details>

          {/* Operativa (col·lapsable) — el titol enllaca al llistat
              i el chevron desplega les sub-categories. */}
          <details className="group rounded-lg border border-slate-200/70 dark:border-white/10 mt-2">
            <summary className="flex items-center gap-3 px-3 py-2.5 cursor-pointer
              hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg select-none">
              <span aria-hidden className="text-lg">🚨</span>
              <Link
                to="/operativa"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold flex-1 hover:text-blue-700 dark:hover:text-blue-400"
              >
                {t('sidebar.operativa')}
              </Link>
              <span aria-hidden className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="border-t border-slate-200/70 dark:border-white/10">
              <SubLink to="/operativa/trafico" icon="🚦" label={t('operativa.trafico.title')} />
              <SubLink
                to="/operativa/penal"
                icon="🛡️"
                label={t('operativa.seguretat-ciutadana.title')}
              />
              <div className="my-1 px-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-1.5">
                  {t('sidebar.references')}
                </div>
              </div>
              <SubLink to="/operativa/penal/taula-actes" icon="📋" label={t('penal.taulaActes')} />
              <SubLink to="/operativa/penal/taula-drogues" icon="💊" label={t('penal.taulaDrogues')} />
              <SubLink to="/operativa/penal/recursos" icon="📞" label={t('penal.recursos')} />
              <SubLink to="/operativa/penal/drets-detingut" icon="📜" label={t('penal.dretsDetingut')} />
            </div>
          </details>

          {/* Ajustes — toggles de tema i idioma */}
          <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-white/10">
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              {t('sidebar.settings')}
            </div>

            {/* Idioma: ES / CA com a pills clares */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
              <span aria-hidden className="text-base">🌐</span>
              <span className="text-sm font-medium flex-1">{t('sidebar.language')}</span>
              <div className="inline-flex rounded-lg border overflow-hidden border-slate-200 dark:border-white/10" role="group">
                <button
                  type="button"
                  onClick={() => setLocale('es')}
                  aria-pressed={locale === 'es'}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition
                    ${locale === 'es'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('ca')}
                  aria-pressed={locale === 'ca'}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition border-l border-slate-200 dark:border-white/10
                    ${locale === 'ca'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}
                >
                  CA
                </button>
              </div>
            </div>

            {/* Tema: clar / fosc com a pills */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
              <span aria-hidden className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="text-sm font-medium flex-1">{t('sidebar.theme')}</span>
              <div className="inline-flex rounded-lg border overflow-hidden border-slate-200 dark:border-white/10" role="group">
                <button
                  type="button"
                  onClick={() => onThemeChange('light')}
                  aria-pressed={theme === 'light'}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition
                    ${theme === 'light'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}
                >
                  ☀ {t('theme.light')}
                </button>
                <button
                  type="button"
                  onClick={() => onThemeChange('dark')}
                  aria-pressed={theme === 'dark'}
                  className={`px-3 py-1 text-xs font-bold tracking-wide transition border-l border-slate-200 dark:border-white/10
                    ${theme === 'dark'
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}
                >
                  🌙 {t('theme.dark')}
                </button>
              </div>
            </div>

            {/* Mida del text: petit / mitja / gran */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
              <span aria-hidden className="text-base">🔠</span>
              <span className="text-sm font-medium flex-1">{t('sidebar.textSize')}</span>
              <div className="inline-flex rounded-lg border overflow-hidden border-slate-200 dark:border-white/10" role="group">
                {([
                  { val: 'sm' as TextSize, fontSize: '11px' },
                  { val: 'md' as TextSize, fontSize: '14px' },
                  { val: 'lg' as TextSize, fontSize: '17px' },
                ]).map(({ val, fontSize }, i) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => changeTextSize(val)}
                    aria-pressed={textSize === val}
                    title={t(`sidebar.textSize.${val}`)}
                    className={`px-3 py-1 font-bold transition leading-none w-10 text-center
                      ${i > 0 ? 'border-l border-slate-200 dark:border-white/10' : ''}
                      ${textSize === val
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}
                    style={{ fontSize }}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Peu */}
        <footer className="px-4 py-3 mt-2 border-t border-slate-200 dark:border-white/10
          text-[11px] text-slate-500 dark:text-slate-400 text-center">
          {t('footer')}
        </footer>
      </aside>
    </>
  );
}

function SimpleLink({
  to,
  icon,
  label,
  accent,
}: {
  to: string;
  icon: string;
  label: string;
  accent?: 'purple' | 'amber' | 'blue';
}) {
  const accentCls = accent === 'purple'
    ? 'hover:bg-purple-50 dark:hover:bg-purple-400/10'
    : accent === 'amber'
    ? 'hover:bg-amber-50 dark:hover:bg-amber-400/10'
    : accent === 'blue'
    ? 'hover:bg-blue-50 dark:hover:bg-blue-400/10'
    : 'hover:bg-slate-50 dark:hover:bg-white/5';
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${accentCls}`}
    >
      <span aria-hidden className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

/**
 * Variant per a Tests: si hi ha repassos pendents, mostra un comptador
 * vermell. Si no, manté el badge 'Nou'.
 */
function TestsFeatureLink({ t }: { t: (k: string) => string }) {
  const { due } = useFailuresCounts();
  if (due > 0) {
    return (
      <Link
        to="/test"
        className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition
          bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/60
          ring-1 ring-blue-200/70
          hover:from-blue-100 hover:to-purple-100 hover:ring-blue-300
          dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-purple-500/15
          dark:ring-blue-400/20 dark:hover:ring-blue-400/40"
      >
        <span aria-hidden className="text-lg">📝</span>
        <span className="font-bold text-blue-800 dark:text-blue-200 flex-1">{t('sidebar.tests')}</span>
        <span
          title={t('sidebar.tests.duePending')}
          className="rounded-full bg-gradient-to-r from-rose-600 to-orange-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow inline-flex items-center gap-1"
        >
          <span aria-hidden>🔁</span>
          {due}
        </span>
      </Link>
    );
  }
  return (
    <FeatureLink
      to="/test"
      icon="📝"
      label={t('sidebar.tests')}
      badge={t('sidebar.tests.badge')}
    />
  );
}

/**
 * Entrada de Notícies amb badge numèric quan n'hi ha de no llegides.
 */
function NoticiesLink({ t }: { t: (k: string) => string }) {
  const unread = useUnreadNoticiesCount();
  return (
    <Link
      to="/noticies"
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-50 dark:hover:bg-white/5"
    >
      <span aria-hidden className="text-lg">📰</span>
      <span className="font-medium flex-1">{t('sidebar.noticies')}</span>
      {unread > 0 && (
        <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
          {unread}
        </span>
      )}
    </Link>
  );
}

function FeatureLink({
  to, icon, label, badge,
}: { to: string; icon: string; label: string; badge?: string }) {
  return (
    <Link
      to={to}
      className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition
        bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/60
        ring-1 ring-blue-200/70
        hover:from-blue-100 hover:to-purple-100 hover:ring-blue-300
        dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-purple-500/15
        dark:ring-blue-400/20 dark:hover:ring-blue-400/40"
    >
      <span aria-hidden className="text-lg">{icon}</span>
      <span className="font-bold text-blue-800 dark:text-blue-200 flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600
          px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SubLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 transition text-sm
        hover:bg-slate-50 dark:hover:bg-white/5
        text-slate-700 dark:text-slate-300"
    >
      <span aria-hidden className="text-base shrink-0">{icon}</span>
      <span className="leading-tight">{label}</span>
    </Link>
  );
}
