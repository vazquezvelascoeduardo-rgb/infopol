/** @type {import('tailwindcss').Config} */
// Configuració de Tailwind amb el sistema de tokens del redisseny v2
// (color institucional navy + or de placa, tipografia Geist/Instrument
// Serif/Geist Mono). Els colors es defineixen com a variables CSS al
// :root i :root.dark dins de src/index.css; aquí els exposem com a
// classes Tailwind (bg-ink, text-brand, border-line...).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Sans: Geist com a primera opció (carregat via Google Fonts)
        sans: [
          'Geist',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        // Display italic per a moments de jerarquia (heros, números
        // grans, citacions). Caràcter editorial.
        serif: [
          'Instrument Serif',
          'Iowan Old Style',
          'Georgia',
          'serif',
        ],
        // Mono per a articles legals, codis, referències a normes.
        mono: [
          'Geist Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        // Tinta i fons (auto-adapten light/dark via CSS vars).
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        soft: 'var(--soft)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        bg: 'var(--bg)',
        paper: 'var(--paper)',
        // Marca: navy institucional + or de placa.
        brand: 'var(--brand)',
        'brand-2': 'var(--brand-2)',
        'brand-soft': 'var(--brand-soft)',
        gold: 'var(--gold)',
        'gold-soft': 'var(--gold-soft)',
        // Estats.
        danger: 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
        ok: 'var(--ok)',
        'ok-soft': 'var(--ok-soft)',
        warn: 'var(--warn)',
        'warn-soft': 'var(--warn-soft)',
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
        sm: '10px',
      },
    },
  },
  plugins: [],
};
