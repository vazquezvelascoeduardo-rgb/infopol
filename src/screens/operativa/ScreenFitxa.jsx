import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, Pill, SectionTitle } from '../../components/Shared';
import FontFooter from '../../components/FontFooter';
import {
  NORMES, FONT, findInfraction, INFRACTIONS,
  LLINDAR_PENAL_ALCOHOL, LLINDAR_PENAL_VELOCITAT, DELICTES_TRANSIT,
} from '../../data/infractions';

const SEV_COLOR = { mg: 'alcohol', gmg: 'alcohol', g: 'psico', l: 'atajos' };

function StatCard({ label, value, inverted }) {
  return (
    <div style={{ background: inverted ? 'rgba(255,255,255,0.14)' : T.bg, borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, opacity: inverted ? 0.85 : 1, letterSpacing: 0.6, textTransform: 'uppercase', color: inverted ? '#fff' : T.inkMuted }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2, color: inverted ? '#fff' : T.ink }}>{value}</div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card, marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

const TABS = ['Resum', 'Font', 'Penal'];

export default function ScreenFitxa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const inf = findInfraction(id) || INFRACTIONS[0];
  const catKey = SEV_COLOR[inf.sev] || 'operativa';
  const cat = T.cat[catKey];
  const norma = NORMES[inf.norm];
  const esCataleg = !!norma; // fora del catàleg del SCT: seguretat ciutadana

  // Delictes que poden desplaçar la sanció administrativa d'aquesta fitxa.
  const penalRelacionat = DELICTES_TRANSIT.filter(d =>
    (inf.barem === 'alcohol' && d.id === 'CP-379-2') ||
    (inf.barem === 'velocitat' && d.id === 'CP-379-1') ||
    (inf.crimeArticle || '').includes(d.article.replace('Art. ', '').replace(' CP', '')),
  );

  const importPrincipal = inf.fineLabel || (inf.fine > 0 ? `${inf.fine.toLocaleString('ca')} €` : '—');

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader
        cat={catKey}
        kicker={inf.article}
        title={inf.tag}
        back
      />

      {/* hero */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: cat.solid, color: '#fff', borderRadius: T.r.lg, padding: 16 }}>
          <Pill bg="rgba(255,255,255,0.2)" fg="#fff">{inf.tag}</Pill>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: inf.fineLabel ? 22 : 36, letterSpacing: -1, lineHeight: 1.05 }}>
              {importPrincipal}
            </div>
            {inf.points > 0 && <div style={{ fontWeight: 700, fontSize: 14, opacity: 0.85 }}>−{inf.points} punts</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            {inf.fine50 != null && <StatCard label="Amb DTE 50%" value={`${inf.fine50} €`} inverted />}
            {inf.dteNo && <StatCard label="Descompte" value="No aplicable" inverted />}
            {inf.fineMax && <StatCard label="Màxim legal" value={`${inf.fineMax.toLocaleString('ca')} €`} inverted />}
            {inf.barem && (
              <StatCard
                label="Barem"
                value={inf.barem === 'alcohol' ? 'Alcoholèmia' : 'Velocitat'}
                inverted
              />
            )}
            {inf.crimeArticle && <StatCard label="Possible delicte" value={inf.crimeArticle} inverted />}
          </div>
          {inf.barem && (
            <button onClick={() => navigate(`/operativa/barems?b=${inf.barem}`)} style={{
              marginTop: 12, width: '100%', border: 'none', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.22)', color: '#fff', padding: '10px 0',
              fontFamily: T.font, fontWeight: 800, fontSize: 13,
            }}>
              Obrir el barem i calcular la sanció
            </button>
          )}
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
            boxShadow: tab === i ? 'inset 0 -2px 0 rgba(0,0,0,0.18)' : T.shadow.card,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: '14px 16px' }}>
        {tab === 0 && (
          <>
            <SectionTitle>Concepte de la infracció</SectionTitle>
            <Card>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, color: cat.ink, marginBottom: 6, fontWeight: 700 }}>
                {inf.article}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.45 }}>{inf.title}</div>
              {inf.note && (
                <div style={{ marginTop: 10, padding: 10, background: T.bg, borderRadius: 9, fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5 }}>
                  {inf.note}
                </div>
              )}
              {!!(inf.keywords || []).length && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
                  {inf.keywords.map(kw => (
                    <span key={kw} style={{ background: cat.soft, color: cat.ink, padding: '3px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }}>{kw}</span>
                  ))}
                </div>
              )}
            </Card>

            {esCataleg ? (
              <>
                <SectionTitle>Ubicació al catàleg</SectionTitle>
                <Card>
                  <Row label="Norma" value={`${norma.nom} (${norma.ref})`} />
                  {inf.block && <Row label="Bloc" value={inf.block} />}
                  {inf.sub && <Row label="Epígraf" value={inf.sub} />}
                  {inf.page && <Row label="Pàgina del catàleg" value={`${inf.page} de 41`} last />}
                </Card>

                <div style={{
                  background: T.cat.leyes.soft, borderRadius: T.r.md, padding: 12,
                  fontSize: 12, color: T.cat.leyes.ink, lineHeight: 1.5,
                }}>
                  <b>La butlleta no es redacta des d'aquí.</b> Si el fet no encaixa exactament amb
                  aquest redactat, l'agent l'ha d'adaptar al fet realment ocorregut i consignar
                  l'article i l'apartat aplicables ({FONT.document}, pàg. 4).
                </div>
              </>
            ) : (
              <div style={{
                background: T.cat.operativa.soft, borderRadius: T.r.md, padding: 12,
                fontSize: 12, color: T.cat.operativa.ink, lineHeight: 1.5,
              }}>
                <b>Fora del catàleg de trànsit.</b> Aquest supòsit no consta al catàleg del SCT.
                Font: {inf.fontDoc}. La quantia la fixa la resolució sancionadora dins del grau
                que correspongui.
              </div>
            )}
          </>
        )}

        {tab === 1 && (
          <>
            <SectionTitle>Procedència d'aquesta fitxa</SectionTitle>
            <Card>
              <Row
                label="Document"
                value={esCataleg ? `${FONT.entitat} — «${FONT.document}»` : inf.fontDoc}
              />
              {esCataleg && <Row label="Versió" value={FONT.versioLabel} />}
              <Row label="Norma infringida" value={esCataleg ? norma.ref : inf.article} />
              <Row label="Naturalesa" value={inf.tag} />
              <Row label="Quantia" value={importPrincipal} />
              <Row label="Amb DTE" value={inf.dteNo ? 'Sense descompte' : inf.fine50 != null ? `${inf.fine50} €` : '—'} />
              <Row label="Pèrdua de punts" value={inf.points > 0 ? `${inf.points}` : 'Cap'} last />
            </Card>
            {esCataleg && <FontFooter compact />}
          </>
        )}

        {tab === 2 && (
          <>
            <SectionTitle>Llindar penal</SectionTitle>
            {inf.barem === 'alcohol' && <PenalAvis avis={LLINDAR_PENAL_ALCOHOL.avis} article={LLINDAR_PENAL_ALCOHOL.article} />}
            {inf.barem === 'velocitat' && <PenalAvis avis={LLINDAR_PENAL_VELOCITAT.avis} article={LLINDAR_PENAL_VELOCITAT.article} />}
            {penalRelacionat.length === 0 && !inf.barem && !inf.crimeArticle && (
              <Card>
                <div style={{ fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>
                  El catàleg no associa cap tipus penal a aquest supòsit. Si els fets concrets
                  poden ser delicte, la via administrativa decau i s'ha d'instruir atestat.
                </div>
              </Card>
            )}
            {inf.crimeArticle && (
              <Card>
                <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: T.cat.alcohol.ink }}>
                  {inf.crimeArticle}
                </div>
              </Card>
            )}
            {penalRelacionat.map(d => (
              <Card key={d.id}>
                <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.cat.alcohol.ink, fontWeight: 700 }}>{d.article}</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 3 }}>{d.title}</div>
                <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.55, marginTop: 8, fontStyle: 'italic' }}>
                  «{d.text}»
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {d.penes.map(p => <Pill key={p} bg={T.cat.alcohol.soft} fg={T.cat.alcohol.ink}>{p}</Pill>)}
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function PenalAvis({ avis, article }) {
  return (
    <div style={{
      background: T.cat.alcohol.soft, borderRadius: T.r.md, padding: 14, marginBottom: 12,
      borderLeft: `3px solid ${T.cat.alcohol.solid}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="siren" size={16} color={T.cat.alcohol.ink} />
        <div style={{ fontWeight: 800, fontSize: 12.5, color: T.cat.alcohol.ink, textTransform: 'uppercase', letterSpacing: 0.4 }}>
          {article}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: T.cat.alcohol.ink, lineHeight: 1.55, marginTop: 8 }}>{avis}</div>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ padding: '8px 0', borderBottom: last ? 'none' : `1px solid ${T.hairline}` }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: T.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginTop: 2, lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}
