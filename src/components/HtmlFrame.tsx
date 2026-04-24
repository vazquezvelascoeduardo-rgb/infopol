// Renderitza un document HTML complet dins d'un iframe aïllat.
// Fem servir `srcdoc` (mateix origen) per poder mesurar el contingut i
// ajustar l'alçada automàticament al final de cada ficha, així s'elimina
// la barra de desplaçament interna de l'iframe.
import { useEffect, useRef, useState } from 'react';

type Props = { html: string; title: string };

export default function HtmlFrame({ html, title }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState<number>(600); // alçada inicial aproximada

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    // Ajustem l'alçada tant al primer load com davant redimensions del contingut.
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
      resize();
      const doc = iframe!.contentDocument;
      if (!doc) return;
      // Observem canvis al DOM (imatges carregades, detalls que s'obren...).
      const ro = new ResizeObserver(() => resize());
      ro.observe(doc.body);
      // També escoltem el carregament d'imatges.
      doc.querySelectorAll('img').forEach((img) => {
        if (!(img as HTMLImageElement).complete) {
          img.addEventListener('load', resize, { once: true });
        }
      });
      iframe!.addEventListener('unload', () => ro.disconnect(), { once: true });
    }

    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [html, height]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      // sandbox amb "allow-same-origin" perquè l'iframe pugui executar
      // els seus propis scripts (animacions, detalls, col·lapsables)
      // i nosaltres podem mesurar el contingut.
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      style={{
        width: '100%',
        height: `${height}px`,
        border: '0',
        display: 'block',
        colorScheme: 'normal',
      }}
    />
  );
}
