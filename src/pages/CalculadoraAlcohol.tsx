// Pàgina dedicada a la calculadora d'alcoholèmia (disseny v3).
// Accés directe des d'Operativa: /calculadora-alcohol
import AlcoholCalculator from '../components/AlcoholCalculator';
import WidmarkCalculator from '../components/WidmarkCalculator';
import Capcalera from '../components/Capcalera';
import { CardV, Mono, V } from '../lib/v3';

export default function CalculadoraAlcohol() {
  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 820, width: '100%' }}>
      <Capcalera
        kicker="Eina ràpida · trànsit"
        titol="Calculadora d'alcoholèmia"
        lead="La sanció segons la taxa (mg/l), el tipus de conductor i si hi ha via penal."
      />

      <CardV pad={20} style={{ marginBottom: 22 }}>
        <AlcoholCalculator />
      </CardV>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
        <Mono size={10} color={V.muted} style={{ letterSpacing: 1.4 }}>CÀLCUL WIDMARK · 2 PROVES</Mono>
        <span style={{ flex: 1, height: 1, background: V.hair }} />
      </div>
      <CardV pad={20}>
        <WidmarkCalculator />
      </CardV>
    </div>
  );
}
