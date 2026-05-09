// AuthContext + useAuth() · estat de sessió de Supabase + profile.
//
// L'estat es manté sincronitzat amb el client de Supabase (que ja
// persisteix la sessió a localStorage). Quan l'usuari està autenticat,
// també carreguem el seu `profile` i `user_progress` de les taules
// compartides amb la mòbil; així useAuth() és la font única per al
// nom/cuerpo/avatar/XP a tota la web.
//
// Quan el backend no està configurat, useAuth() retorna sempre
// {user: null, loading: false} i les funcions de login són no-ops.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isBackendEnabled } from './supabase';
import { getProfile, getUserProgress, type Profile, type UserProgress } from './db';

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** Profile de la taula `profiles` (es carrega després del login). */
  profile: Profile | null;
  /** XP/level/gems/streak global (taula `user_progress`). */
  progress: UserProgress | null;
  /** True si hi ha backend i sessió activa. */
  isAuthenticated: boolean;
  /** True si Supabase està configurat al build. */
  backendEnabled: boolean;
};

export type AuthActions = {
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Recarrega profile + progress des del servidor. */
  refresh: () => Promise<void>;
};

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(isBackendEnabled);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  const userId = session?.user?.id;

  const refresh = useCallback(async () => {
    if (!supabase || !userId) {
      setProfile(null);
      setProgress(null);
      return;
    }
    try {
      const [p, up] = await Promise.all([
        getProfile(userId),
        getUserProgress(userId),
      ]);
      setProfile(p);
      setProgress(up);
    } catch (err) {
      // Quan l'esquema encara no té addicions (avatar_*), pot fallar
      // amb 'column does not exist'. Ho tractem com a perfil buit
      // perquè el login no es bloquegi.
      console.warn('[auth] No s\'ha pogut carregar el perfil:', err);
      setProfile(null);
      setProgress(null);
    }
  }, [userId]);

  // Sessió: subscripció + càrrega inicial.
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Quan canvia l'usuari, recarrega profile/progress.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(() => {
    async function signInWithProvider(provider: 'google' | 'apple') {
      if (!supabase) return;
      const redirectTo =
        typeof window !== 'undefined' ? window.location.origin : undefined;
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
    }
    return {
      user: session?.user ?? null,
      session,
      loading,
      profile,
      progress,
      isAuthenticated: !!session,
      backendEnabled: isBackendEnabled,
      signInWithGoogle: () => signInWithProvider('google'),
      signInWithApple: () => signInWithProvider('apple'),
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setProfile(null);
        setProgress(null);
      },
      refresh,
    };
  }, [session, loading, profile, progress, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      session: null,
      loading: false,
      profile: null,
      progress: null,
      isAuthenticated: false,
      backendEnabled: false,
      signInWithGoogle: async () => {},
      signInWithApple: async () => {},
      signOut: async () => {},
      refresh: async () => {},
    };
  }
  return ctx;
}
