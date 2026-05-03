import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, CatIcon, DuoButton } from '../components/Shared';

const MODES = [
  {
    id: 'operativa',
    cat: 'operativa',
    icon: 'shield',
    title: 'Soc policia en actiu',
    desc: 'Cerca infraccions, articles i protocols mentre patrulles.',
    tags: ['Tràfic', 'Lleis', 'Protocols', 'Mapa'],
    dest: '/operativa',
  },
  {
    id: 'academia',
    cat: 'academia',
    icon: 'graduation',
    title: 'Estic opositant',
    desc: 'Tests oficials, flashcards, simulacres i pla d\'estudi diari.',
    tags: ['Mossos', 'Català', 'Físiques', 'Psicotècnics'],
    dest: '/academia',
  },
  {
    id: 'both',
    cat: 'atajos',
    icon: 'bolt',
    title: 'Les dues coses',
    desc: 'Sóc agent i estic preparant un ascens o trasllat a Mossos.',
    tags: ['Operativa', 'Acadèmia'],
    dest: '/operativa',
  },
];

export default function ScreenOnboarding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('operativa');

  const handleContinue = () => {
    const mode = MODES.find(m => m.id === selected);
    navigate(mode?.dest || '/operativa');
  };

  return (
    <div className="screen-no-tabs">
      <StatusBar />
      <div style={{ padding: '12px 18px 0' }}>
        <InfoPolWordmark height={18} />
      </div>

      <div style={{ padding: '40px 18px 0' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkMuted }}>Pas 2 de 3</div>
        <h2 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, lineHeight: 1.1, margin: '8px 0 6px' }}>
          Per què fas servir<br/>InfoPol?
        </h2>
        <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>Pots canviar de mode en qualsevol moment.</p>
      </div>

      <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MODES.map(mode => {
          const k = T.cat[mode.cat];
          const isSelected = selected === mode.id;
          return (
            <div key={mode.id} onClick={() => setSelected(mode.id)} style={{
              background: '#fff', borderRadius: T.r.lg, padding: 16, position: 'relative', cursor: 'pointer',
              borderTop: `3px solid ${k.solid}`,
              outline: isSelected ? `2px solid ${k.solid}` : `1px solid ${T.hairline}`,
              outlineOffset: isSelected ? -1 : 0,
              boxShadow: isSelected ? T.shadow.pop : T.shadow.card,
              transition: 'box-shadow 0.15s, outline 0.15s',
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <CatIcon cat={mode.cat} icon={mode.icon} size={48} rounded={14} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2, color: T.ink }}>{mode.title}</div>
                  <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 2, lineHeight: 1.4 }}>{mode.desc}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: isSelected ? 'none' : `2px solid ${T.hairlineStrong}`,
                  background: isSelected ? k.solid : 'transparent',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  {isSelected && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {mode.tags.map(t => (
                  <span key={t} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: k.ink, background: k.soft, padding: '4px 9px', borderRadius: 999 }}>{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 18px 40px' }}>
        <DuoButton color="academia" full leftIcon="arrow-right" onClick={handleContinue}>Continua</DuoButton>
      </div>
    </div>
  );
}
