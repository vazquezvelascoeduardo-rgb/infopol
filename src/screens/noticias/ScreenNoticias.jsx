import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar } from '../../components/Shared';
import { NOTICIAS, CAT_LABELS } from '../../data/noticias';

const CAT_ORDER = ['totes', 'política', 'economia', 'internacional', 'esports', 'policial', 'ciència'];

const NEWS_COLOR = T.cat.physical;

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Capçalera */}
      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <InfoPolWordmark height={18} />
        <div style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10.5, color: T.inkMuted, letterSpacing: 0.4 }}>
          25 set. 2026
        </div>
      </div>

      {/* Títol secció */}
      <div style={{ padding: '12px 16px 4px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: NEWS_COLOR.ink, marginBottom: 4 }}>
          Actualitat diària
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies <span style={{ color: NEWS_COLOR.solid }}>d'avui</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 4, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Filtre de categories */}
      <div style={{ padding: '10px 0 12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {CAT_ORDER.map(c => {
            const isActive = activeCat === c;
            const colKey = c !== 'totes' ? (() => {
              const map = { política: 'leyes', economia: 'atajos', internacional: 'operativa', esports: 'psico', policial: 'alcohol', ciència: 'transito' };
              return map[c];
            })() : null;
            const col = colKey ? T.cat[colKey] : null;
            return (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: isActive ? (col ? col.solid : T.ink) : '#fff',
                  color: isActive ? '#fff' : T.inkSoft,
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  boxShadow: T.shadow.card,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {c === 'totes' ? 'Totes' : CAT_LABELS[c]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Llistat de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(n => {
          const col = T.cat[n.catKey];
          return (
            <div key={n.id} style={{
              background: '#fff', borderRadius: T.r.md, padding: 14,
              borderLeft: `3px solid ${col.solid}`, boxShadow: T.shadow.card,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{
                  background: col.soft, color: col.ink,
                  fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 999,
                }}>
                  {CAT_LABELS[n.cat] || n.cat}
                </span>
                <span style={{ fontSize: 10.5, color: T.inkMuted, fontWeight: 600 }}>{n.area}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>{n.title}</div>
              <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5, marginBottom: 10 }}>{n.summary}</div>
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  color: col.solid, fontWeight: 700, fontSize: 12,
                  textDecoration: 'none',
                }}
              >
                Llegir notícia complet <Icon name="arrow-right" size={13} color={col.solid} />
              </a>
            </div>
          );
        })}
      </div>

      {/* Footer informatiu */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Resum diari generat automàticament a les 22:00h.<br />
          Fes clic a cada notícia per llegir la informació completa.
        </div>
      </div>
    </div>
  );
}
