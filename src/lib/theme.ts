// Tema clar/fosc de la web.
//
// Es va treure fa temps perquè la web només tenia paleta clara. El
// disseny v3 en porta les dues, així que el commutador torna: viu al
// peu de la barra lateral i a Perfil > Ajustos.
const STORAGE_KEY = 'infopol-theme';

export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const desat = window.localStorage.getItem(STORAGE_KEY);
    if (desat === 'dark' || desat === 'light') return desat;
  } catch { /* localStorage bloquejat */ }
  // Sense preferència desada, seguim la del sistema.
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch { /* matchMedia no disponible */ }
  return 'light';
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try { window.localStorage.setItem(STORAGE_KEY, theme); } catch { /* silenci */ }
}

export function applyInitialTheme() {
  applyTheme(getInitialTheme());
}
