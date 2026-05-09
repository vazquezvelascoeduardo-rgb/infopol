// Client de Supabase i helper d'auth.
//
// L'app és 100% client-side i serveix com a PWA. Quan les variables
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY estan definides al build,
// activem login (Google + Apple) i sincronització de progrés. Quan no
// hi són, l'app continua funcionant en mode local-only (localStorage).
//
// Important: aquí només ENS exposem el client + un parell d'accessors
// segurs. La sincronització real (read/write a les taules) viu a
// `lib/sync.ts` i a hooks específics — així la persistència local es
// pot fer servir sense haver d'esperar el client.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

if (URL && KEY) {
  client = createClient(URL, KEY, {
    auth: {
      // Persisteix la sessió a localStorage (mateixa cosa que fa
      // l'SDK per defecte) i refresca el token automàticament.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'infopol-auth',
    },
  });
}

export const supabase = client;
export const isBackendEnabled = !!client;

/** Retorna el client si està actiu, o llença un error explícit si no. */
export function requireSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      'Supabase no està configurat. Defineix VITE_SUPABASE_URL i ' +
        'VITE_SUPABASE_ANON_KEY al teu .env.local i torna a fer build. ' +
        'Vegeu BACKEND.md per als passos complets.',
    );
  }
  return client;
}
