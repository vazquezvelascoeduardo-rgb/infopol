import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, InfoPolWordmark, Pill } from '../../components/Shared';
import { NOTICIAS, CATEGORIES_NOTICIA, CAT_NOTICIA_COLOR } from '../../data/noticias';

function formatData(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function NoticiaCard({ noticia, onClick }) {
  const colorKey = CAT_NOTICIA_COLOR[noticia.cat] || 'operativa';
  const k = T.cat[colorKey];
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 16,
        boxShadow: T.shadow.card,
        borderLeft: `4px solid ${k.solid}`,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Pill bg={k.soft} fg={k.ink} size={10}>{noticia.categoria}</Pill>
        <span style={{ fontSize: 10, color: T.inkMuted, fontFamily: T.font, fontWeight: 600 }}>{noticia.zona}</span>
        <span style={{ fontSize: 10, color: T.inkFaint, fontFamily: T.font, marginLeft: 'auto' }}>
          {formatData(noticia.data)}
        </span>
      </div>
      <div style={{
        fontFamily: T.fontDisplay,
        fontWeight: 800,
        fontSize: 15,
        lineHeight: 1.3,
        letterSpacing: -0.2,
        color: T.ink,
        marginBottom: 8,
      }}>{noticia.titol}</div>
      <p style={{
        fontFamily: T.font,
        fontSize: 13,
        color: T.inkSoft,
        lineHeight: 1.55,
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{noticia.resum}</p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      }}>
        <span style={{ fontSize: 11, color: T.inkMuted, fontFamily: T.font, fontWeight: 600 }}>
          {noticia.font}
        </span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontFamily: T.font, fontWeight: 700, fontSize: 12,
        }}>
          Llegir <Icon name="arrow-right" size={14} color={k.solid} />
        </div>
      </div>
    </div>
  );
}

export default function ScreenNoticiasHome() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState('totes');

  const noticiesFiltrades = filtre === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === filtre);

  const dataActual = formatData(NOTICIAS[0]?.data || new Date().toISOString().slice(0, 10));

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 10px',
      }}>
        <InfoPolWordmark height={18} />
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}
        >
          <Icon name="x" size={18} color={T.ink} />
        </button>
      </div>

      {/* title */}
      <div style={{ padding: '4px 18px 16px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: T.cat.leyes.solid, marginBottom: 6,
        }}>
          Actualització diària · {dataActual}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, lineHeight: 1.05, color: T.ink, margin: 0,
        }}>
          Noticias del<br/>
          <span style={{ color: T.cat.leyes.solid }}>dia</span>
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 8, marginBottom: 0, lineHeight: 1.5,
        }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* filtres */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 18px 16px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {CATEGORIES_NOTICIA.map(c => {
          const actiu = filtre === c.id;
          const colorKey = CAT_NOTICIA_COLOR[c.id] || 'leyes';
          const k = actiu ? T.cat[colorKey] : null;
          return (
            <button
              key={c.id}
              onClick={() => setFiltre(c.id)}
              style={{
                flexShrink: 0,
                padding: '7px 14px', borderRadius: T.r.pill,
                border: 'none', cursor: 'pointer',
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                letterSpacing: 0.3,
                background: actiu ? (k?.soft || T.cat.leyes.soft) : '#fff',
                color: actiu ? (k?.ink || T.cat.leyes.ink) : T.inkSoft,
                boxShadow: actiu ? 'none' : T.shadow.card,
                outline: actiu ? `2px solid ${k?.solid || T.cat.leyes.solid}` : 'none',
                outlineOffset: -1,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* llista */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {noticiesFiltrades.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            fontFamily: T.font, fontSize: 14, color: T.inkMuted,
          }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        )}
        {noticiesFiltrades.map(n => (
          <NoticiaCard
            key={n.id}
            noticia={n}
            onClick={() => navigate(`/noticias/${n.id}`)}
          />
        ))}
      </div>

      {/* footer */}
      <div style={{
        margin: '24px 18px 0',
        padding: 16,
        background: '#fff',
        borderRadius: T.r.lg,
        boxShadow: T.shadow.card,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: T.font, fontSize: 11, color: T.inkMuted,
          letterSpacing: 0.6, fontWeight: 600,
        }}>
          Resum informatiu diari · InfoPol News
        </div>
        <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 4, fontFamily: T.font }}>
          Actualitzat cada dia a les 22:00
        </div>
      </div>
    </div>
  );
}
