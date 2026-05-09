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
import { exposeNomenclatorToWindow } from './lib/cataleg-nomenclator';

applyInitialTheme();
applyInitialTextSize();
// Exposa l'índex de conceptes oficials del nomenclàtor SCT al window
// perquè els scripts de les fitxes HTML (rendaritzades en vanilla JS
// dins HtmlInline) puguin reutilitzar la mateixa font de veritat.
exposeNomenclatorToWindow();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocaleProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LocaleProvider>
  </React.StrictMode>,
);
