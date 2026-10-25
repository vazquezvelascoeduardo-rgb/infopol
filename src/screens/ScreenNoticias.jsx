import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, CAT_NOTICIAS } from '../data/noticias';

const SCOPE_LABELS = ['Tot', 'Catalunya', 'Espanya', 'Internacional'];

const CAT_COLORS = {
  policials:     T.cat.alcohol,
  politica:      T.cat.operativa,
  economia:      T.cat.leyes,
  internacional: T.cat.transito,
  esports:       T.cat.atajos,
  cultura:       T.cat.psico,
  ciencia:       T.cat.physical,
};

function NoticiaCard({ n, onPress }) {
  const k = CAT_COLORS[n.cat] || T.cat.operativa;
  return (
    <div
      onClick={() => onPress(n)}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{
          fontSize: 9.5, fontWeight: 800, color: k.ink,
          letterSpacing: 0.7, textTransform: 'uppercase',
          background: k.soft, padding: '2px 7px', borderRadius: 999,
        }}>
          {n.tag}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {n.date}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
        {n.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
        {n.desc}
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: k.solid }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>Llegir notícia completa</span>
        <Icon name="arrow-right" size={12} color={k.solid} />
      </div>
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer',
      padding: '7px 14px', borderRadius: 999,
      background: active ? color.solid : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      boxShadow: T.shadow.card,
      flexShrink: 0,
      transition: 'background 0.15s, color 0.15s',
    }}>
      {label}
    </button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [scope, setScope] = useState('Tot');

  const filtered = scope === 'Tot'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.scope === scope);

  const lastDate = NOTICIAS[0]?.date || '';

  function handlePress(n) {
    window.open(n.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      {/* Title */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.atajos.solid, marginBottom: 4 }}>
          Actualitzat · {lastDate}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notiícies del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Scope filter */}
      <div style={{ paddingLeft: 16, paddingBottom: 14, display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {SCOPE_LABELS.map(s => (
          <FilterChip
            key={s}
            label={s}
            active={scope === s}
            color={T.cat.atajos}
            onClick={() => setScope(s)}
          />
        ))}
      </div>

      {/* Category legend */}
      <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {Object.entries(CAT_NOTICIAS).map(([key, { label, color }]) => {
          const k = T.cat[color];
          return (
            <span key={key} style={{
              fontSize: 10.5, fontWeight: 700,
              padding: '3px 9px', borderRadius: 999,
              background: k.soft, color: k.ink,
            }}>
              {label}
            </span>
          );
        })}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: '40px 0', fontSize: 14 }}>
            No hi ha notícies per a aquest filtre.
          </div>
        ) : (
          filtered.map(n => (
            <NoticiaCard key={n.id} n={n} onPress={handlePress} />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ margin: '24px 16px 0', padding: 14, background: '#fff', borderRadius: T.r.md, boxShadow: T.shadow.card, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>
          Notícies actualitzades cada dia a les 22h.{'\n'}
          Fes clic a cada notícia per llegir la font original.
        </div>
      </div>
    </div>
  );
}
