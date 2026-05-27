import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NEWS } from '../data/news';

const CAT_META = {
  politica: { label: 'Política',    color: T.cat.operativa.solid, soft: T.cat.operativa.soft, ink: T.cat.operativa.ink, icon: 'building' },
  economia: { label: 'Economia',    color: T.cat.leyes.solid,     soft: T.cat.leyes.soft,     ink: T.cat.leyes.ink,     icon: 'trending-up' },
  policial: { label: 'Policial',    color: T.cat.transito.solid,  soft: T.cat.transito.soft,  ink: T.cat.transito.ink,  icon: 'shield' },
  esports:  { label: 'Esports',     color: T.cat.atajos.solid,    soft: T.cat.atajos.soft,    ink: T.cat.atajos.ink,    icon: 'trophy' },
  cultura:  { label: 'Cultura',     color: T.cat.academia.solid,  soft: T.cat.academia.soft,  ink: T.cat.academia.ink,  icon: 'book' },
  ciencia:  { label: 'Ciència',     color: T.cat.physical.solid,  soft: T.cat.physical.soft,  ink: T.cat.physical.ink,  icon: 'spark' },
  premis:   { label: 'Premis',      color: T.cat.psico.solid,     soft: T.cat.psico.soft,     ink: T.cat.psico.ink,     icon: 'star' },
};

const SCOPE_META = {
  tots:          { label: 'Tot' },
  catalunya:     { label: 'Catalunya' },
  espanya:       { label: 'Espanya' },
  internacional: { label: 'Internacional' },
};

function FilterChip({ label, active, color, softColor, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: T.r.pill, border: 'none', cursor: 'pointer',
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.3,
      whiteSpace: 'nowrap', transition: 'all 0.15s',
      background: active ? (color || T.cat.operativa.solid) : '#fff',
      color: active ? '#fff' : T.inkMuted,
      boxShadow: active ? 'none' : T.shadow.card,
    }}>
      {label}
    </button>
  );
}

function NewsCard({ item }) {
  const meta = CAT_META[item.category] || CAT_META.politica;
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.md,
      padding: 14, borderLeft: `3px solid ${meta.color}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
          color: meta.color,
        }}>{item.tag}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>
          {item.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
        {item.desc}
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8,
            fontSize: 11.5, fontWeight: 700, color: meta.color,
            textDecoration: 'none',
          }}
        >
          Llegir notícia completa <Icon name="arrow-right" size={12} color={meta.color} />
        </a>
      )}
    </div>
  );
}

function ScopePill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 11px', borderRadius: T.r.pill, border: `1px solid ${active ? T.cat.operativa.solid : T.hairline}`,
      background: active ? T.cat.operativa.soft : 'transparent',
      color: active ? T.cat.operativa.ink : T.inkMuted,
      fontFamily: T.font, fontWeight: 700, fontSize: 11, cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('tots');
  const [activeScope, setActiveScope] = useState('tots');

  const latestDate = NEWS.length > 0 ? NEWS[0].date : null;

  const filtered = NEWS.filter(n => {
    const catOk = activeCat === 'tots' || n.category === activeCat;
    const scopeOk = activeScope === 'tots' || n.scope === activeScope;
    return catOk && scopeOk;
  });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
        <InfoPolWordmark height={17} />
      </div>

      {/* title */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Resum diari
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>
          Notícies
        </h1>
        {latestDate && (
          <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 4 }}>
            Actualitzat: {latestDate.split('-').reverse().join('/')}
          </div>
        )}
      </div>

      {/* scope filter */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {Object.entries(SCOPE_META).map(([key, { label }]) => (
            <ScopePill key={key} label={label} active={activeScope === key} onClick={() => setActiveScope(key)} />
          ))}
        </div>
      </div>

      {/* category filter */}
      <div style={{ padding: '10px 0 0' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 4px' }}>
          <FilterChip
            label="Totes"
            active={activeCat === 'tots'}
            color={T.cat.operativa.solid}
            onClick={() => setActiveCat('tots')}
          />
          {Object.entries(CAT_META).map(([key, { label, color }]) => (
            <FilterChip key={key} label={label} active={activeCat === key} color={color} onClick={() => setActiveCat(key)} />
          ))}
        </div>
      </div>

      {/* stats bar */}
      {activeCat === 'tots' && activeScope === 'tots' && (
        <div style={{ padding: '12px 16px 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {Object.entries(CAT_META).map(([key, { label, color, soft, ink }]) => {
            const count = NEWS.filter(n => n.category === key).length;
            if (!count) return null;
            return (
              <div key={key} onClick={() => setActiveCat(key)} style={{
                background: soft, borderRadius: T.r.md, padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0,
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{count}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: ink, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* news list */}
      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies per a aquest filtre.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* footer note */}
      <div style={{ padding: '20px 16px 0', fontSize: 11, color: T.inkFaint, textAlign: 'center', lineHeight: 1.5 }}>
        Actualitzat cada dia a les 22:00 h · Les notícies s'arxiven durant 7 dies
      </div>
    </div>
  );
}
