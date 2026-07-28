// Punt d'entrada de l'app. Aplica el tema inicial (clar/fosc) abans
// de muntar React per evitar el flaix blanc.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { applyInitialTheme } from './lib/theme';
import { applyInitialTextSize } from './lib/fontSize';
import { LocaleProvider } from './lib/i18n';
import { AuthProvider } from './lib/auth';
import { exposeNomenclatorToWindow } from './lib/cataleg-nomenclator';
import { initSentry, SentryErrorBoundary, captureException } from './lib/sentry';

// Sentry s'inicialitza el primer de tot per capturar errors de qualsevol
// codi posterior, incloent els del bootstrap (theme, polyfills, etc.).
// Si no hi ha DSN configurat, és no-op.
initSentry();

applyInitialTheme();
applyInitialTextSize();

// Cua de seguretat: si un chunk lazy falla en una promesa que no entra
// al RouteErrorBoundary (p. ex. un import preload), recarreguem un cop
// per pillar la nova versió del SW. Evitem bucles amb sessionStorage.
const CHUNK_RELOAD_KEY = 'infopol:chunk-reload-attempt';
function isChunkErrorMsg(msg: string): boolean {
  return (
    /Loading chunk \d+ failed/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg)
  );
}
// ── Anti-còpia: bloqueja copy, context-menu i drag a tot el document.
// Excepció per a inputs/textareas perquè l'usuari pugui escriure i
// gestionar formularis (login, cerca, etc.). Recordatori: això NO impedeix
// a un usuari determinat copiar via DevTools — és una dissuassió
// contra el "selecciona-i-Ctrl+C" casual.
function isFormElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest('input, textarea, select, [contenteditable="true"], [data-allow-select="true"]')) return true;
  return false;
}
document.addEventListener('copy', (e) => {
  if (!isFormElement(e.target)) e.preventDefault();
});
document.addEventListener('cut', (e) => {
  if (!isFormElement(e.target)) e.preventDefault();
});
document.addEventListener('contextmenu', (e) => {
  if (!isFormElement(e.target)) e.preventDefault();
});
document.addEventListener('dragstart', (e) => {
  if (!isFormElement(e.target)) e.preventDefault();
});

window.addEventListener('unhandledrejection', (ev) => {
  const reason = ev.reason as { message?: string; name?: string } | undefined;
  const msg = String(reason?.message || reason?.name || ev.reason || '');
  if (isChunkErrorMsg(msg)) {
    try {
      if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
    return;
  }
  // Si no és un chunk error, ho enviem a Sentry per visibilitat.
  captureException(ev.reason, { source: 'unhandledrejection' });
});
// Reset del flag si arribem a la home sense errors → permet futures recàrregues.
window.addEventListener('load', () => {
  setTimeout(() => {
    try { sessionStorage.removeItem(CHUNK_RELOAD_KEY); } catch { /* noop */ }
  }, 5000);
});
// Exposa l'índex de conceptes oficials del nomenclàtor SCT al window
// perquè els scripts de les fitxes HTML (rendaritzades en vanilla JS
// dins HtmlInline) puguin reutilitzar la mateixa font de veritat.
exposeNomenclatorToWindow();

// ErrorBoundary arrel: si peta qualsevol component, en lloc d'una pàgina
// en blanc l'usuari veu un missatge digne + es notifica a Sentry.
function ErrorFallback({ resetError }: { error: unknown; resetError: () => void }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background: 'var(--paper, #FAF6EF)',
        color: 'var(--ink, #0E0E0E)',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>
        Alguna cosa ha fallat
      </h1>
      <p style={{ fontSize: 14, color: '#666', maxWidth: 420, margin: '0 0 20px' }}>
        Hem rebut l'error i ho estem mirant. Pots tornar enrere o recarregar la pàgina.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => resetError()}
          style={{
            padding: '10px 18px',
            borderRadius: 999,
            border: '1px solid var(--line, rgba(0,0,0,0.1))',
            background: 'white',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Tornar a provar
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 18px',
            borderRadius: 999,
            border: 'none',
            background: 'var(--terracotta, #F26B1F)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}

// El service worker es genera amb `autoUpdate`, pero aixo nomes instal·la la
// versio nova en segon pla: la pestanya oberta continua amb el JS antic en
// memoria i calen dues recarregues per veure els canvis. Quan el service
// worker nou pren el control, recarreguem una sola vegada.
if ('serviceWorker' in navigator) {
  let recarregant = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recarregant) return;
    recarregant = true;
    window.location.reload();
  });
  // Comprova si hi ha versio nova en tornar a la pestanya.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistration().then((r) => r?.update()).catch(() => {});
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SentryErrorBoundary fallback={ErrorFallback} showDialog={false}>
      <LocaleProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </LocaleProvider>
    </SentryErrorBoundary>
  </React.StrictMode>,
);
