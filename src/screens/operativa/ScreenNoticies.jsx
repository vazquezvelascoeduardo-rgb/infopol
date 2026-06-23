import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar } from '../../components/Shared';

const CAT_STYLE = {
  esports:    T.cat.transito,
  judicial:   T.cat.alcohol,
  política:   T.cat.operativa,
  economia:   T.cat.atajos,
  cultura:    T.cat.psico,
  'ciència':  T.cat.physical,
  seguretat:  T.cat.academia,
  societat:   T.cat.leyes,
  normativa:  T.cat.leyes,
};

function catStyle(categoria) {
  return CAT_STYLE[categoria] || T.cat.operativa;
}

const CATS = [
  { id: 'tots', label: 'Tots' },
  { id: 'esports', label: 'Esports' },
  { id: 'política', label: 'Política' },
  { id: 'judicial', label: 'Judicial' },
  { id: 'economia', label: 'Economia' },
  { id: 'seguretat', label: 'Seguretat' },
  { id: 'cultura', label: 'Cultura' },
  { id: "ciència", label: 'Ciència' },
  { id: 'societat', label: 'Societat' },
  { id: 'normativa', label: 'Normativa' },
];

const AMBITS = [
  { id: 'tots', label: 'Tot' },
  { id: 'catalunya', label: 'Catalunya' },
  { id: 'espanya', label: 'Espanya' },
  { id: 'internacional', label: 'Internacional' },
];

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [cat, setCat] = useState('tots');
  const [ambit, setAmbit] = useState('tots');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = news.filter(n => {
    const catOk = cat === 'tots' || n.categoria === cat;
    const ambitOk = ambit === 'tots' || n.ambit === ambit;
    return catOk && ambitOk;
  });

  return (
    <div className="screen" style={{ background: T.bg, overflowY: 'auto' }}>
      <StatusBar />

      <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card,
            cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0,
          }}
        >
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 11,
            letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid,
          }}>
            InfoPol · Actualitat
          </div>
          <h1 style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22,
            letterSpacing: -0.5, margin: 0, lineHeight: 1.1,
          }}>
            Notícies
          </h1>
        </div>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, flexShrink: 0 }}>
          {filtered.length} art.
        </span>
      </div>

      {/* Filtres categoria */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '0 16px 8px' }}>
        <div style={{ display: 'flex', gap: 6, width: 'max-content' }}>
          {CATS.map(c => {
            const active = cat === c.id;
            const cs = c.id !== 'tots' ? catStyle(c.id) : null;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none',
                  cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: T.font,
                  background: active ? (cs ? cs.solid : T.ink) : '#fff',
                  color: active ? '#fff' : T.inkMuted,
                  boxShadow: active ? 'none' : T.shadow.card,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtres àmbit */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', gap: 6, width: 'max-content' }}>
          {AMBITS.map(a => {
            const active = ambit === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAmbit(a.id)}
                style={{
                  padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
                  fontWeight: 700, fontSize: 11, fontFamily: T.font,
                  border: `1.5px solid ${active ? T.ink : T.hairlineStrong}`,
                  background: active ? T.ink : 'transparent',
                  color: active ? '#fff' : T.inkMuted,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 100 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 48, color: T.inkMuted, fontSize: 13 }}>
            Carregant notícies…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: T.inkMuted, fontSize: 13 }}>
            Cap notícia amb els filtres actuals.
          </div>
        )}
        {filtered.map((n, i) => {
          const cs = catStyle(n.categoria);
          return (
            <div
              key={n.id || i}
              onClick={n.url ? () => window.open(n.url, '_blank') : undefined}
              style={{
                background: '#fff',
                borderRadius: T.r.md,
                padding: 14,
                borderLeft: `3px solid ${cs.solid}`,
                boxShadow: T.shadow.card,
                cursor: n.url ? 'pointer' : 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5,
                  textTransform: 'uppercase', color: cs.ink,
                  background: cs.soft, padding: '2px 8px', borderRadius: 999,
                }}>
                  {n.tag}
                </span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>
                  {n.dateLabel}
                </span>
                {n.url && <Icon name="arrow-right" size={11} color={T.inkFaint} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>
                {n.title}
              </div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>
                {n.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
