// La web fa servir SEMPRE el tema clar. El toggle clar/fosc s'ha
// eliminat — l'usuari va decidir mantenir un únic tema. El tipus
// 'Theme' i les funcions exportades es mantenen per compatibilitat
// amb components existents (Layout, Sidebar) però sempre operen amb 'light'.
const STORAGE_KEY = 'infopol-theme';

export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  return 'light';
}

export function applyTheme(_theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('dark');
  // Esborrem qualsevol preferència vella de tema guardada.
  try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function applyInitialTheme() {
  applyTheme('light');
}
