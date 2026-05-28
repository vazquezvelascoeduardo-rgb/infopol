import { useState, useEffect } from 'react';
import { T } from '../../tokens';
import { StatusBar, NavHeader } from '../../components/Shared';

const GEO_FILTERS = ['Tot', 'Catalunya', 'Espanya', 'Internacional'];

function tagColor(tag) {
  if (!tag) return T.cat.operativa;
  const t = tag.toLowerCase();
  if (t.includes('policial')) return T.cat.operativa;
  if (t.includes('política') || t.includes('politica')) return T.cat.leyes;
  if (t.includes('economia')) return T.cat.psico;
  if (t.includes('esports')) return T.cat.atajos;
  if (t.includes('cultura') || t.includes('premis') || t.includes('ciència') || t.includes('ciencia')) return T.cat.academia;
  return T.cat.physical;
}

function NewsCard({ item }) {
  const k = tagColor(item.tag);
  const canOpen = Boolean(item.url);
  return (
    <div
      onClick={() => canOpen && window.open(item.url, '_blank', 'noopener,noreferrer')}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: canOpen ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{
          fontSize: 9.5,
          fontFamily: T.font,
          fontWeight: 800,
          color: k.ink,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          background: k.soft,
          padding: '2px 8px',
          borderRadius: 6,
          flexShrink: 0,
        }}>{item.tag}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto', flexShrink: 0 }}>{item.dateLabel}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{item.title}</div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{item.desc}</div>
      {canOpen && (
        <div style={{ marginTop: 7, color: k.solid, fontSize: 11, fontWeight: 700 }}>
          Llegir article complet →
        </div>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('Tot');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'Tot' ? news : news.filter(n => n.geo === filter);

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat="operativa" kicker="Actualitat" title="Notícies" back />

      {/* Filtres geogràfics */}
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {GEO_FILTERS.map(g => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: T.r.pill,
              border: 'none',
              fontFamily: T.font,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              background: filter === g ? T.cat.operativa.solid : T.cat.operativa.soft,
              color: filter === g ? '#fff' : T.cat.operativa.ink,
              transition: 'background 0.15s, color 0.15s',
            }}
          >{g}</button>
        ))}
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {loading && (
          <div style={{ color: T.inkMuted, fontSize: 13, padding: '30px 0', textAlign: 'center' }}>
            Carregant notícies…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ color: T.inkMuted, fontSize: 13, padding: '30px 0', textAlign: 'center' }}>
            Cap notícia disponible per a aquesta zona.
          </div>
        )}
        {filtered.map((n, i) => <NewsCard key={n.id || i} item={n} />)}
      </div>
    </div>
  );
}
