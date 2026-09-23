// Simulacre de la 1a prova de Mossos (convocatòria 46/26) · pàgina pública.
//
// És la porta d'entrada de la campanya de l'examen del 17 d'octubre: s'hi
// arriba des de xarxes, Telegram i Google, sense compte. Explica com és la
// prova i porta a les dues parts del simulacre, que sí demanen registre
// (el login torna aquí mateix gràcies al paràmetre `next`).
import { Link } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { FP } from '../lib/focus';
import { useSeo } from '../lib/seo';
import { RUTA_PART1, RUTA_PART2, SIMULACRE_MOSSOS, diesPerExamen } from '../lib/simulacre';

const { coneixements: CO, aptitudinal: AP, convocatoria } = SIMULACRE_MOSSOS;

function CompteEnrere() {
  const dies = diesPerExamen();
  let text: string;
  if (dies > 1) text = `Falten ${dies} dies per a l'examen`;
  else if (dies === 1) text = "L'examen és demà";
  else if (dies === 0) text = "L'examen és avui. Molta sort!";
  else text = `L'examen va ser el ${SIMULACRE_MOSSOS.data.split('-').reverse().join('/')}`;
  return (
    <span style={{
      display: 'inline-block', fontFamily: FP.mono, fontSize: 12.5, fontWeight: 700,
      letterSpacing: '.04em', padding: '5px 12px', borderRadius: 99,
      background: FP.terraSoft, color: FP.terraInk,
    }}>
      {text}
    </span>
  );
}

function Part({ num, titol, dades, detall, to, textBoto }: {
  num: number; titol: string; dades: string; detall: string; to: string; textBoto: string;
}) {
  return (
    <div style={{
      background: FP.card, border: `1px solid ${FP.line2}`, borderRadius: 20,
      padding: '20px 20px 18px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ fontFamily: FP.mono, fontSize: 11.5, fontWeight: 700, letterSpacing: '.07em', color: FP.inkMuted, textTransform: 'uppercase' }}>
        {num}a part
      </div>
      <div style={{ fontFamily: FP.display, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>{titol}</div>
      <div style={{ fontFamily: FP.mono, fontSize: 14, fontWeight: 600, color: FP.terraInk }}>{dades}</div>
      <p style={{ margin: 0, color: FP.inkSoft, fontSize: 15, lineHeight: 1.5, flex: 1 }}>{detall}</p>
      <Link to={to} style={{
        marginTop: 6, alignSelf: 'flex-start', textDecoration: 'none',
        background: FP.terracota, color: '#fff', fontWeight: 700, fontSize: 15.5,
        padding: '12px 20px', borderRadius: 14, boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.18)',
      }}>
        {textBoto}
      </Link>
    </div>
  );
}

export default function SimulacreMossos() {
  const { user } = useAuth();
  useSeo({
    title: `Simulacre examen Mossos ${convocatoria} gratis · 1a prova`,
    description: `Fes gratis el simulacre de la 1a prova de Mossos (${convocatoria}): ${CO.preguntes} preguntes de coneixements i ${AP.preguntes} psicotècnics, amb el temps i la penalització de l'examen.`,
    path: '/simulacre-mossos',
  });

  const textBoto = user ? 'Comença' : "Registra't gratis i comença";

  return (
    <div style={{ minHeight: '100%', background: FP.bg, color: FP.ink, fontFamily: FP.sans }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 56px' }}>
        <Link to="/" style={{ color: FP.inkMuted, fontSize: 14, textDecoration: 'none' }}>← InfoPol</Link>

        <header style={{ margin: '22px 0 26px' }}>
          <CompteEnrere />
          <h1 style={{
            fontFamily: FP.display, fontWeight: 800, fontSize: 'clamp(30px, 6vw, 46px)',
            lineHeight: 1.05, letterSpacing: -1.4, margin: '14px 0 12px', textWrap: 'balance',
          }}>
            Simulacre de la 1a prova de Mossos {convocatoria}
          </h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: FP.inkSoft, maxWidth: '60ch' }}>
            Les dues subproves del 17 d'octubre, amb el mateix nombre de preguntes, el mateix temps
            i la mateixa penalització. Gratis.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <Part
            num={1}
            titol="Coneixements"
            dades={`${CO.preguntes} preguntes · ${CO.minuts} min · apte amb un ${CO.minim}`}
            detall="Preguntes de tot el temari oficial de Mossos, barrejades. El rellotge compta enrere i en arribar a zero es corregeix sol."
            to={RUTA_PART1}
            textBoto={textBoto}
          />
          <Part
            num={2}
            titol="Aptitudinal"
            dades={`${AP.preguntes} psicotècnics · ${AP.minuts} min · apte amb un ${AP.minim}`}
            detall="Figures, cubs, sèries, càlcul i verbal, amb la barreja i el ritme de l'examen. Al final veuràs el resultat de tot el simulacre."
            to={RUTA_PART2}
            textBoto={textBoto}
          />
        </div>

        <section style={{
          marginTop: 26, background: FP.card, border: `1px solid ${FP.line2}`,
          borderRadius: 20, padding: '18px 20px',
        }}>
          <h2 style={{ fontFamily: FP.display, fontWeight: 800, fontSize: 19, margin: '0 0 10px' }}>
            Com es puntua
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20, color: FP.inkSoft, fontSize: 15, lineHeight: 1.6 }}>
            <li>Cada resposta errònia resta una quarta part d'un encert. Les preguntes en blanc no resten.</li>
            <li>La nota de cada subprova va de 0 a 10.</li>
            <li>Per passar cal un {CO.minim} a coneixements i un {AP.minim} a l'aptitudinal.</li>
            <li>Contestar a l'atzar, de mitjana, ni suma ni resta. Però si pots descartar alguna opció, arriscar-te surt a compte.</li>
          </ul>
        </section>

        <p style={{ marginTop: 22, fontSize: 13, color: FP.inkMuted, lineHeight: 1.5 }}>
          InfoPol és una app independent, sense vinculació amb la Generalitat ni amb el cos de Mossos d'Esquadra.
          El format segueix les bases de la convocatòria {convocatoria}.
        </p>
      </div>
    </div>
  );
}
