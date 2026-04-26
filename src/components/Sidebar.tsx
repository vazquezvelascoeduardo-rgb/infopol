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
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useT } from '../lib/i18n';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  const { t } = useT();
  const location = useLocation();

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

          {/* Superbuscador */}
          <SimpleLink
            to="/superbuscador"
            icon="🔍"
            label={t('sidebar.superbuscador')}
            accent="purple"
          />

          {/* Lleis (col·lapsable) */}
          <details className="group rounded-lg border border-slate-200/70 dark:border-white/10 mt-2">
            <summary className="flex items-center gap-3 px-3 py-2.5 cursor-pointer
              hover:bg-amber-50 dark:hover:bg-white/5 rounded-lg select-none">
              <span aria-hidden className="text-lg">⚖️</span>
              <span className="font-semibold flex-1">{t('sidebar.leyes')}</span>
              <span aria-hidden className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="border-t border-slate-200/70 dark:border-white/10">
              <SubLink to="/leyes" icon="📚" label={t('sidebar.leyes.all')} />
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

          {/* Operativa (col·lapsable) */}
          <details className="group rounded-lg border border-slate-200/70 dark:border-white/10 mt-2">
            <summary className="flex items-center gap-3 px-3 py-2.5 cursor-pointer
              hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg select-none">
              <span aria-hidden className="text-lg">🚨</span>
              <span className="font-semibold flex-1">{t('sidebar.operativa')}</span>
              <span aria-hidden className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="border-t border-slate-200/70 dark:border-white/10">
              <SubLink to="/operativa" icon="🏠" label={t('sidebar.operativa.home')} />
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
