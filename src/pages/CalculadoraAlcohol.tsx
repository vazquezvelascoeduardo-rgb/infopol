// Pàgina dedicada a la calculadora d'alcoholèmia (rediseny Claude Design).
// Accés directe des d'Operativa: /calculadora-alcohol
import { Link } from 'react-router-dom';
import AlcoholCalculator from '../components/AlcoholCalculator';
import WidmarkCalculator from '../components/WidmarkCalculator';
import { A, Ic, Mono, Card, Shell } from '../lib/design';

export default function CalculadoraAlcohol() {
  return (
    <Shell max={780}>
      <nav style={{ fontFamily: A.sans, fontSize: 13, color: A.inkMuted, marginBottom: 14 }}>
        <Link to="/operativa" style={{ color: A.inkMuted, textDecoration: 'none' }}>Operativa</Link>
        <span style={{ margin: '0 8px' }} aria-hidden>/</span>
        <span style={{ color: A.inkSoft }}>Alcoholèmia</span>
      </nav>

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: `linear-gradient(150deg, ${A.pink}, #C2185B)`, color: '#fff', padding: 'clamp(22px,3vw,30px)', boxShadow: A.shadowMd, marginBottom: 18 }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: A.inset }}><Ic name="flask" size={28} color="#fff" sw={2.2} /></span>
          <div style={{ minWidth: 0 }}>
            <Mono size={11} color="rgba(255,255,255,0.85)">Eina ràpida · trànsit</Mono>
            <h1 style={{ margin: '6px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(24px,3.4vw,34px)', letterSpacing: -1, lineHeight: 1.05 }}>Calculadora d'alcoholèmia</h1>
            <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 14.5, lineHeight: 1.5, opacity: 0.92, maxWidth: 480 }}>Determina la sanció segons la taxa (mg/l), el tipus de conductor i si hi ha via penal.</p>
          </div>
        </div>
      </div>

      <Card pad={20} style={{ marginBottom: 22 }}>
        <AlcoholCalculator />
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 12px' }}>
        <Ic name="flask" size={15} color={A.inkMuted} sw={2.2} />
        <Mono color={A.inkSoft}>Càlcul Widmark · 2 proves</Mono>
        <span style={{ flex: 1, height: 1, background: A.line }} />
      </div>
      <Card pad={20}>
        <WidmarkCalculator />
      </Card>
    </Shell>
  );
}
