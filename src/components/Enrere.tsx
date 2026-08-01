// La fletxa de tornar enrere.
//
// Hi havia pàgines interiors sense cap manera de sortir que no fos el botó
// del navegador o el menú lateral —i al mòbil, amb el calaix tancat, això
// és un carreró. Aquí hi ha una sola fletxa perquè totes es vegin igual i
// es trobin sempre al mateix lloc.
import { useNavigate } from 'react-router-dom';

import { I, V } from '../lib/v3';

export default function Enrere({
  a,
  etiqueta = 'Tornar enrere',
  titol,
  style,
}: {
  /**
   * On anar si no hi ha història (entrada directa per adreça o recàrrega).
   * Sense això, la fletxa no faria res a la primera pàgina de la sessió.
   */
  a?: string;
  etiqueta?: string;
  /** Text opcional al costat de la fletxa. */
  titol?: string;
  style?: React.CSSProperties;
}) {
  const nav = useNavigate();
  const enrere = () => {
    if (window.history.length > 1) nav(-1);
    else nav(a ?? '/app');
  };
  return (
    <button
      type="button"
      onClick={enrere}
      aria-label={etiqueta}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 9,
        height: 40, padding: titol ? '0 15px 0 11px' : 0, width: titol ? undefined : 40,
        flexShrink: 0, borderRadius: titol ? 999 : '50%',
        border: `1px solid ${V.border}`, background: V.surface, color: V.ink,
        cursor: 'pointer', fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
        justifyContent: 'center',
        ...style,
      }}>
      <I n="back" size={16} sw={2} />
      {titol}
    </button>
  );
}
