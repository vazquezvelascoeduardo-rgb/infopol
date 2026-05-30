// Barra de navegació inferior · només a mòbil (< 640px).
// Patró esperat en una PWA instal·lable: 5 destins clau sempre a mà,
// sense haver d'obrir el menú hamburguesa per a cada navegació.
import { Link, useLocation } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useUnreadNoticiesCount } from '../lib/noticies';
import { useAuth } from '../lib/auth';

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}
function IconAcademia() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
      <path d="M22 10v5" />
    </svg>
  );
}
function IconOperativa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}
function IconNews() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 12h10M7 15h6" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function BottomNav() {
  const { t } = useT();
  const { pathname } = useLocation();
  const unread = useUnreadNoticiesCount();
  const auth = useAuth();

  // Perfil si hi ha sessió; si no, login.
  const profileTo = auth.isAuthenticated ? '/perfil' : '/login';

  const items = [
    { to: '/', label: t('sidebar.home'), icon: <IconHome />, match: (p: string) => p === '/' },
    { to: '/academia', label: t('sidebar.academia'), icon: <IconAcademia />, match: (p: string) => p.startsWith('/academia') || p.startsWith('/policia-local') || p.startsWith('/mossos') || p.startsWith('/cultura-general') || p.startsWith('/actualitat') || p.startsWith('/retos') },
    { to: '/operativa', label: t('sidebar.operativa'), icon: <IconOperativa />, match: (p: string) => p.startsWith('/operativa') || p.startsWith('/superbuscador') },
    { to: '/noticies', label: t('sidebar.noticies'), icon: <IconNews />, badge: unread, match: (p: string) => p.startsWith('/noticies') },
    { to: profileTo, label: t('bottomnav.profile'), icon: <IconUser />, match: (p: string) => p.startsWith('/perfil') || p.startsWith('/login') },
  ];

  return (
    <nav className="bottom-nav" aria-label={t('bottomnav.aria')}>
      {items.map((it) => {
        const active = it.match(pathname);
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`bn-item ${active ? 'active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bn-ico">
              {it.icon}
              {!!it.badge && it.badge > 0 && (
                <span className="bn-badge" aria-hidden>{it.badge > 9 ? '9+' : it.badge}</span>
              )}
            </span>
            <span className="bn-label">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
