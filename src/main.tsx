// Punt d'entrada de l'app. Aplica el tema inicial (clar/fosc) abans
// de muntar React per evitar el flaix blanc.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { applyInitialTheme } from './lib/theme';

applyInitialTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
