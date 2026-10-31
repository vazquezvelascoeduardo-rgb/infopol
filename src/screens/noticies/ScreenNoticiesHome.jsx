import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, CatIcon, Pill } from '../../components/Shared';
import { NOTICIES, CATS_META } from '../../data/noticies';

const FILTER_TABS = [
  { id: 'all',           label: 'Tot' },
  { id: 'policial',      label: 'Policial' },
  { id: 'politica',      label: 'Política' },
  { id: 'economia',      label: 'Economia' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'ciencia',       label: 'Ciència' },
  { id: 'esports',       label: 'Esports' },
];

function NoticiaCard({ n }) {
  const meta = CATS_META[n.cat] || CATS_META.politica;
  const k = T.cat[meta.color];

  return (
    <a
      href={n.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 16,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: k.soft, color: k.ink,
            padding: '3px 8px', borderRadius: T.r.pill,
            fontFamily: T.font, fontWeight: 800, fontSize: 10,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <Icon name={meta.icon} size={10} color={k.ink} strokeWidth={2.4} />
            {meta.label}
          </span>
          <span style={{
            fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto',
          }}>{n.date}</span>
        </div>

        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 14,
          color: T.ink, lineHeight: 1.3, marginBottom: 6,
        }}>{n.title}</div>

        <div style={{
          fontSize: 12, color: T.inkSoft, lineHeight: 1.5, marginBottom: 10,
        }}>{n.desc}</div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontFamily: T.font, fontWeight: 700, fontSize: 12,
        }}>
          Llegir la notícia completa
          <Icon name="external-link" size={12} color={k.solid} strokeWidth={2.2} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticiesHome() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? NOTICIES
    : NOTICIES.filter(n => n.cat === activeTab);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <Pill bg={T.cat.policial?.soft || T.cat.alcohol.soft} fg={T.cat.policial?.ink || T.cat.alcohol.ink}>
          Actualitat
        </Pill>
      </div>

      {/* Title section */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 4,
        }}>
          {dateLabel}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26,
          letterSpacing: -0.6, margin: 0, lineHeight: 1.05,
        }}>
          Noticies<br/>
          <span style={{ color: T.cat.academia.solid }}>d'avui</span>
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 8, marginBottom: 0, lineHeight: 1.5,
        }}>
          Resum de les notícies més destacades de Catalunya, Espanya i el món.
        </p>
      </div>

      {/* Category filter tabs */}
      <div style={{
        padding: '0 16px 14px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {FILTER_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: T.r.pill,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: T.font,
                  fontWeight: 700,
                  fontSize: 12,
                  background: isActive ? T.cat.operativa.solid : '#fff',
                  color: isActive ? '#fff' : T.inkSoft,
                  boxShadow: isActive ? 'none' : T.shadow.card,
                  transition: 'background 0.15s, color 0.15s',
                  flexShrink: 0,
                }}
              >{tab.label}</button>
            );
          })}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: T.r.lg, padding: 32,
            textAlign: 'center', boxShadow: T.shadow.card,
          }}>
            <Icon name="newspaper" size={36} color={T.inkFaint} />
            <div style={{ color: T.inkMuted, fontSize: 14, marginTop: 12 }}>
              No hi ha notícies en aquesta categoria.
            </div>
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} n={n} />)
        )}
      </div>

      {/* Footer note */}
      <div style={{
        padding: '20px 16px 0',
        textAlign: 'center',
        fontFamily: T.font, fontSize: 11, color: T.inkFaint, lineHeight: 1.5,
      }}>
        Resum de notícies generat per InfoPol · {dateLabel}
      </div>
    </div>
  );
}
