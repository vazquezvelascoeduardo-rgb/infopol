import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, NavHeader, Pill } from '../components/Shared';
import { getNoticiesToday, CAT_FILTERS } from '../data/noticias';

const AMBIT_STYLE = {
  cat: { bg: T.cat.operativa.soft, fg: T.cat.operativa.ink, label: 'CAT' },
  esp: { bg: T.cat.leyes.soft,    fg: T.cat.leyes.ink,    label: 'ESP' },
  int: { bg: T.cat.transito.soft, fg: T.cat.transito.ink, label: 'INT' },
};

function AmbitBadge({ ambit }) {
  const s = AMBIT_STYLE[ambit] || AMBIT_STYLE.int;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 7px', borderRadius: T.r.pill,
      background: s.bg, color: s.fg,
      fontFamily: T.font, fontWeight: 800, fontSize: 10,
      letterSpacing: 0.8, textTransform: 'uppercase',
    }}>{s.label}</span>
  );
}

function NewsCard({ noticia }) {
  const k = T.cat[noticia.catColor] || T.cat.operativa;
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.lg,
      borderTop: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
      padding: '14px 16px',
      marginBottom: 12,
    }}>
      {/* meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Pill bg={k.soft} fg={k.ink} size={10}>
          <Icon name={noticia.catIcon} size={12} color={k.ink} strokeWidth={2.5} />
          {noticia.catLabel}
        </Pill>
        <AmbitBadge ambit={noticia.ambit} />
      </div>

      {/* title */}
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16,
        lineHeight: 1.25, letterSpacing: -0.3, color: T.ink,
        marginBottom: 8,
      }}>{noticia.titol}</div>

      {/* summary */}
      <p style={{
        fontFamily: T.font, fontSize: 13, lineHeight: 1.55,
        color: T.inkSoft, margin: '0 0 12px',
      }}>{noticia.resum}</p>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          {noticia.font}
        </span>
        <a
          href={noticia.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: T.font, fontWeight: 700, fontSize: 12,
            color: k.solid, textDecoration: 'none',
          }}
        >
          Llegir article <Icon name="arrow-right" size={13} color={k.solid} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

function formatData(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  const months = ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('all');
  const { data, items } = getNoticiesToday();

  const filtered = activeCat === 'all' ? items : items.filter(n => n.categoria === activeCat);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
              letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.operativa.ink,
            }}>InfoPol · Actualitat</div>
          </div>
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, margin: '4px 0 2px', color: T.ink,
        }}>Notícies</h1>
        {data && (
          <div style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginBottom: 4 }}>
            Actualitzat · <b style={{ color: T.ink }}>{formatData(data)}</b>
            <span style={{ marginLeft: 8, fontSize: 11, color: T.inkFaint }}>· {items.length} notícies</span>
          </div>
        )}
      </div>

      {/* category filter strip */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {CAT_FILTERS.map(f => {
          const isActive = activeCat === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveCat(f.id)}
              style={{
                flexShrink: 0, border: 'none', cursor: 'pointer',
                padding: '7px 14px', borderRadius: T.r.pill,
                background: isActive ? T.cat.operativa.solid : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                boxShadow: T.shadow.card,
                transition: 'background 0.15s, color 0.15s',
              }}
            >{f.label}</button>
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            fontFamily: T.font, fontSize: 14, color: T.inkMuted,
          }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} noticia={n} />)
        )}
      </div>

      {/* footer note */}
      <div style={{ padding: '8px 16px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: T.font, fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Recopilació de fonts obertes. InfoPol no és responsable del contingut extern.
        </p>
      </div>
    </div>
  );
}
