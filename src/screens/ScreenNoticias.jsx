import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import newsData from '../data/news.json';

const TAG_META = {
  'POLÍTICA':  { color: T.cat.operativa.solid,  soft: T.cat.operativa.soft,  ink: T.cat.operativa.ink,  icon: 'flag' },
  'ECONOMIA':  { color: T.cat.leyes.solid,       soft: T.cat.leyes.soft,      ink: T.cat.leyes.ink,      icon: 'trending-up' },
  'CULTURA':   { color: T.cat.psico.solid,       soft: T.cat.psico.soft,      ink: T.cat.psico.ink,      icon: 'music' },
  'CIÈNCIA':   { color: T.cat.atajos.solid,      soft: T.cat.atajos.soft,     ink: T.cat.atajos.ink,     icon: 'flask' },
  'PREMIS':    { color: T.cat.physical.solid,    soft: T.cat.physical.soft,   ink: T.cat.physical.ink,   icon: 'trophy' },
  'ESPORTS':   { color: T.cat.transito.solid,    soft: T.cat.transito.soft,   ink: T.cat.transito.ink,   icon: 'activity' },
  'SUCCÉS':    { color: T.cat.alcohol.solid,     soft: T.cat.alcohol.soft,    ink: T.cat.alcohol.ink,    icon: 'siren' },
  'NORMATIVA': { color: T.cat.operativa.solid,   soft: T.cat.operativa.soft,  ink: T.cat.operativa.ink,  icon: 'scale' },
};

const FALLBACK_META = { color: T.inkMuted, soft: T.hairline, ink: T.inkSoft, icon: 'newspaper' };

function tagMeta(tag) {
  return TAG_META[tag?.toUpperCase()] || FALLBACK_META;
}

const SCOPE_LABELS = ['Tots', 'Catalunya', 'Espanya', 'Internacional'];
const TAG_LABELS   = ['Tots', 'POLÍTICA', 'ECONOMIA', 'CULTURA', 'CIÈNCIA', 'PREMIS', 'ESPORTS', 'SUCCÉS', 'NORMATIVA'];

function FilterChip({ label, active, onPress, color }) {
  return (
    <button onClick={onPress} style={{
      border: 'none', cursor: 'pointer', borderRadius: T.r.pill,
      padding: '6px 14px', whiteSpace: 'nowrap',
      background: active ? (color || T.cat.operativa.solid) : '#fff',
      color: active ? '#fff' : T.inkMuted,
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
      letterSpacing: 0.3, textTransform: 'uppercase',
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function NewsCard({ item }) {
  const meta = tagMeta(item.tag);
  const hasUrl = item.url && item.url !== 'null';
  const content = (
    <div style={{
      background: '#fff', borderRadius: T.r.md, padding: 14,
      borderLeft: `3px solid ${meta.color}`, boxShadow: T.shadow.card,
      cursor: hasUrl ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          background: meta.soft, color: meta.ink,
          padding: '3px 8px', borderRadius: T.r.pill,
          fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase',
          fontFamily: T.font,
        }}>{item.tag}</span>
        {item.scope && (
          <span style={{ fontSize: 10, color: T.inkMuted, fontWeight: 600 }}>{item.scope}</span>
        )}
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>
          {item.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{item.title}</div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.45 }}>{item.desc}</div>
      {hasUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, color: meta.color, fontWeight: 700, fontSize: 11 }}>
          Llegir notícia <Icon name="arrow-right" size={12} color={meta.color} />
        </div>
      )}
    </div>
  );
  if (hasUrl) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </a>
    );
  }
  return content;
}

function groupByDate(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

function formatDateHeader(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (dateStr === todayStr) return 'Avui';
  if (dateStr === yesterdayStr) return 'Ahir';
  return d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [scope, setScope] = useState('Tots');
  const [tag, setTag] = useState('Tots');

  const all = newsData;

  const filtered = all.filter(n =>
    (scope === 'Tots' || n.scope === scope) &&
    (tag === 'Tots' || n.tag?.toUpperCase() === tag)
  );

  const grouped = groupByDate(filtered);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
      </div>

      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          InfoPol · Actualitat
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies
        </h1>
      </div>

      {/* Scope filter */}
      <div style={{ paddingLeft: 16, marginBottom: 8, overflowX: 'auto', display: 'flex', gap: 8, paddingRight: 16, scrollbarWidth: 'none' }}>
        {SCOPE_LABELS.map(s => (
          <FilterChip key={s} label={s} active={scope === s} onPress={() => setScope(s)} />
        ))}
      </div>

      {/* Tag filter */}
      <div style={{ paddingLeft: 16, marginBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, paddingRight: 16, scrollbarWidth: 'none' }}>
        {TAG_LABELS.map(t => {
          const meta = tagMeta(t);
          return (
            <FilterChip key={t} label={t} active={tag === t} onPress={() => setTag(t)} color={meta.color} />
          );
        })}
      </div>

      {/* News grouped by date */}
      {grouped.length === 0 ? (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: T.inkMuted, fontSize: 14 }}>
          No hi ha notícies per a aquest filtre.
        </div>
      ) : (
        grouped.map(([date, items]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 12, letterSpacing: 0.4, textTransform: 'capitalize', color: T.ink }}>
                {formatDateHeader(date)}
              </span>
              <div style={{ flex: 1, height: 1, background: T.hairline }} />
              <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint }}>{date}</span>
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
