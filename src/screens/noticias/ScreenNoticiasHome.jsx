import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, Pill, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS, CATS_NOTICIA } from '../../data/noticias';

const ZONES = ['Totes', 'Catalunya', 'Espanya', 'Internacional', 'Esports'];

const ZONE_COLOR = {
  Catalunya: T.cat.operativa,
  Espanya:   T.cat.leyes,
  Internacional: T.cat.academia,
  Esports:   T.cat.atajos,
};

function NoticiaCard({ n, onPress }) {
  const cat = CATS_NOTICIA[n.cat] || CATS_NOTICIA.politica;
  const zc = ZONE_COLOR[n.zona] || T.cat.operativa;
  return (
    <div
      onClick={onPress}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${cat.color}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{
          fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase',
          background: cat.bg, color: cat.ink, padding: '3px 7px', borderRadius: 999,
        }}>{cat.label}</span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          color: zc.solid,
        }}>{n.zona}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 9.5, color: T.inkMuted, marginLeft: 'auto' }}>{n.data}</span>
      </div>
      <div style={{ fontWeight: 800, fontSize: 13.5, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>{n.titol}</div>
      <div style={{ fontSize: 11.5, color: T.inkSoft, lineHeight: 1.45 }}>{n.resum}</div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: cat.color, fontSize: 11.5, fontWeight: 700 }}>
        Llegir notícia completa <Icon name="arrow-right" size={13} color={cat.color} />
      </div>
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        fontFamily: T.font,
        cursor: 'pointer',
        background: active ? color : T.hairline,
        color: active ? '#fff' : T.inkMuted,
        transition: 'background 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >{label}</button>
  );
}

export default function ScreenNoticiasHome() {
  const navigate = useNavigate();
  const [zona, setZona] = useState('Totes');

  const filtered = zona === 'Totes' ? NOTICIAS : NOTICIAS.filter(n => n.zona === zona);

  const avui = new Intl.DateTimeFormat('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const avuiMaj = avui.charAt(0).toUpperCase() + avui.slice(1);

  const zoneActiveColor = zona === 'Totes'
    ? T.cat.operativa.solid
    : (ZONE_COLOR[zona]?.solid || T.cat.operativa.solid);

  return (
    <div className="screen">
      <StatusBar />

      {/* header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="user" onClick={() => navigate('/perfil')} />
      </div>

      {/* títol */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: zoneActiveColor, marginBottom: 4 }}>
          Actualitat · {avuiMaj}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del <span style={{ color: zoneActiveColor }}>dia</span>.
        </h1>
      </div>

      {/* destacat Diada */}
      {zona === 'Totes' && (
        <div style={{ padding: '0 16px 14px' }}>
          <div
            onClick={() => window.open(NOTICIAS[0].link, '_blank')}
            style={{
              background: T.cat.operativa.solid,
              borderRadius: T.r.lg,
              padding: 18,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: 200, background: 'rgba(255,255,255,0.1)' }} />
            <Pill bg="rgba(255,255,255,0.18)" fg="#fff">★ Destacat · Diada 11-S</Pill>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 19, marginTop: 10, letterSpacing: -0.3, lineHeight: 1.2 }}>
              45.000 persones a la manifestació independentista de la Diada
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.88, marginTop: 8, lineHeight: 1.45 }}>
              La marxa de l'ANC i Òmnium supera la del 2025 però no arriba a les xifres del 2024. Incidents a Via Laietana.
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}>
              Llegir notícia completa <Icon name="arrow-right" size={14} color="#fff" />
            </div>
          </div>
        </div>
      )}

      {/* filtres zona */}
      <div style={{ padding: '0 16px 12px', overflowX: 'auto', display: 'flex', gap: 6, WebkitOverflowScrolling: 'touch' }}>
        {ZONES.map(z => (
          <FilterChip
            key={z}
            label={z}
            active={zona === z}
            color={z === 'Totes' ? T.cat.operativa.solid : (ZONE_COLOR[z]?.solid || T.cat.operativa.solid)}
            onClick={() => setZona(z)}
          />
        ))}
      </div>

      {/* llista noticias */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 32 }}>
        <SectionHead
          kicker={zona === 'Totes' ? 'Totes les zones' : zona}
          kickerColor={zoneActiveColor}
          title={`${filtered.length} notícia${filtered.length !== 1 ? 'es' : ''} avui`}
        />
        {filtered.map(n => (
          <NoticiaCard
            key={n.id}
            n={n}
            onPress={() => window.open(n.link, '_blank')}
          />
        ))}
        <div style={{ textAlign: 'center', fontSize: 11, color: T.inkFaint, paddingTop: 8 }}>
          Actualitzat el {avuiMaj} a les 22:00 h
        </div>
      </div>
    </div>
  );
}
