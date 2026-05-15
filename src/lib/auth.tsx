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
//
// Mètodes d'inici de sessió:
//   - Google OAuth (signInWithGoogle)
//   - Email + contrasenya (signInWithPassword / signUpWithPassword)
//   - Recuperació de contrasenya (requestPasswordReset)

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
  signInWithPassword: (email: string, password: string) => Promise<void>;
  /**
   * Crea un compte amb email + contrasenya. Si Supabase exigeix
   * confirmació de correu, retorna `needsEmailConfirmation: true` i no
   * deixa sessió oberta — l'usuari ha de clicar l'enllaç de l'email
   * abans de poder entrar.
   */
  signUpWithPassword: (
    email: string,
    password: string,
    name?: string,
    /** Opt-in del resum diari de notícies (Comunicacions a /perfil). */
    wantsNewsletter?: boolean,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
  /** Envia un correu amb un enllaç per restablir la contrasenya. */
  requestPasswordReset: (email: string) => Promise<void>;
  /** Canvia la contrasenya de l'usuari amb sessió activa. */
  updatePassword: (newPassword: string) => Promise<void>;
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
    return {
      user: session?.user ?? null,
      session,
      loading,
      profile,
      progress,
      isAuthenticated: !!session,
      backendEnabled: isBackendEnabled,
      signInWithGoogle: async () => {
        if (!supabase) return;
        const redirectTo =
          typeof window !== 'undefined' ? window.location.origin : undefined;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });
        if (error) throw error;
      },
      signInWithPassword: async (email, password) => {
        if (!supabase) {
          throw new Error('Backend no configurat.');
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      },
      signUpWithPassword: async (email, password, name, wantsNewsletter) => {
        if (!supabase) {
          throw new Error('Backend no configurat.');
        }
        const emailRedirectTo =
          typeof window !== 'undefined'
            ? `${window.location.origin}/login`
            : undefined;
        // Passem `newsletter_optin` als metadades del registre perquè el
        // trigger SQL d'auth.users el llegeixi i actualitzi el profile
        // si l'usuari va marcar el checkbox a /login.
        const metadata: Record<string, unknown> = {};
        if (name) metadata.name = name;
        if (wantsNewsletter) metadata.newsletter_optin = true;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: Object.keys(metadata).length > 0 ? metadata : undefined,
            emailRedirectTo,
          },
        });
        if (error) throw error;
        return { needsEmailConfirmation: !data.session };
      },
      requestPasswordReset: async (email) => {
        if (!supabase) {
          throw new Error('Backend no configurat.');
        }
        const redirectTo =
          typeof window !== 'undefined'
            ? `${window.location.origin}/login`
            : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (error) throw error;
      },
      updatePassword: async (newPassword) => {
        if (!supabase) {
          throw new Error('Backend no configurat.');
        }
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
      },
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
      signInWithPassword: async () => {},
      signUpWithPassword: async () => ({ needsEmailConfirmation: false }),
      // Allow optional 4th argument in no-op signature
      requestPasswordReset: async () => {},
      updatePassword: async () => {},
      signOut: async () => {},
      refresh: async () => {},
    };
  }
  return ctx;
}
