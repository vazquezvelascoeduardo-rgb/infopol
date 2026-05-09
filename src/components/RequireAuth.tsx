// Wrapper per a rutes privades. Si no hi ha sessió → redirigeix a /login
// preservant la ruta actual al query param `?next=` perquè després del
// login l'usuari torni on era.
//
// Si el backend no està configurat (variables VITE_SUPABASE_* absents),
// no protegeix res — l'app continua funcionant en mode local-only.
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, backendEnabled } = useAuth();
  const location = useLocation();

  // Sense backend, no protegim. La protecció és una capa client-side
  // i requereix Supabase per validar la sessió de manera fiable.
  if (!backendEnabled) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="shell py-12 text-center text-text-3">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    );
  }

  if (!user) {
    const next = location.pathname + location.search;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return <>{children}</>;
}
