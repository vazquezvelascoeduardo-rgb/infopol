// Captura errors de càrrega de chunks lazy.
//
// Symptom: després d'un desplegament nou, l'usuari encara té el SW antic.
// L'index.html cachejat apunta a un chunk amb hash que ja no existeix al
// servidor, l'import dinàmic falla amb "Failed to fetch dynamically
// imported module" o ChunkLoadError, i sense aquest Boundary la pàgina
// queda en blanc fins a refrescar manualment.
//
// Aquest Boundary fa la recàrrega automàtica un sol cop (fent servir un
// flag a sessionStorage perquè si l'error persisteix no quedem en bucle).
import { Component, type ReactNode } from 'react';

const RELOADED_KEY = 'infopol:chunk-reload-attempt';

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

function isChunkLoadError(err: unknown): boolean {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  const name = String(e.name || '');
  const msg = String(e.message || '');
  return (
    name === 'ChunkLoadError' ||
    /Loading chunk \d+ failed/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  );
}

export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: (err as Error)?.message ?? 'Error' };
  }

  componentDidCatch(err: unknown) {
    if (isChunkLoadError(err)) {
      // Evita bucles: només recarreguem un cop per sessió.
      try {
        const already = sessionStorage.getItem(RELOADED_KEY);
        if (!already) {
          sessionStorage.setItem(RELOADED_KEY, '1');
          // Recàrrega dura per forçar la lectura del nou index.html i
          // l'activació del SW nou.
          window.location.reload();
        }
      } catch {
        // sessionStorage no disponible: recarrega de totes maneres.
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const isChunk = /chunk|dynamically imported/i.test(this.state.message);
      return (
        <div
          style={{
            maxWidth: 520,
            margin: '60px auto',
            padding: '32px 24px',
            textAlign: 'center',
            background: 'var(--paper, #F4F1EC)',
            color: 'var(--ink, #0E0E0E)',
            border: '1px solid var(--line, rgba(14,14,14,0.10))',
            borderRadius: 18,
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 38, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            {isChunk ? 'Versió nova disponible' : "S'ha produït un error"}
          </h2>
          <p style={{ color: 'var(--text-2, #4a4744)', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
            {isChunk
              ? "Hi ha una versió nova d'InfoPol. Recarreguem la pàgina per actualitzar-la."
              : "Hem trobat un error inesperat. Prova de recarregar la pàgina."}
          </p>
          <button
            type="button"
            onClick={() => {
              try { sessionStorage.removeItem(RELOADED_KEY); } catch { /* noop */ }
              window.location.reload();
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 14,
              border: 'none',
              background: 'var(--ink, #0E0E0E)',
              color: 'var(--paper, #F4F1EC)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
