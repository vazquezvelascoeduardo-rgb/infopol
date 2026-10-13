import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, CatIcon, RoundIconBtn } from '../components/Shared';
import { NOTICIES, CAT_COLORS, CAT_ICONS } from '../data/noticies';

const FILTRES = [
  { id: 'tot', label: 'Tot' },
  { id: 'politica', label: 'Política' },
  { id: 'policial', label: 'Policial' },
  { id: 'economia', label: 'Economia' },
  { id: 'esports', label: 'Esports' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'premis', label: 'Premis' },
  { id: 'descobriments', label: 'Descobriments' },
];

function NoticiaCard({ noticia }) {
  const cat = CAT_COLORS[noticia.cat] || 'operativa';
  const icon = CAT_ICONS[noticia.cat] || 'bolt';
  const k = T.cat[cat];

  const handleClick = () => {
    if (noticia.link) window.open(noticia.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={handleClick} style={{
      background: '#fff', borderRadius: T.r.lg,
      borderTop: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card, padding: 14,
      cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <CatIcon cat={cat} icon={icon} size={36} rounded={9} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 3 }}>
            <span style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 9.5,
              letterSpacing: 0.9, textTransform: 'uppercase', color: k.ink,
            }}>{noticia.catLabel}</span>
            <span style={{ fontFamily: T.fontMono, fontSize: 9.5, color: T.inkMuted, flexShrink: 0 }}>{noticia.data}</span>
          </div>
          <div style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14.5,
            letterSpacing: -0.2, color: T.ink, lineHeight: 1.25,
          }}>{noticia.titol}</div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.45 }}>{noticia.resum}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontWeight: 700, fontSize: 12 }}>
        Llegir notícia completa <Icon name="arrow-right" size={13} color={k.solid} />
      </div>
    </div>
  );
}

function NoticiaDestacada({ noticia }) {
  const cat = CAT_COLORS[noticia.cat] || 'operativa';
  const k = T.cat[cat];

  const handleClick = () => {
    if (noticia.link) window.open(noticia.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={handleClick} style={{
      background: k.solid, borderRadius: T.r.xl, padding: 18,
      color: '#fff', position: 'relative', overflow: 'hidden', cursor: 'pointer',
    }}>
      <div style={{ position: 'absolute', right: -28, top: -28, width: 130, height: 130, borderRadius: 200, background: 'rgba(255,255,255,0.1)' }} />
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'rgba(255,255,255,0.2)', padding: '4px 10px',
        borderRadius: 999, fontSize: 10.5, fontWeight: 800,
        letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10,
      }}>★ Destacat · {noticia.catLabel}</div>
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18,
        letterSpacing: -0.3, lineHeight: 1.2, marginBottom: 8,
      }}>{noticia.titol}</div>
      <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.45 }}>{noticia.resum}</div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 12 }}>
        Llegir notícia completa <Icon name="arrow-right" size={13} color="#fff" />
      </div>
    </div>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [filtreActiu, setFiltreActiu] = useState('tot');

  const noticiesFiltrades = filtreActiu === 'tot'
    ? NOTICIES
    : NOTICIES.filter(n => n.cat === filtreActiu);

  const destacada = NOTICIES[0];
  const resta = noticiesFiltrades.filter(n => n.id !== destacada.id || filtreActiu !== 'tot');

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 34, height: 34, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="arrow-left" size={17} color={T.ink} />
          </button>
          <InfoPolWordmark height={17} />
        </div>
        <RoundIconBtn icon="bell" />
      </div>

      {/* header */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.leyes.solid, marginBottom: 4 }}>
          Actualitat · 13 octubre 2026
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.7, margin: 0, lineHeight: 1.05 }}>
          Notícies del <span style={{ color: T.cat.academia.solid }}>dia</span>.
        </h1>
      </div>

      {/* destacada */}
      {filtreActiu === 'tot' && destacada && (
        <div style={{ padding: '0 16px 14px' }}>
          <NoticiaDestacada noticia={destacada} />
        </div>
      )}

      {/* filtres */}
      <div style={{ paddingBottom: 10 }}>
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {FILTRES.map(f => {
            const actiu = filtreActiu === f.id;
            const col = f.id !== 'tot' ? T.cat[CAT_COLORS[f.id] || 'operativa'] : null;
            return (
              <button key={f.id} onClick={() => setFiltreActiu(f.id)} style={{
                flexShrink: 0, border: 'none', borderRadius: T.r.pill, cursor: 'pointer',
                padding: '7px 14px', fontFamily: T.font, fontWeight: 700, fontSize: 12,
                background: actiu ? (col ? col.solid : T.ink) : '#fff',
                color: actiu ? '#fff' : T.inkSoft,
                boxShadow: T.shadow.card,
                transition: 'all 0.15s',
              }}>{f.label}</button>
            );
          })}
        </div>
      </div>

      {/* llistat */}
      <div style={{ padding: '4px 16px 0' }}>
        <SectionHead
          kicker={filtreActiu === 'tot' ? 'Totes les categories' : FILTRES.find(f => f.id === filtreActiu)?.label}
          kickerColor={filtreActiu !== 'tot' ? T.cat[CAT_COLORS[filtreActiu] || 'operativa']?.solid : T.inkMuted}
          title={`${noticiesFiltrades.length} notícia${noticiesFiltrades.length !== 1 ? 'cies' : ''}`}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(filtreActiu === 'tot' ? resta : noticiesFiltrades).map(n => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
        {noticiesFiltrades.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
