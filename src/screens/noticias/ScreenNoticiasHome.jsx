import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, Pill, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS, CATS_NOTICIAS } from '../../data/noticias';

const CAT_COLORS = {
  política:      { solid: '#3B6BF5', soft: '#D8E2FE', ink: '#0E2B7A' },
  economia:      { solid: '#E89421', soft: '#FBE7C2', ink: '#6B3F08' },
  internacional: { solid: '#9C4FE0', soft: '#EBDAFB', ink: '#4A1B7A' },
  esports:       { solid: '#1FB286', soft: '#CDF0E1', ink: '#0B5A3D' },
  policial:      { solid: '#D63B3B', soft: '#FBDADA', ink: '#7A0B0B' },
  cultura:       { solid: '#F0B400', soft: '#FCEFB8', ink: '#5C4400' },
  ciència:       { solid: '#0BB4C2', soft: '#CCEEF1', ink: '#0A4F56' },
};

const ZONA_COLORS = {
  Catalunya:     T.cat.academia.solid,
  Espanya:       T.cat.operativa.solid,
  Internacional: T.cat.transito.solid,
};

function CatChip({ label, active, onClick, cat }) {
  const k = cat ? CAT_COLORS[cat] : null;
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer', borderRadius: T.r.pill,
      padding: '7px 14px',
      background: active ? (k ? k.solid : T.ink) : '#fff',
      color: active ? '#fff' : T.inkMuted,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      letterSpacing: 0.2, whiteSpace: 'nowrap',
      boxShadow: active ? 'none' : T.shadow.card,
      flexShrink: 0,
    }}>{label}</button>
  );
}

function NoticiaCard({ n, onClick }) {
  const k = CAT_COLORS[n.cat] || T.cat.noticias;
  const zonaColor = ZONA_COLORS[n.zona] || T.inkMuted;
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.lg,
      borderLeft: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card, padding: 14,
      cursor: 'pointer',
    }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          background: k.soft, color: k.ink,
          padding: '3px 8px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 800, fontSize: 10,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>{n.label}</span>
        <span style={{
          background: T.bg, color: T.inkMuted,
          padding: '3px 8px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 700, fontSize: 10,
          letterSpacing: 0.4,
        }}>{n.zona}</span>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10,
          color: T.inkFaint, marginLeft: 'auto',
        }}>{n.data}</span>
      </div>
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800,
        fontSize: 15, letterSpacing: -0.2, color: T.ink,
        lineHeight: 1.3, marginBottom: 6,
      }}>{n.title}</div>
      <div style={{
        fontSize: 12.5, color: T.inkMuted,
        lineHeight: 1.5, marginBottom: 10,
      }}>{n.resum}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: T.inkFaint, fontWeight: 600 }}>
          Font: {n.font}
        </span>
        <a
          href={n.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: k.solid, fontWeight: 700, fontSize: 12,
            textDecoration: 'none',
          }}
        >
          Llegir notícia <Icon name="arrow-right" size={13} color={k.solid} />
        </a>
      </div>
    </div>
  );
}

export default function ScreenNoticiasHome() {
  const navigate = useNavigate();
  const [filtreCat, setFiltreCat] = useState('tots');

  const noticiesFiltrades = filtreCat === 'tots'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === filtreCat);

  const ultimaActualitzacio = NOTICIAS[0]?.data ?? '—';

  return (
    <div className="screen">
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <div style={{ display: 'flex', gap: 8 }}>
          <RoundIconBtn icon="bell" />
          <RoundIconBtn icon="user" onClick={() => navigate('/perfil')} />
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4 }}>
          Actualitzat · {ultimaActualitzacio}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del <span style={{ color: T.cat.noticias.solid }}>dia</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional — política, economia, esports, policial i molt més.
        </p>
      </div>

      {/* Filtres */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 14, scrollbarWidth: 'none' }}>
        {CATS_NOTICIAS.map(c => (
          <CatChip
            key={c.id}
            label={c.label}
            cat={c.id !== 'tots' ? c.id : null}
            active={filtreCat === c.id}
            onClick={() => setFiltreCat(c.id)}
          />
        ))}
      </div>

      {/* Resum de cobertura */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: T.cat.noticias.soft, borderRadius: T.r.md, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="newspaper" size={20} color={T.cat.noticias.solid} />
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.cat.noticias.ink, lineHeight: 1.4 }}>
            <b>{noticiesFiltrades.length} notícies</b> · Catalunya, Espanya i Internacional. Actualitzat cada dia a les 22h.
          </div>
        </div>
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {noticiesFiltrades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          noticiesFiltrades.map(n => (
            <NoticiaCard key={n.id} n={n} onClick={() => {}} />
          ))
        )}
      </div>
    </div>
  );
}
