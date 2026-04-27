// Gestió del tamany de lletra base de l'app.
// S'aplica al <html> amb un atribut `data-text-size` que escala totes
// les mesures Tailwind (rem) proporcionalment.
//
// Tres talles:
//   - 'sm'  → 14px (compacte)
//   - 'md'  → 16px (per defecte)
//   - 'lg'  → 18px (gran, llegible al sol o per accessibilitat)

const STORAGE_KEY = 'infopol-textsize';

export type TextSize = 'sm' | 'md' | 'lg';

export function getInitialTextSize(): TextSize {
  if (typeof window === 'undefined') return 'md';
  const saved = window.localStorage.getItem(STORAGE_KEY) as TextSize | null;
  if (saved === 'sm' || saved === 'md' || saved === 'lg') return saved;
  return 'md';
}

export function applyTextSize(size: TextSize) {
  document.documentElement.dataset.textSize = size;
  window.localStorage.setItem(STORAGE_KEY, size);
}

export function applyInitialTextSize() {
  applyTextSize(getInitialTextSize());
}
