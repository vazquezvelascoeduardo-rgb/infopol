/** @type {import('tailwindcss').Config} */
// Configuració Tailwind del rebranding 2026: ink + terracotta + paper.
// Tipografia geomètrica (Plus Jakarta Sans) + monospace tècnica (JetBrains Mono).
// Els colors es defineixen com a variables CSS al :root dins de src/index.css i
// aquí els exposem com a classes Tailwind (bg-ink, text-terracotta, etc.).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        // Tinta i fons (cremes mat).
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        white: 'var(--white)',
        // Marca: terracotta.
        terracotta: 'var(--terracotta)',
        'terracotta-2': 'var(--terracotta-2)',
        'terracotta-soft': 'var(--terracotta-soft)',
        // Text.
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        'text-4': 'var(--text-4)',
        // Accents per secció.
        'c-leyes': 'var(--c-leyes)',
        'c-operativa': 'var(--c-operativa)',
        'c-trafico': 'var(--c-trafico)',
        'c-superbuscador': 'var(--c-superbuscador)',
        'c-alcoholemia': 'var(--c-alcoholemia)',
        'c-recursos': 'var(--c-recursos)',
        'c-tests': 'var(--c-tests)',
        'c-actualidad': 'var(--c-actualidad)',
        'c-pl': 'var(--c-pl)',
        // Tints (rentats suaus de fons per a cards).
        'tint-leyes': 'var(--tint-leyes)',
        'tint-operativa': 'var(--tint-operativa)',
        'tint-superbuscador': 'var(--tint-superbuscador)',
        'tint-trafico': 'var(--tint-trafico)',
        'tint-alcoholemia': 'var(--tint-alcoholemia)',
        'tint-recursos': 'var(--tint-recursos)',
        'tint-tests': 'var(--tint-tests)',
        'tint-cream': 'var(--tint-cream)',
        // Línies.
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '18px',
        xl: '24px',
        pill: '999px',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};
