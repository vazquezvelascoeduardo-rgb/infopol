// Punt d'entrada de l'app. Aplica el tema inicial (clar/fosc) abans
// de muntar React per evitar el flaix blanc.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { applyInitialTheme } from './lib/theme';
import { LocaleProvider } from './lib/i18n';

applyInitialTheme();

// Basename del React Router: en producció a GitHub Pages la app viu
// a /infopol/, en dev és '/'. import.meta.env.BASE_URL ho fa servir
// el valor de `base` de vite.config.ts. Treiem la barra final.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocaleProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </LocaleProvider>
  </React.StrictMode>,
);
