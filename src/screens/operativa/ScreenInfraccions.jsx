import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, SearchField, NavHeader } from '../../components/Shared';
import { INFRACTIONS, searchInfractions } from '../../data/infractions';

const SEV_COLOR = {
  mg: 'alcohol',
  g: 'psico',
  l: 'atajos',
};

const FILTERS = [
  { id: 'totes', label: 'Totes', count: INFRACTIONS.length },
  { id: 'mg', label: 'Molt greus', count: INFRACTIONS.filter(i => i.sev === 'mg').length },
  { id: 'g', label: 'Greus', count: INFRACTIONS.filter(i => i.sev === 'g').length },
  { id: 'l', label: 'Lleus', count: INFRACTIONS.filter(i => i.sev === 'l').length },
  { id: 'lsv', label: 'LSV', count: INFRACTIONS.filter(i => i.article.includes('LSV')).length },
  { id: 'rgc', label: 'RGC', count: INFRACTIONS.filter(i => i.article.includes('RGC')).length },
];

function InfraccionRow({ inf, onClick }) {
  const sevCat = T.cat[SEV_COLOR[inf.sev] || 'atajos'];
  return (
    <div onClick={onClick} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card, borderLeft: `3px solid ${sevCat.solid}`, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, background: T.bg, padding: '2px 6px', borderRadius: 4 }}>{inf.code}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: T.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>{inf.article}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, color: sevCat.ink, background: sevCat.soft, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.4, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{inf.tag}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.35 }}>{inf.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <span style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.ink }}>
          {inf.fine > 0 ? `${inf.fine.toLocaleString('ca')} €` : 'Delicte'}
        </span>
        <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          {inf.points > 0 ? `· ${inf.points} punts` : inf.fine > 0 ? '· sense punts' : ''}
        </span>
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

  const results = useMemo(() => searchInfractions(query, filter), [query, filter]);

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat="transito" kicker="Trànsit · Catàleg SCT / LSV / RGC" title="Infraccions" back
        extra={
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="filter" size={20} color={T.inkSoft} />
          </button>
        }
      />

      <div style={{ padding: '0 16px' }}>
        <SearchField
          placeholder="alcohol, mòbil, casc, art. 76..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 10, paddingBottom: 4 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              border: filter === f.id ? 'none' : `1px solid ${T.hairlineStrong}`,
              background: filter === f.id ? T.ink : '#fff',
              color: filter === f.id ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              {f.label} <span style={{ opacity: 0.6, fontWeight: 600, marginLeft: 3 }}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted }}>
            <Icon name="search" size={36} color={T.inkFaint} />
            <div style={{ marginTop: 12, fontWeight: 700, fontSize: 15 }}>Cap resultat per "{query}"</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Prova amb un altre terme o neteja el filtre.</div>
          </div>
        ) : (
          results.map(inf => (
            <InfraccionRow key={inf.id} inf={inf} onClick={() => navigate(`/operativa/infraccions/${inf.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
