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
  }
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocaleProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </LocaleProvider>
  </React.StrictMode>,
);
