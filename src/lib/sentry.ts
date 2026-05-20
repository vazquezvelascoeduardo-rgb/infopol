// Wrapper de Sentry per a la web.
//
// Captura errors no controlats, breadcrumbs i context d'usuari.
// És **opcional**: si no hi ha DSN configurat, totes les funcions són
// no-op i la web continua funcionant igual. Així podem fer commit del
// codi sense forçar tothom a tenir compte de Sentry.
//
// Per activar-lo:
//   1. Crea compte gratuït a https://sentry.io
//   2. Crea projecte tipus "React"
//   3. Copia el DSN
//   4. Posa-ho a `.env.local` com `VITE_SENTRY_DSN=https://...`
//   5. Posa-ho també a GitHub Secrets per la build de Pages
//   6. `npm run build` → els errors a producció es veuran al dashboard

import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const ENV = (import.meta.env.MODE ?? 'production') as string;

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!DSN) {
    if (import.meta.env.DEV) {
      console.info('[sentry] desactivat (sense VITE_SENTRY_DSN al .env.local)');
    }
    return;
  }
  Sentry.init({
    dsn: DSN,
    environment: ENV,
    // Mostra-ho al dev tools quan estàs en development.
    debug: import.meta.env.DEV,
    // Performance (tracing): mostra el 20% de les peticions en prod, 0 en dev.
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 0,
    // Replays (gravació de sessió): només quan hi ha error, no de manera contínua,
    // per estalviar quota i privacitat. 10% de sessions normals, 100% de sessions
    // amb error.
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0,
    // Filtra dades sensibles abans d'enviar.
    beforeSend(event) {
      if (event.user) {
        delete event.user.email;
        delete event.user.username;
        delete event.user.ip_address;
      }
      // No volem enviar contrasenyes o tokens si apareixen a query params.
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url);
          for (const key of ['password', 'token', 'access_token', 'refresh_token', 'code']) {
            if (url.searchParams.has(key)) url.searchParams.set(key, '[REDACTED]');
          }
          event.request.url = url.toString();
        } catch {
          /* ignora URLs invàlides */
        }
      }
      return event;
    },
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Emmascara automàticament inputs i textos al replay.
        maskAllText: true,
        maskAllInputs: true,
      }),
    ],
  });
  initialized = true;
  if (import.meta.env.DEV) console.info('[sentry] inicialitzat');
}

// API auxiliar — facilita usar Sentry sense importar-lo directament a
// la resta del codi (i sense petar si no està configurat).

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized) return;
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): void {
  if (!initialized) return;
  Sentry.captureMessage(message, level);
}

export function setUser(userId: string | null): void {
  if (!initialized) return;
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }
}

// Re-exportem l'ErrorBoundary perquè el puguem usar com a wrapper arrel.
// Cau de manera natural a una pantalla d'error pròpia si Sentry no està
// configurat (només capta a JavaScript level).
export const SentryErrorBoundary = Sentry.ErrorBoundary;
