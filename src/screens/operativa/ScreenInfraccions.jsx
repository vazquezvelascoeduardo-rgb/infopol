import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, SearchField, NavHeader } from '../../components/Shared';
import FontFooter from '../../components/FontFooter';
import { INFRACTIONS, TOTES_INFRACCIONS, FILTRES, searchInfractions } from '../../data/infractions';
import { FONT } from '../../data/infractions';

const PAGE = 40;

// Color per naturalesa de la infracció. `gmg` = greu o molt greu segons barem.
const SEV_COLOR = { mg: 'alcohol', gmg: 'alcohol', g: 'psico', l: 'atajos' };
const sevCat = sev => T.cat[SEV_COLOR[sev] || 'operativa'];

function importLabel(inf) {
  if (inf.fineLabel) return inf.fineLabel;
  if (inf.fine > 0) return `${inf.fine.toLocaleString('ca')} €`;
  return '—';
}

function InfraccionRow({ inf, onClick }) {
  const cat = sevCat(inf.sev);
  return (
    <div onClick={onClick} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card, borderLeft: `3px solid ${cat.solid}`, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, background: T.bg, padding: '2px 6px', borderRadius: 4 }}>{inf.code}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: T.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>{inf.article}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, color: cat.ink, background: cat.soft, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.4, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{inf.tag}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.35 }}>{inf.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <span style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: inf.fineLabel ? 13 : 16, color: T.ink }}>
          {importLabel(inf)}
        </span>
        {inf.fine50 != null && (
          <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>· DTE 50% {inf.fine50} €</span>
        )}
        {inf.points > 0 && (
          <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 700 }}>· −{inf.points} punts</span>
        )}
        <Icon name="chevron-right" size={16} color={T.inkMuted} style={{ marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

export default function ScreenInfraccions() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [filter, setFilter] = useState('totes');
  const [shown, setShown] = useState(PAGE);

  const results = useMemo(() => searchInfractions(query, filter), [query, filter]);
  const counts = useMemo(
    () => Object.fromEntries(FILTRES.map(f => [f.id, TOTES_INFRACCIONS.filter(f.test).length])),
    [],
  );

  const change = fn => (...a) => { fn(...a); setShown(PAGE); };

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader
        cat="transito"
        kicker={`Catàleg SCT · ${FONT.versioLabel}`}
        title="Infraccions"
        back
        extra={
          <button onClick={() => navigate('/operativa/barems')} title="Barems"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="gauge" size={20} color={T.inkSoft} />
          </button>
        }
      />

      <div style={{ padding: '0 16px' }}>
        <SearchField
          placeholder="alcohol, mòbil, casc, 94.2, estacionar…"
          value={query}
          onChange={change(e => setQuery(e.target.value))}
        />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 10, paddingBottom: 4 }}>
          {FILTRES.map(f => (
            <button key={f.id} onClick={change(() => setFilter(f.id))} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              border: filter === f.id ? 'none' : `1px solid ${T.hairlineStrong}`,
              background: filter === f.id ? T.ink : '#fff',
              color: filter === f.id ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              {f.label} <span style={{ opacity: 0.6, fontWeight: 600, marginLeft: 3 }}>{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, fontWeight: 600, marginTop: 8 }}>
          {results.length} {results.length === 1 ? 'resultat' : 'resultats'} · {INFRACTIONS.length} supòsits del catàleg del SCT
          {' '}+ {TOTES_INFRACCIONS.length - INFRACTIONS.length} de seguretat ciutadana
        </div>
      </div>

      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted }}>
            <Icon name="search" size={36} color={T.inkFaint} />
            <div style={{ marginTop: 12, fontWeight: 700, fontSize: 15 }}>Cap resultat per "{query}"</div>
            <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
              El catàleg no és una llista tancada. Si el fet no hi consta, s'ha de redactar
              segons el criteri de l'agent, consignant l'article aplicable.
            </div>
          </div>
        ) : (
          <>
            {results.slice(0, shown).map(inf => (
              <InfraccionRow key={inf.id} inf={inf} onClick={() => navigate(`/operativa/infraccions/${inf.id}`)} />
            ))}
            {results.length > shown && (
              <button onClick={() => setShown(s => s + PAGE)} style={{
                background: '#fff', border: `1px solid ${T.hairlineStrong}`, borderRadius: T.r.md,
                padding: '12px 0', fontFamily: T.font, fontWeight: 700, fontSize: 13,
                color: T.inkSoft, cursor: 'pointer',
              }}>
                Mostra'n {Math.min(PAGE, results.length - shown)} més
              </button>
            )}
          </>
        )}
      </div>

      <FontFooter />
    </div>
  );
}
