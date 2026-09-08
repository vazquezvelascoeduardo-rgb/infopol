import { useState } from 'react';
import { T } from '../tokens';
import { StatusBar, InfoPolWordmark, Pill, SectionHead } from '../components/Shared';
import Icon from '../components/Icon';
import { NEWS, NEWS_CATEGORIES } from '../data/news';

const SCOPE_LABELS = {
  tots:         'Totes',
  catalunya:    'Catalunya',
  espanya:      'Espanya',
  internacional:'Internacional',
};

const SCOPE_KEYS = Object.keys(SCOPE_LABELS);

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function ScopeChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: T.r.pill,
      border: `1.5px solid ${active ? T.cat.operativa.solid : T.hairlineStrong}`,
      background: active ? T.cat.operativa.solid : T.card,
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      letterSpacing: 0.2, cursor: 'pointer', flexShrink: 0,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function CatChip({ catKey, active, onClick }) {
  const cat = NEWS_CATEGORIES[catKey];
  const k = T.cat[cat.color];
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: T.r.pill,
      border: `1.5px solid ${active ? k.solid : T.hairlineStrong}`,
      background: active ? k.soft : T.card,
      color: active ? k.ink : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 11,
      letterSpacing: 0.2, cursor: 'pointer', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 5,
      transition: 'all 0.15s',
    }}>
      <Icon name={cat.icon} size={12} color={active ? k.solid : T.inkMuted} strokeWidth={2.4} />
      {cat.label}
    </button>
  );
}

function NewsCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const cat = NEWS_CATEGORIES[item.category];
  const k = T.cat[cat.color];
  const scopeLabel = { catalunya: 'Catalunya', espanya: 'Espanya', internacional: 'Internacional' }[item.scope];

  return (
    <div style={{
      background: T.card, borderRadius: T.r.lg,
      boxShadow: T.shadow.card,
      borderLeft: `3px solid ${k.solid}`,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ padding: '14px 16px', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <Pill bg={k.soft} fg={k.ink} size={10}>
            <Icon name={cat.icon} size={10} color={k.solid} strokeWidth={2.6} />
            {cat.label}
          </Pill>
          <Pill bg={T.bg} fg={T.inkMuted} size={10}>{scopeLabel}</Pill>
          <span style={{
            marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10,
            color: T.inkFaint, letterSpacing: 0.2,
          }}>{formatDate(item.date)}</span>
        </div>

        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 15, lineHeight: 1.3, letterSpacing: -0.2,
          color: T.ink, marginBottom: expanded ? 10 : 0,
        }}>{item.title}</div>

        {expanded && (
          <p style={{
            fontFamily: T.font, fontSize: 13, lineHeight: 1.6,
            color: T.inkSoft, margin: 0,
          }}>{item.summary}</p>
        )}
      </div>

      {expanded && (
        <div style={{
          padding: '0 16px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: T.r.pill,
              background: k.solid, color: '#fff',
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              letterSpacing: 0.3, textDecoration: 'none',
              boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
            }}
          >
            <Icon name="external-link" size={12} color="#fff" strokeWidth={2.6} />
            Llegir notícia
          </a>
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.inkFaint }}>{item.source}</span>
        </div>
      )}
    </div>
  );
}

function groupByDate(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function ScreenNoticias() {
  const [scope, setScope] = useState('tots');
  const [activeCat, setActiveCat] = useState(null);

  const filtered = NEWS.filter(n => {
    const scopeOk = scope === 'tots' || n.scope === scope;
    const catOk = !activeCat || n.category === activeCat;
    return scopeOk && catOk;
  });

  const groups = groupByDate(filtered);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{
        padding: '4px 18px 14px',
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <InfoPolWordmark height={16} />
          <div style={{
            background: T.cat.operativa.soft, color: T.cat.operativa.ink,
            fontFamily: T.font, fontWeight: 800, fontSize: 10,
            letterSpacing: 1, textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: T.r.pill,
          }}>Notícies</div>
        </div>

        {/* scope filter */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }}>
          {SCOPE_KEYS.map(k => (
            <ScopeChip
              key={k}
              label={SCOPE_LABELS[k]}
              active={scope === k}
              onClick={() => setScope(k)}
            />
          ))}
        </div>
      </div>

      {/* category chips */}
      <div style={{ padding: '12px 18px 4px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          <button
            onClick={() => setActiveCat(null)}
            style={{
              padding: '6px 12px', borderRadius: T.r.pill,
              border: `1.5px solid ${!activeCat ? T.ink : T.hairlineStrong}`,
              background: !activeCat ? T.ink : T.card,
              color: !activeCat ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontWeight: 700, fontSize: 11,
              cursor: 'pointer', flexShrink: 0,
            }}
          >Totes</button>
          {Object.keys(NEWS_CATEGORIES).map(k => (
            <CatChip
              key={k}
              catKey={k}
              active={activeCat === k}
              onClick={() => setActiveCat(activeCat === k ? null : k)}
            />
          ))}
        </div>
      </div>

      {/* news list */}
      <div style={{ padding: '8px 18px 0' }}>
        {groups.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: T.inkMuted, fontFamily: T.font, fontSize: 14,
          }}>
            <Icon name="newspaper" size={40} color={T.inkFaint} />
            <div style={{ marginTop: 12 }}>Sense notícies per a aquest filtre</div>
          </div>
        )}

        {groups.map(([date, items]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <SectionHead
              kicker="Actualitat"
              kickerColor={T.cat.operativa.solid}
              title={formatDate(date)}
              style={{ padding: '0 0 12px' }}
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
