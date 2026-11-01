import { useState } from 'react';
import { T } from '../tokens';
import { StatusBar, InfoPolWordmark, SectionHead } from '../components/Shared';
import Icon from '../components/Icon';
import { NOTICIES, CAT_NOTICIES } from '../data/news';

const FILTRES = ['Totes', 'Successos', 'Seguretat', 'Política', 'Esports', 'Economia', 'Internacional', 'Cultura'];
const FILTRE_KEY = { 'Totes': null, 'Successos': 'successos', 'Seguretat': 'seguretat', 'Política': 'politica', 'Esports': 'esports', 'Economia': 'economia', 'Internacional': 'internacional', 'Cultura': 'cultura' };

function CatBadge({ cat }) {
  const info = CAT_NOTICIES[cat] || { label: cat, color: 'operativa' };
  const k = T.cat[info.color];
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7,
      textTransform: 'uppercase', color: k.ink,
      background: k.soft, padding: '3px 8px', borderRadius: 999,
    }}>{info.label}</span>
  );
}

function NewsCard({ item }) {
  const info = CAT_NOTICIES[item.cat] || { color: 'operativa' };
  const k = T.cat[info.color];
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff', borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${k.solid}`, boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <CatBadge cat={item.cat} />
          <span style={{
            fontSize: 10, fontWeight: 700, color: T.inkMuted,
            marginLeft: 'auto', fontFamily: T.fontMono,
          }}>{item.area} · {item.date}</span>
        </div>
        <div style={{
          fontWeight: 800, fontSize: 14, color: T.ink,
          lineHeight: 1.3, letterSpacing: -0.2,
        }}>{item.title}</div>
        <div style={{
          fontSize: 12, color: T.inkSoft, marginTop: 5,
          lineHeight: 1.5,
        }}>{item.desc}</div>
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontSize: 11.5, fontWeight: 700,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [filtre, setFiltre] = useState('Totes');

  const key = FILTRE_KEY[filtre];
  const filtered = key ? NOTICIES.filter(n => n.cat === key) : NOTICIES;

  const dates = [...new Set(filtered.map(n => n.date))];

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
          textTransform: 'uppercase', color: T.inkMuted,
        }}>Actualitzat avui</span>
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26,
          letterSpacing: -0.6, margin: 0,
        }}>
          Actualitat <span style={{ color: T.cat.operativa.solid }}>del dia</span>
        </h1>
        <p style={{ fontSize: 12.5, color: T.inkMuted, margin: '6px 0 0', lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* filtres */}
      <div style={{ padding: '0 0 12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: 8, padding: '0 16px' }}>
          {FILTRES.map(f => {
            const active = f === filtre;
            return (
              <button key={f} onClick={() => setFiltre(f)} style={{
                padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: T.font, fontWeight: 700, fontSize: 12, letterSpacing: 0.2,
                background: active ? T.cat.operativa.solid : '#fff',
                color: active ? '#fff' : T.inkSoft,
                boxShadow: active ? 'none' : T.shadow.card,
                transition: 'all 0.15s',
              }}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* llista de notícies agrupada per data */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {dates.map(date => (
          <div key={date}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
              textTransform: 'uppercase', color: T.inkMuted,
              marginBottom: 10, fontFamily: T.fontMono,
            }}>{date}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.filter(n => n.date === date).map(item => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: T.inkMuted, fontSize: 14,
          }}>No hi ha notícies en aquesta categoria.</div>
        )}
      </div>
    </div>
  );
}
