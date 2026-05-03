import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, CatIcon, SectionTitle } from '../../components/Shared';

const INCIDENTS = [
  { cat: 'operativa', icon: 'siren', d: '0,3 km', t: '14:02', title: 'Aldarull · C/ Indústria 88', tag: 'En curs', x: 150, y: 240 },
  { cat: 'alcohol', icon: 'beaker', d: '0,8 km', t: '13:48', title: 'Control alcohol · Av. Diagonal', tag: 'Programat', x: 70, y: 110 },
  { cat: 'transito', icon: 'car', d: '1,2 km', t: '13:31', title: 'Accident lleu · Pl. Catalunya', tag: 'Tancat', x: 190, y: 70 },
  { cat: 'psico', icon: 'flag', d: '1,6 km', t: '12:55', title: 'Avís veïnal · C/ Gran Via', tag: 'Pendent', x: 250, y: 170 },
  { cat: 'atajos', icon: 'check', d: '2,1 km', t: '12:30', title: 'Intervenció resoluta · Pl. Espanya', tag: 'Tancat', x: 80, y: 260 },
];

const TAG_COLOR = {
  'En curs': 'alcohol',
  'Programat': 'operativa',
  'Tancat': 'atajos',
  'Pendent': 'psico',
};

function Pin({ x, y, cat, icon, pulsing }) {
  const k = T.cat[cat];
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)', zIndex: pulsing ? 2 : 1 }}>
      {pulsing && (
        <div style={{ position: 'absolute', left: '50%', top: '100%', width: 32, height: 32, borderRadius: 999, background: k.solid, opacity: 0.25, transform: 'translate(-50%, -50%) scale(1.5)' }} />
      )}
      <div style={{ width: 32, height: 32, borderRadius: '50% 50% 50% 6px', background: k.solid, transform: 'rotate(-45deg)', display: 'grid', placeItems: 'center', boxShadow: '0 6px 14px rgba(19,19,26,0.25)', border: '2px solid #fff' }}>
        <div style={{ transform: 'rotate(45deg)' }}>
          <Icon name={icon} size={14} color="#fff" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

export default function ScreenMapa() {
  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat="operativa" kicker="Patrullatge" title="Mapa d'incidències" />

      {/* Map */}
      <div style={{ margin: '0 16px', borderRadius: T.r.lg, overflow: 'hidden', height: 300, position: 'relative', background: 'linear-gradient(180deg, #E5EBE0 0%, #D8E3D2 100%)', boxShadow: T.shadow.card }}>
        <svg width="100%" height="100%" viewBox="0 0 320 300" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* Roads */}
          <path d="M0 80 L320 120" stroke="#fff" strokeWidth="14" />
          <path d="M0 220 L320 200" stroke="#fff" strokeWidth="10" />
          <path d="M120 0 L100 300" stroke="#fff" strokeWidth="12" />
          <path d="M260 0 L240 300" stroke="#fff" strokeWidth="10" />
          <path d="M0 80 L320 120" stroke="rgba(0,0,0,0.04)" strokeDasharray="4 8" />
          {/* Blocks */}
          <rect x="0" y="0" width="115" height="75" fill="rgba(255,255,255,0.3)" rx="4" />
          <rect x="125" y="0" width="110" height="75" fill="rgba(255,255,255,0.3)" rx="4" />
          <rect x="0" y="125" width="95" height="90" fill="rgba(255,255,255,0.3)" rx="4" />
          <rect x="105" y="125" width="110" height="90" fill="rgba(255,255,255,0.3)" rx="4" />
        </svg>
        {/* Parks */}
        <div style={{ position: 'absolute', top: 130, left: 130, width: 85, height: 55, background: 'rgba(31,178,134,0.22)', borderRadius: 14 }} />
        <div style={{ position: 'absolute', top: 230, left: 30, width: 55, height: 45, background: 'rgba(31,178,134,0.22)', borderRadius: 14 }} />

        {/* Pins */}
        {INCIDENTS.map((inc, i) => (
          <Pin key={i} x={inc.x} y={inc.y} cat={inc.cat} icon={inc.icon} pulsing={inc.tag === 'En curs'} />
        ))}

        {/* User location */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 18, height: 18, borderRadius: 999, background: T.cat.operativa.solid, border: '3px solid #fff', transform: 'translate(-50%, -50%)', boxShadow: '0 0 0 6px rgba(59,107,245,0.2)' }} />

        {/* Controls */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['+', '−'].map(s => (
            <button key={s} style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: 'none', boxShadow: T.shadow.pop, fontWeight: 800, fontSize: 18, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {['alcohol', 'transito', 'operativa', 'psico'].map((cat, i) => {
            const labels = ['Alcohol', 'Trànsit', 'Detencions', 'Avisos'];
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 999, padding: '5px 10px', border: `1px solid ${T.hairline}`, fontSize: 11, fontWeight: 700, color: T.inkSoft }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.cat[cat].solid }} />{labels[i]}
              </div>
            );
          })}
        </div>

        <SectionTitle>Properes a tu</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INCIDENTS.map((inc, i) => {
            const tagCat = T.cat[TAG_COLOR[inc.tag] || 'operativa'];
            return (
              <div key={i} style={{ background: '#fff', borderRadius: T.r.md, padding: 12, boxShadow: T.shadow.card, borderLeft: `2px solid ${T.cat[inc.cat].solid}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <CatIcon cat={inc.cat} icon={inc.icon} size={36} rounded={9} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{inc.title}</div>
                  <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
                    {inc.d} · {inc.t} ·&nbsp;
                    <span style={{ color: tagCat.solid, fontWeight: 800 }}>{inc.tag}</span>
                  </div>
                </div>
                <Icon name="chevron-right" size={16} color={T.inkMuted} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
