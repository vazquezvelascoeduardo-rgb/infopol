// Renderitza un document HTML complet dins d'un iframe aïllat.
// Fem servir `srcdoc` (mateix origen) per poder:
//   1) Mesurar el contingut i ajustar l'alçada automàticament → sense
//      barres de desplaçament internes.
//   2) Injectar un petit <style> amb un "pont" de tema, de manera que
//      les infografies HTML també respectin el mode clar/fosc de l'app.
import { useEffect, useRef, useState } from 'react';

type Props = { html: string; title: string };

// CSS que s'injecta dins de l'iframe quan l'app està en MODE CLAR.
// Invertim la lluminositat i rotem 180° el to (color) perquè les
// infografies fosques es vegin clares però conservin els tons d'accent
// (el vermell continua sent vermell, el blau blau, el daurat groguenc...).
// Les imatges, vídeos i icones es reinvertien perquè no surtin "foto
// negatiu".
const LIGHT_THEME_CSS = `
  html.ipol-light {
    filter: invert(92%) hue-rotate(180deg);
    background: #f8fafc;
  }
  html.ipol-light img,
  html.ipol-light video,
  html.ipol-light picture,
  html.ipol-light svg image,
  html.ipol-light iframe,
  html.ipol-light embed,
  html.ipol-light object,
  html.ipol-light [data-no-invert] {
    filter: invert(100%) hue-rotate(180deg);
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
