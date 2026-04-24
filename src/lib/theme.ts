// Gestió del tema clar/fosc.
// Fem servir `localStorage` per desar la preferència de l'usuari.
// Si no hi ha preferència guardada, fem servir la del sistema.

const STORAGE_KEY = 'infopol-theme';

export type Theme = 'light' | 'dark';

// Llegeix la preferència desada o bé la del sistema.
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// Aplica el tema afegint/traient la classe `dark` al <html>.
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  window.localStorage.setItem(STORAGE_KEY, theme);
}

// S'invoca al començament, abans de muntar React.
export function applyInitialTheme() {
  applyTheme(getInitialTheme());
}
