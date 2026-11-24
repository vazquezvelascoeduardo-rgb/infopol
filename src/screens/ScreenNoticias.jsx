import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, Pill } from '../components/Shared';
import { NOTICIAS, CATS_NOTICIAS } from '../data/noticias';

const CAT_ALL = 'totes';

function NewsCard({ noticia }) {
  const catDef = CATS_NOTICIAS[noticia.cat];
  const col = T.cat[catDef?.token || 'operativa'];

  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${col.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, color: col.solid,
            letterSpacing: 0.7, textTransform: 'uppercase',
            fontFamily: T.font,
          }}>
            {noticia.tag}
          </span>
          <span style={{
            fontFamily: T.fontMono, fontSize: 10,
            color: T.inkMuted, marginLeft: 'auto', flexShrink: 0,
          }}>
            {noticia.data}
          </span>
        </div>
        <div style={{
          fontWeight: 800, fontSize: 14,
          color: T.ink, lineHeight: 1.3,
          letterSpacing: -0.2,
          fontFamily: T.fontDisplay,
        }}>
          {noticia.titol}
        </div>
        <div style={{
          fontSize: 12, color: T.inkMuted,
          marginTop: 5, lineHeight: 1.5,
          fontFamily: T.font,
        }}>
          {noticia.resum}
        </div>
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 4,
          color: col.solid, fontWeight: 700, fontSize: 12, fontFamily: T.font,
        }}>
          Llegir notícia completa
          <Icon name="arrow-right" size={13} color={col.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [catActiva, setCatActiva] = useState(CAT_ALL);

  const noticiesFiltrades = catActiva === CAT_ALL
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === catActiva);

  const dataActual = NOTICIAS[0]?.data || '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: 999, border: 'none',
              background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}
          >
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
            letterSpacing: 1.1, textTransform: 'uppercase', color: T.inkMuted,
          }}>
            Actualitzat · {dataActual}
          </div>
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 28, letterSpacing: -0.8, margin: 0, lineHeight: 1.05,
        }}>
          Noticias <span style={{ color: T.cat.operativa.solid }}>del dia</span>
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 6, marginBottom: 0, lineHeight: 1.5,
        }}>
          Política, economia, esports, judicial i molt més. Resumit per InfoPol.
        </p>
      </div>

      {/* filter chips */}
      <div style={{
        padding: '0 16px 14px',
        display: 'flex', gap: 8, overflowX: 'auto',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        <ChipFiltro
          label="Totes"
          activa={catActiva === CAT_ALL}
          color={T.ink}
          soft="rgba(19,19,26,0.07)"
          onClick={() => setCatActiva(CAT_ALL)}
        />
        {Object.entries(CATS_NOTICIAS).map(([key, def]) => {
          const col = T.cat[def.token];
          return (
            <ChipFiltro
              key={key}
              label={def.label}
              activa={catActiva === key}
              color={col.solid}
              soft={col.soft}
              onClick={() => setCatActiva(key)}
            />
          );
        })}
      </div>

      {/* llista de noticias */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {noticiesFiltrades.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        )}
        {noticiesFiltrades.map(n => <NewsCard key={n.id} noticia={n} />)}
      </div>

      <div style={{
        padding: '20px 16px 0',
        textAlign: 'center',
        fontFamily: T.font, fontSize: 11, color: T.inkFaint,
      }}>
        Noticias compilades per InfoPol a les 22:00 h · fonts EFE, Infobae, Poder Judicial
      </div>
    </div>
  );
}

function ChipFiltro({ label, activa, color, soft, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '7px 14px',
        borderRadius: T.r.pill,
        border: 'none',
        cursor: 'pointer',
        fontFamily: T.font, fontWeight: 700, fontSize: 11,
        letterSpacing: 0.3, textTransform: 'uppercase',
        background: activa ? color : soft,
        color: activa ? '#fff' : color,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  );
}
