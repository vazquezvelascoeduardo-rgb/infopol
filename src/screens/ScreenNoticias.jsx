import { useState } from 'react';
import { T } from '../tokens';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import { NEWS, CAT_LABELS } from '../data/news.js';

const CATS = ['tot', ...Object.keys(CAT_LABELS)];

function CatFilter({ active, onChange }) {
  return (
    <div style={{ overflowX: 'auto', padding: '0 16px 10px', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
      {CATS.map(c => {
        const sel = active === c;
        const color = c === 'tot' ? T.ink : CAT_LABELS[c]?.color ?? T.ink;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              flexShrink: 0, whiteSpace: 'nowrap',
              padding: '6px 14px', borderRadius: 999, border: 'none',
              fontFamily: T.font, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.3, cursor: 'pointer',
              background: sel ? color : '#fff',
              color: sel ? '#fff' : T.inkMuted,
              boxShadow: sel ? `0 2px 10px ${color}44` : T.shadow.card,
              transition: 'all 0.15s',
            }}
          >
            {c === 'tot' ? 'Tot' : CAT_LABELS[c].label}
          </button>
        );
      })}
    </div>
  );
}

function NewsCard({ item }) {
  const catInfo = CAT_LABELS[item.cat] ?? { label: item.cat, color: T.inkMuted };
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff', borderRadius: T.r.md,
        padding: 14, borderLeft: `3px solid ${catInfo.color}`,
        boxShadow: T.shadow.card, cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase',
            color: catInfo.color, background: catInfo.color + '18',
            padding: '3px 8px', borderRadius: 999,
          }}>{catInfo.label}</span>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            color: T.inkFaint, background: T.hairline,
            padding: '3px 8px', borderRadius: 999,
          }}>{item.tag}</span>
          <span style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>
            {item.date}
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
          {item.desc}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: catInfo.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
          Llegir notícia completa →
        </div>
      </div>
    </a>
  );
}

function groupByDate(items) {
  const map = {};
  for (const item of items) {
    if (!map[item.isoDate]) map[item.isoDate] = [];
    map[item.isoDate].push(item);
  }
  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
}

function formatDateHeader(isoDate) {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('tot');

  const filtered = activeCat === 'tot' ? NEWS : NEWS.filter(n => n.cat === activeCat);
  const grouped = groupByDate(filtered);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
      </div>

      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.3,
          textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4,
        }}>Actualitat</div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26,
          letterSpacing: -0.6, margin: 0, color: T.ink,
        }}>Noticias del dia</h1>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 4, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      <CatFilter active={activeCat} onChange={setActiveCat} />

      <div style={{ padding: '0 16px' }}>
        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 13, padding: '40px 0' }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        )}
        {grouped.map(([isoDate, items]) => (
          <div key={isoDate} style={{ marginBottom: 20 }}>
            <SectionHead
              kicker={formatDateHeader(isoDate)}
              kickerColor={T.cat.operativa.solid}
              title=""
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
