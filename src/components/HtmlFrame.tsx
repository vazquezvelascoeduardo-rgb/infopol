// Renderitza un document HTML complet dins d'un iframe aïllat.
// Fem servir `srcdoc` (mateix origen) per poder:
//   1) Mesurar el contingut i ajustar l'alçada automàticament → sense
//      barres de desplaçament internes.
//   2) Injectar un petit <style> amb un "pont" de tema, de manera que
//      les infografies HTML també respectin el mode clar/fosc de l'app.
import { useEffect, useRef, useState } from 'react';

type Props = { html: string; title: string };

// CSS injectat dins de l'iframe quan l'app està en MODE CLAR.
//
// Estratègia: en lloc d'invertir colors (que produïa un blanc trencat /
// grisós), sobreescrivim les variables CSS que totes les infografies
// fan servir per construir la paleta navy + dorat. D'aquesta manera
// obtenim un tema clar "real" amb fons blanc pur, mantenint els accents
// (daurat, blau, vermell, verd) lleugerament ajustats per al contrast.
//
// També tenim un fallback `html.ipol-light body { ... }` per a fitxes
// que no fan servir variables CSS i hardcodejen els colors al body.
const LIGHT_THEME_CSS = `
  html.ipol-light {
    background: #ffffff !important;

    /* Esquema de variables principal (la majoria de fitxes) */
    --bg-main: #ffffff !important;
    --bg-section: #f8fafc !important;
    --text-main: #0a1628 !important;
    --text-secondary: #475569 !important;
    --border: #c8a028 !important;

    /* Variants per a fitxes que fan servir noms d'accent ("accent-*") */
    --accent-gold: #b8920e !important;
    --accent-blue: #1a5c96 !important;
    --alert-red: #b91c1c !important;
    --positive-green: #15803d !important;

    /* Variants per a fitxes amb noms curts (catàleg de trànsit) */
    --bg: #ffffff !important;
    --txt: #0a1628 !important;
    --gold: #b8920e !important;
    --blue: #1a5c96 !important;
    --blue-royal: #1a5c96 !important;
    --green: #15803d !important;
    --red: #b91c1c !important;
  }

  /* Cobertura per a fitxes que no fan servir variables a body. */
  html.ipol-light body {
    background-color: #ffffff !important;
    background-image: none !important;
    color: #0a1628 !important;
  }

  /* Reforç visual: en mode clar, les targetes/seccions necessiten una
     vora suau perquè es distingeixin sobre el fons blanc. */
  html.ipol-light .section,
  html.ipol-light .subsection,
  html.ipol-light .card,
  html.ipol-light .panel,
  html.ipol-light .box {
    border-color: #e2e8f0 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
  }
`;

export default function HtmlFrame({ html, title }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState<number>(600);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    // Aplica el tema actual (clar/fosc) a l'iframe afegint/traient la
    // classe `ipol-light` a l'element <html> de dins.
    function applyTheme() {
      const doc = iframe!.contentDocument;
      if (!doc || !doc.documentElement) return;
      const appIsDark = document.documentElement.classList.contains('dark');
      doc.documentElement.classList.toggle('ipol-light', !appIsDark);
    }

    // Injecta el <style> del pont de tema i deixa l'iframe sincronitzat
    // amb el tema de l'app.
    function setupThemeBridge() {
      const doc = iframe!.contentDocument;
      if (!doc || !doc.head) return;
      if (!doc.getElementById('ipol-theme-bridge')) {
        const style = doc.createElement('style');
        style.id = 'ipol-theme-bridge';
        style.textContent = LIGHT_THEME_CSS;
        doc.head.appendChild(style);
      }
      applyTheme();
    }

    // Ajusta l'alçada de l'iframe al contingut real.
    function resize() {
      const doc = iframe!.contentDocument;
      if (!doc || !doc.body) return;
      const h = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight,
      );
      if (h > 0 && h !== height) setHeight(h);
    }

    function onLoad() {
      setupThemeBridge();
      resize();
      const doc = iframe!.contentDocument;
      if (!doc) return;
      // Observem canvis al DOM de l'iframe (detalls que s'obren, imatges
      // que acaben de carregar, etc.) per a recalcular l'alçada.
      const ro = new ResizeObserver(() => resize());
      ro.observe(doc.body);
      doc.querySelectorAll('img').forEach((img) => {
        if (!(img as HTMLImageElement).complete) {
          img.addEventListener('load', resize, { once: true });
        }
      });
      iframe!.addEventListener('unload', () => ro.disconnect(), { once: true });
    }

    iframe.addEventListener('load', onLoad);

    // Observem la classe de l'<html> extern per saber si la app està
    // en mode clar o fosc i replicar-ho dins de l'iframe.
    const themeObserver = new MutationObserver(() => applyTheme());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      iframe.removeEventListener('load', onLoad);
      themeObserver.disconnect();
    };
  }, [html, height]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      style={{
        width: '100%',
        height: `${height}px`,
        border: '0',
        display: 'block',
        background: 'transparent',
      }}
    />
  );
}
