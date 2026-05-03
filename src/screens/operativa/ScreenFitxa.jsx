import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, Pill, SectionTitle } from '../../components/Shared';
import { INFRACTIONS } from '../../data/infractions';

const SEV_COLOR = { mg: 'alcohol', g: 'psico', l: 'atajos' };

function StatCard({ label, value, inverted }) {
  return (
    <div style={{ background: inverted ? 'rgba(255,255,255,0.14)' : T.bg, borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, opacity: inverted ? 0.85 : 1, letterSpacing: 0.6, textTransform: 'uppercase', color: inverted ? '#fff' : T.inkMuted }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2, color: inverted ? '#fff' : T.ink }}>{value}</div>
    </div>
  );
}

const TABS = ['Resum', 'Llei', 'Procediment', 'Diligència'];

export default function ScreenFitxa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const inf = INFRACTIONS.find(i => i.id === id) || INFRACTIONS[0];
  const catKey = SEV_COLOR[inf.sev] || 'atajos';
  const cat = T.cat[catKey];

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat={catKey} kicker={`${inf.article} · LSV`} title={inf.tag} back />

      {/* hero */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: cat.solid, color: '#fff', borderRadius: T.r.lg, padding: 16, position: 'relative', overflow: 'hidden' }}>
          <Pill bg="rgba(255,255,255,0.2)" fg="#fff">{inf.tag}{inf.crimeArticle ? ' · Penal' : ''}</Pill>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 36, letterSpacing: -1.2, lineHeight: 1 }}>
              {inf.fine > 0 ? `${inf.fine.toLocaleString('ca')} €` : 'DELICTE'}
            </div>
            {inf.points > 0 && <div style={{ fontWeight: 700, fontSize: 14, opacity: 0.85 }}>+ {inf.points} pts</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            {inf.crimeArticle && <StatCard label="Possible delicte" value={inf.crimeArticle} inverted />}
            {inf.detention && <StatCard label="Detenció" value={inf.detention} inverted />}
            {inf.licenseRevoked && <StatCard label="Permís retirat" value={inf.licenseRevoked} inverted />}
            {inf.formType && <StatCard label="Diligència" value={inf.formType} inverted />}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '14px 16px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: tab === i ? cat.solid : '#fff',
            color: tab === i ? '#fff' : T.inkSoft,
            fontFamily: T.font, fontWeight: 700, fontSize: 12, flexShrink: 0,
            boxShadow: tab === i ? `inset 0 -2px 0 rgba(0,0,0,0.18)` : T.shadow.card,
          }}>{t}</button>
        ))}
      </div>

      {/* Content by tab */}
      <div style={{ padding: '14px 16px' }}>
        {tab === 0 && (
          <>
            <SectionTitle>Descripció</SectionTitle>
            <div style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card, marginBottom: 14 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, color: cat.ink, marginBottom: 6, fontWeight: 700 }}>{inf.article}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.4 }}>{inf.title}</div>
              {inf.keywords && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
                  {inf.keywords.map(kw => (
                    <span key={kw} style={{ background: cat.soft, color: cat.ink, padding: '3px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }}>{kw}</span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 1 && inf.legalText && (
          <>
            <SectionTitle>Text legal</SectionTitle>
            <div style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card, marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.6, fontStyle: 'italic' }}>
                <i>"{inf.legalText.slice(0, 200)}…"</i>
              </div>
              {inf.penalties && (
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {inf.penalties.map(p => (
                    <Pill key={p} bg={cat.soft} fg={cat.ink}>{p}</Pill>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 2 && (
          <>
            <SectionTitle>Procediment recomanat</SectionTitle>
            {inf.steps ? (
              <div style={{ background: '#fff', borderRadius: T.r.md, boxShadow: T.shadow.card, overflow: 'hidden' }}>
                {inf.steps.map((step, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 999, background: cat.soft, color: cat.ink, display: 'grid', placeItems: 'center', fontFamily: T.fontMono, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 500, lineHeight: 1.4 }}>{step}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: T.r.md, padding: 16, boxShadow: T.shadow.card, color: T.inkMuted, fontSize: 13 }}>
                Consulta el protocol específic des de la pestanya Protocols.
              </div>
            )}
          </>
        )}

        {tab === 3 && (
          <>
            <SectionTitle>Diligència / documentació</SectionTitle>
            <div style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DocItem icon="pen" label="Tipus de diligència" value={inf.formType || 'Denúncia administrativa (DTE)'} />
                <DocItem icon="scale" label="Fonament legal" value={inf.article} />
                {inf.crimeArticle && <DocItem icon="book" label="Tipus penal" value={inf.crimeArticle} />}
                <DocItem icon="flag" label="Resolució" value={inf.sev === 'mg' ? 'Expedient sancionador + notificació' : inf.sev === 'g' ? 'Expedient sancionador' : 'Notificació directa'} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DocItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${T.hairline}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: T.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={16} color={T.inkSoft} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}
