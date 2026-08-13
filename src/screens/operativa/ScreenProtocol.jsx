import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, SectionHead, ProgressBar, DuoButton, Pill, CatIcon, SectionTitle } from '../../components/Shared';
import { useContent } from '../../content/ContentProvider';

function ProtocolCard({ protocol, onClick }) {
  const k = T.cat[protocol.cat] || T.cat.operativa;
  return (
    <div onClick={onClick} style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, borderTop: `3px solid ${k.solid}`, boxShadow: T.shadow.card, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <CatIcon cat={protocol.cat} icon={protocol.icon} size={44} rounded={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: k.ink, marginBottom: 2 }}>{protocol.category}</div>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2, color: T.ink }}>{protocol.title}</div>
        <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{protocol.desc}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
          {protocol.tags.map(t => (
            <span key={t} style={{ background: k.soft, color: k.ink, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.3 }}>{t}</span>
          ))}
        </div>
      </div>
      <Icon name="chevron-right" size={16} color={T.inkMuted} style={{ flexShrink: 0 }} />
    </div>
  );
}

function StepView({ protocol, stepIdx, onPrev, onNext, onClose }) {
  const step = protocol.steps[stepIdx];
  const total = protocol.steps.length;
  const cat = T.cat[protocol.cat] || T.cat.operativa;
  const pct = ((stepIdx + 1) / total) * 100;

  return (
    <div className="screen">
      <StatusBar />

      {/* top bar */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="x" size={18} color={T.ink} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: cat.ink }}>{protocol.category}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Pas {stepIdx + 1} de {total}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: cat.solid }}>{Math.round(pct)}%</span>
        </div>
        <ProgressBar value={pct} color={cat.solid} />
      </div>

      {/* situation card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: cat.solid, color: '#fff', borderRadius: T.r.lg, padding: 18 }}>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.8 }}>Situació — {protocol.title}</div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, lineHeight: 1.15, letterSpacing: -0.4, marginTop: 6 }}>
            {step.title}
          </div>
        </div>
      </div>

      {/* action */}
      <div style={{ padding: '14px 16px 0' }}>
        <SectionTitle>Acció recomanada</SectionTitle>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 16, boxShadow: T.shadow.card }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: cat.soft, color: cat.ink, display: 'grid', placeItems: 'center', fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{step.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4, lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </div>

          {step.warning && (
            <div style={{ padding: 12, borderRadius: 12, background: T.cat.psico.soft, display: 'flex', gap: 10, marginTop: 8 }}>
              <Icon name="bolt" size={18} color={T.cat.psico.ink} />
              <div style={{ fontSize: 12, color: T.cat.psico.ink, lineHeight: 1.4, fontWeight: 600 }}>
                <b>Atenció:</b> {step.warning}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* navigation */}
      <div style={{ padding: '18px 16px 0', display: 'flex', gap: 10 }}>
        <button onClick={onPrev} disabled={stepIdx === 0} style={{
          flex: 0.4, background: '#fff', border: `1px solid ${T.hairlineStrong}`,
          borderRadius: 16, padding: '12px 16px', cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
          fontFamily: T.font, fontWeight: 700, fontSize: 13, color: stepIdx === 0 ? T.inkFaint : T.inkSoft,
        }}>← Anterior</button>
        {stepIdx < total - 1
          ? <DuoButton color="operativa" full leftIcon="arrow-right" onClick={onNext}>Següent pas</DuoButton>
          : <DuoButton color="atajos" full leftIcon="check" onClick={onClose}>Protocol completat</DuoButton>
        }
      </div>
    </div>
  );
}

export default function ScreenProtocol() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { protocols: PROTOCOLS = [] } = useContent();
  const [activeProtocol, setActiveProtocol] = useState(
    () => (id ? PROTOCOLS.find(p => p.id === id) || null : null)
  );
  const [stepIdx, setStepIdx] = useState(0);

  const handleSelect = (protocol) => {
    setActiveProtocol(protocol);
    setStepIdx(0);
  };

  const handleClose = () => {
    setActiveProtocol(null);
    setStepIdx(0);
  };

  if (activeProtocol) {
    return (
      <StepView
        protocol={activeProtocol}
        stepIdx={stepIdx}
        onPrev={() => setStepIdx(i => Math.max(0, i - 1))}
        onNext={() => setStepIdx(i => Math.min(activeProtocol.steps.length - 1, i + 1))}
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '10px 16px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>Operativa</div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>Protocols</h1>
        </div>
      </div>

      {/* highlight banner */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ background: T.cat.operativa.solid, borderRadius: T.r.lg, padding: 16, color: '#fff' }}>
          <Pill bg="rgba(255,255,255,0.18)" fg="#fff">★ Diferenciador InfoPol</Pill>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, marginTop: 8, letterSpacing: -0.3 }}>Protocols pas a pas</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4, lineHeight: 1.4 }}>
            {PROTOCOLS.length * 5}+ passos documentats. Cada situació amb article, sanció, diligència i advertències.
          </div>
        </div>
      </div>

      <SectionHead kicker="Situacions" kickerColor={T.cat.operativa.solid} title={`${PROTOCOLS.length} protocols disponibles`} />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROTOCOLS.map(p => (
          <ProtocolCard key={p.id} protocol={p} onClick={() => handleSelect(p)} />
        ))}
      </div>
    </div>
  );
}
