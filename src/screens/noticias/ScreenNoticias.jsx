import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import { StatusBar, InfoPolWordmark, SectionHead, RoundIconBtn } from '../../components/Shared';

const CATEGORIES = [
  { id: 'tot', label: 'Tot' },
  { id: 'política', label: 'Política' },
  { id: 'economia', label: 'Economia' },
  { id: 'esports', label: 'Esports' },
  { id: 'policial', label: 'Policial' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'descobriments', label: 'Descobriments' },
  { id: 'premis', label: 'Premis' },
];

const TAG_COLORS = {
  'política':      { bg: T.cat.operativa.soft, fg: T.cat.operativa.ink },
  'economia':      { bg: T.cat.leyes.soft,     fg: T.cat.leyes.ink },
  'esports':       { bg: T.cat.atajos.soft,    fg: T.cat.atajos.ink },
  'policial':      { bg: T.cat.alcohol.soft,   fg: T.cat.alcohol.ink },
  'cultura':       { bg: T.cat.transito.soft,  fg: T.cat.transito.ink },
  'internacional': { bg: T.cat.physical.soft,  fg: T.cat.physical.ink },
  'descobriments': { bg: T.cat.psico.soft,     fg: T.cat.psico.ink },
  'premis':        { bg: T.cat.academia.soft,  fg: T.cat.academia.ink },
};

function tagColor(tag) {
  const key = Object.keys(TAG_COLORS).find(k => tag.toLowerCase().includes(k));
  return TAG_COLORS[key] || { bg: T.cat.noticias.soft, fg: T.cat.noticias.ink };
}

function NewsCard({ item }) {
  const col = tagColor(item.tag);
  const handleClick = () => {
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${T.cat.noticias.solid}`,
        boxShadow: T.shadow.card,
        cursor: item.url ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 9.5,
          fontWeight: 800,
          color: col.fg,
          background: col.bg,
          padding: '3px 7px',
          borderRadius: T.r.pill,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          fontFamily: T.font,
        }}>
          {item.tag}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {item.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{item.title}</div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.4 }}>{item.desc}</div>
      {item.url && (
        <div style={{ fontSize: 11, color: T.cat.noticias.solid, marginTop: 6, fontWeight: 700 }}>
          Llegir notícia →
        </div>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('tot');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/general-news')
      .then(r => r.json())
      .then(data => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'tot'
    ? news
    : news.filter(n => n.tag.toLowerCase().includes(filter));

  return (
    <div className="screen">
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4 }}>
          Actualitat · Catalunya · Espanya · Món
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies
        </h1>
      </div>

      {/* Category filter chips */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                padding: '7px 14px',
                borderRadius: T.r.pill,
                border: 'none',
                cursor: 'pointer',
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 12,
                background: filter === cat.id ? T.cat.noticias.solid : '#fff',
                color: filter === cat.id ? '#fff' : T.inkSoft,
                boxShadow: T.shadow.card,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: 40, fontSize: 13 }}>
            Carregant notícies…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: 40, fontSize: 13 }}>
            Encara no hi ha notícies. Es publicaran cada dia a les 22h.
          </div>
        )}
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
