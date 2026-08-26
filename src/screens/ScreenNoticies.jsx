import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, NavHeader } from '../components/Shared';
import { NOTICIES } from '../data/news';

const SCOPES = ['Totes', 'Catalunya', 'Espanya', 'Internacional'];

function ScopeChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer', flexShrink: 0,
      padding: '8px 14px', borderRadius: T.r.pill,
      background: active ? T.cat.operativa.solid : '#fff',
      color: active ? '#fff' : T.inkMuted,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      letterSpacing: 0.3, textTransform: 'uppercase',
      boxShadow: active ? `0 2px 8px ${T.cat.operativa.solid}40` : T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function NoticiaCard({ n }) {
  const k = T.cat[n.cat] || T.cat.operativa;
  return (
    <div
      onClick={() => window.open(n.url, '_blank', 'noopener,noreferrer')}
      style={{
        background: '#fff', borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${k.solid}`, boxShadow: T.shadow.card,
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: k.solid, letterSpacing: 0.6, textTransform: 'uppercase', flex: 1 }}>
          {n.tag}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{n.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
        {n.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
        {n.desc}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: k.solid }}>Llegir notícia completa</span>
        <Icon name="external-link" size={12} color={k.solid} />
      </div>
    </div>
  );
}

export default function ScreenNoticies() {
  const [scope, setScope] = useState('Totes');

  const filtered = scope === 'Totes'
    ? NOTICIES
    : NOTICIES.filter(n => n.scope === scope);

  const today = new Date().toLocaleDateString('ca-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />
      <NavHeader cat="operativa" kicker="InfoPol · Actualitat" title="Notícies del dia" back />

      {/* scope filter */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 16px 16px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {SCOPES.map(s => (
          <ScopeChip key={s} label={s} active={scope === s} onClick={() => setScope(s)} />
        ))}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: '40px 0', fontSize: 14 }}>
            Cap notícia disponible.
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} n={n} />)
        )}
      </div>

      <div style={{
        padding: '20px 16px 0', fontSize: 11,
        color: T.inkFaint, textAlign: 'center', lineHeight: 1.6,
      }}>
        Notícies recopilades el {today}<br />
        Fes clic a cada notícia per llegir-la al mitjà original.
      </div>
    </div>
  );
}
