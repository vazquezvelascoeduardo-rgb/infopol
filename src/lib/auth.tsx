// AuthContext + useAuth() · estat de sessió de Supabase.
//
// L'estat es manté sincronitzat amb el client de Supabase (que ja
// persisteix la sessió a localStorage). Quan el backend no està
// configurat, useAuth() retorna sempre {user: null, loading: false}
// i les funcions de login són no-ops — així podem renderitzar els
// components de login condicionalment sense rebentar la build.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isBackendEnabled } from './supabase';

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** True si hi ha backend i sessió activa. */
  isAuthenticated: boolean;
  /** True si Supabase està configurat al build. */
  backendEnabled: boolean;
};

export type AuthActions = {
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(isBackendEnabled);

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
      isAuthenticated: !!session,
      backendEnabled: isBackendEnabled,
      signInWithGoogle: () => signInWithProvider('google'),
      signInWithApple: () => signInWithProvider('apple'),
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Defensa: si algú usa el hook sense provider, retornem un estat
    // "no autenticat" perquè no rebenti l'app.
    return {
      user: null,
      session: null,
      loading: false,
      isAuthenticated: false,
      backendEnabled: false,
      signInWithGoogle: async () => {},
      signInWithApple: async () => {},
      signOut: async () => {},
    };
  }
  return ctx;
}
