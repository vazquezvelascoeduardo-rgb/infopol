import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import { StatusBar, SectionHead } from '../../components/Shared';
import Icon from '../../components/Icon';

const CAT_MAP = {
  politica:     { token: 'leyes',    label: 'Política' },
  economia:     { token: 'academia', label: 'Economia' },
  cultura:      { token: 'psico',    label: 'Cultura' },
  internacional:{ token: 'transito', label: 'Internacional' },
  esports:      { token: 'atajos',   label: 'Esports' },
  policial:     { token: 'operativa',label: 'Policial' },
};

const SCOPE_MAP = {
  catalunya:    { label: 'Catalunya',    token: 'leyes' },
  espanya:      { label: 'Espanya',      token: 'physical' },
  internacional:{ label: 'Internacional',token: 'transito' },
};

const ALL_CATS = ['tot', ...Object.keys(CAT_MAP)];
const ALL_SCOPES = ['tot', 'catalunya', 'espanya', 'internacional'];

function NewsCard({ item }) {
  const catConf = CAT_MAP[item.cat] || { token: 'operativa', label: item.cat };
  const k = T.cat[catConf.token];
  const scopeConf = SCOPE_MAP[item.scope] || { label: item.scope, token: 'operativa' };
  const sk = T.cat[scopeConf.token];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: k.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {item.tag}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 800, color: sk.ink,
          background: sk.soft, padding: '2px 6px', borderRadius: T.r.pill,
          letterSpacing: 0.4, textTransform: 'uppercase', marginLeft: 2,
        }}>
          {scopeConf.label}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {item.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.45 }}>
        {item.desc}
      </div>
      {item.url && (
        <button
          onClick={() => window.open(item.url, '_blank')}
          style={{
            marginTop: 10, background: 'none', border: 'none', padding: 0,
            color: k.solid, fontWeight: 700, fontSize: 11.5, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4, fontFamily: T.font,
          }}
        >
          Llegir notícia <Icon name="arrow-right" size={13} color={k.solid} />
        </button>
      )}
    </div>
  );
}

function FilterChip({ label, active, color, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        flexShrink: 0,
        padding: '7px 14px',
        borderRadius: T.r.pill,
        border: 'none',
        background: active ? color.solid : '#fff',
        color: active ? '#fff' : T.inkMuted,
        fontFamily: T.font,
        fontWeight: 700,
        fontSize: 12,
        cursor: 'pointer',
        boxShadow: active ? 'none' : T.shadow.card,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [activeCat, setActiveCat] = useState('tot');
  const [activeScope, setActiveScope] = useState('tot');

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(setNews)
      .catch(() => {});
  }, []);

  const filtered = news.filter(n => {
    const catOk = activeCat === 'tot' || n.cat === activeCat;
    const scopeOk = activeScope === 'tot' || n.scope === activeScope;
    return catOk && scopeOk;
  });

  const accentColor = T.cat.operativa;

  return (
    <div className="screen">
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}
        >
          <Icon name="chevron-left" size={22} color={T.ink} />
        </button>
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: accentColor.solid }}>
            InfoPol · Actualitat
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, margin: 0 }}>
            Notícies
          </h1>
        </div>
      </div>

      {/* Scope filter */}
      <div style={{ overflowX: 'auto', padding: '2px 16px 10px', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {ALL_SCOPES.map(s => {
          const conf = s === 'tot'
            ? { label: 'Tot', token: 'operativa' }
            : SCOPE_MAP[s] || { label: s, token: 'operativa' };
          const color = T.cat[conf.token] || accentColor;
          return (
            <FilterChip
              key={s}
              label={s === 'tot' ? 'Tot' : conf.label}
              active={activeScope === s}
              color={color}
              onPress={() => setActiveScope(s)}
            />
          );
        })}
      </div>

      {/* Category filter */}
      <div style={{ overflowX: 'auto', padding: '0 16px 12px', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {ALL_CATS.map(c => {
          const conf = c === 'tot'
            ? { label: 'Totes', token: 'operativa' }
            : CAT_MAP[c] || { label: c, token: 'operativa' };
          const color = T.cat[conf.token] || accentColor;
          return (
            <FilterChip
              key={c}
              label={c === 'tot' ? 'Totes' : conf.label}
              active={activeCat === c}
              color={color}
              onPress={() => setActiveCat(c)}
            />
          );
        })}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 13 }}>
            Cap notícia per als filtres seleccionats.
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} item={n} />)
        )}
      </div>
    </div>
  );
}
