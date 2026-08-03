// La fletxa de tornar enrere.
//
// Hi havia pàgines interiors sense cap manera de sortir que no fos el botó
// del navegador o el menú lateral —i al mòbil, amb el calaix tancat, això
// és un carreró. Aquí hi ha una sola fletxa perquè totes es vegin igual i
// es trobin sempre al mateix lloc.
import { useLocation, useNavigate } from 'react-router-dom';

import { I, V } from '../lib/v3';

/**
 * On és "amunt" des d'on ets.
 *
 * Es fa per prefixos i de més llarg a més curt, com l'`ON_ETS` de
 * l'AppShell: cada pantalla sap de quina penja, i així la fletxa sempre
 * puja un esglaó en comptes de desfer els teus passos.
 */
const PARES: { prefix: string; a: string }[] = [
  { prefix: '/estudi/tema', a: '/estudi' },
  { prefix: '/estudi', a: '/academia/estudiar' },
  { prefix: '/mossos/estudi', a: '/mossos/temari' },
  { prefix: '/mossos/temari', a: '/academia/estudiar' },
  { prefix: '/mossos/esquemes', a: '/academia/estudiar' },
  { prefix: '/mossos/flashcards', a: '/academia/practicar' },
  { prefix: '/mossos/psicotecnics/', a: '/mossos/psicotecnics' },
  { prefix: '/mossos/psicotecnics', a: '/academia/practicar' },
  { prefix: '/mossos', a: '/academia/practicar' },
  { prefix: '/policia-local/esquemes', a: '/academia/estudiar' },
  { prefix: '/policia-local/flashcards', a: '/academia/practicar' },
  { prefix: '/policia-local/psicotecnics/', a: '/policia-local/psicotecnics' },
  { prefix: '/policia-local/psicotecnics', a: '/academia/practicar' },
  { prefix: '/policia-local/debilitats', a: '/academia/repassar' },
  { prefix: '/policia-local/logros', a: '/academia/repassar' },
  { prefix: '/policia-local', a: '/academia/practicar' },
  { prefix: '/cultura-general/tema', a: '/cultura-general' },
  { prefix: '/cultura-general', a: '/academia/estudiar' },
  { prefix: '/noticies', a: '/academia/estudiar' },
  { prefix: '/actualitat', a: '/academia/estudiar' },
  { prefix: '/repas', a: '/academia/repassar' },
  { prefix: '/diagnostic', a: '/academia/repassar' },
  { prefix: '/retos', a: '/academia/practicar' },
  { prefix: '/academia/estudiar', a: '/academia' },
  { prefix: '/academia/practicar', a: '/academia' },
  { prefix: '/academia/repassar', a: '/academia' },
  { prefix: '/academia', a: '/app' },

  { prefix: '/operativa/penal', a: '/operativa' },
  { prefix: '/operativa/trafico', a: '/operativa' },
  { prefix: '/operativa', a: '/app' },
  { prefix: '/superbuscador', a: '/operativa' },
  { prefix: '/calculadora-alcohol', a: '/operativa' },
  { prefix: '/croquis', a: '/operativa' },
  { prefix: '/recursos', a: '/operativa' },
  { prefix: '/leyes', a: '/operativa' },

  { prefix: '/quadrant', a: '/perfil' },
  { prefix: '/cerca', a: '/app' },
];

export function pare(pathname: string): string | null {
  const trobat = [...PARES]
    .sort((x, y) => y.prefix.length - x.prefix.length)
    .find((x) => pathname === x.prefix || pathname.startsWith(`${x.prefix}/`));
  // Si ja hi ets, no et deixis clavat: puja un esglaó més.
  if (trobat && trobat.a === pathname) return '/app';
  return trobat?.a ?? null;
}

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
  const { pathname } = useLocation();
  // Puja a la categoria de sobre, no a l'última pàgina que hagis vist.
  // Amb l'historial del navegador, sortir d'un tema et podia tornar a un
  // test que ja havies acabat, perquè hi havies passat pel mig.
  const enrere = () => nav(pare(pathname) ?? a ?? '/app');
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
