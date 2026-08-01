// La capçalera d'una pàgina interior.
//
// Fins ara cada secció duia el seu propi cartell de color amb un cercle
// translúcid a sobre: eren de l'època anterior i cadascun tenia el seu
// to. El disseny v3 no en fa servir —el color va als accents, no al
// fons— i totes les pantalles noves ja porten aquesta forma: kicker,
// títol i una línia d'explicació.
import { Mono, V } from '../lib/v3';

export type Xifra = { valor: string; label: string };

export default function Capcalera({
  kicker,
  titol,
  lead,
  accent = V.terraInk,
  xifres,
  dreta,
}: {
  kicker: string;
  titol: string;
  lead?: string;
  /** Color del kicker. Ha de ser llegible sobre paper (mai el taronja pur). */
  accent?: string;
  /** Xifres del contingut real, si la pàgina en té. */
  xifres?: Xifra[];
  /** Què va a la dreta del títol (un commutador, un botó…). */
  dreta?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: xifres?.length ? 22 : 20 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ minWidth: 0 }}>
          <Mono size={10} color={accent} style={{ letterSpacing: 1.8 }}>{kicker.toUpperCase()}</Mono>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
            {titol}
          </h1>
          {lead && (
            <p style={{ fontSize: 13.5, color: V.muted, lineHeight: 1.5, margin: '7px 0 0', maxWidth: 620 }}>
              {lead}
            </p>
          )}
        </div>
        {dreta}
      </div>

      {xifres && xifres.length > 0 && (
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 18 }}>
          {xifres.map((x) => (
            <div key={x.label}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8 }}>{x.valor}</div>
              <Mono size={9} color={V.faint} style={{ display: 'block', marginTop: 3, letterSpacing: 1.4 }}>
                {x.label.toUpperCase()}
              </Mono>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
