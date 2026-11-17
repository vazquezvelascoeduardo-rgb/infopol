import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, InfoPolWordmark, Pill } from '../../components/Shared';
import { NOTICIAS, CATEGORIES } from '../../data/noticias';

function NoticiaCard({ noticia }) {
  const cat = CATEGORIES.find(c => c.id === noticia.categoria) || CATEGORIES[1];
  const k = T.cat[cat.color] || T.cat.operativa;

  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: T.card,
        borderRadius: T.r.lg,
        padding: 16,
        marginBottom: 10,
        boxShadow: T.shadow.card,
        borderLeft: `3px solid ${k.solid}`,
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
            <Icon name={cat.icon} size={11} color={k.ink} strokeWidth={2.4} />
            {cat.label}
          </span>
          <span style={{
            fontSize: 10, color: T.inkMuted, fontFamily: T.font, fontWeight: 600,
            marginLeft: 'auto',
          }}>{noticia.ambit}</span>
          <span style={{
            fontSize: 10, color: T.inkFaint, fontFamily: T.font,
          }}>{noticia.data}</span>
        </div>

        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15,
          color: T.ink, lineHeight: 1.3, marginBottom: 8, letterSpacing: -0.2,
        }}>
          {noticia.titular}
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 13, color: T.inkSoft,
          lineHeight: 1.55, marginBottom: 10,
        }}>
          {noticia.resum}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 11, color: T.inkMuted, fontFamily: T.font, fontStyle: 'italic',
          }}>{noticia.font}</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: k.solid, fontFamily: T.font, fontWeight: 700, fontSize: 12,
          }}>
            Llegir <Icon name="arrow-right" size={14} color={k.solid} />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [catActiva, setCatActiva] = useState('tot');

  const noticiesFiltrades = catActiva === 'tot'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.categoria === catActiva);

  const dataActual = NOTICIAS.length > 0 ? NOTICIAS[0].data : '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <InfoPolWordmark height={18} />
          <Pill bg={T.cat.atajos.soft} fg={T.cat.atajos.ink}>
            <Icon name="bell" size={11} color={T.cat.atajos.ink} strokeWidth={2.4} />
            {dataActual}
          </Pill>
        </div>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: T.cat.leyes.solid, marginBottom: 6,
        }}>
          Resum del dia
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -1, color: T.ink, margin: 0, lineHeight: 1.05,
        }}>
          Noticias
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 4, marginBottom: 0,
        }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* filter chips */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px 16px',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {CATEGORIES.map(cat => {
          const activa = catActiva === cat.id;
          const k = T.cat[cat.color];
          return (
            <button
              key={cat.id}
              onClick={() => setCatActiva(cat.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', borderRadius: T.r.pill, border: 'none',
                background: activa ? k.solid : T.card,
                color: activa ? '#fff' : T.inkMuted,
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                letterSpacing: 0.2, whiteSpace: 'nowrap', cursor: 'pointer',
                boxShadow: activa ? T.shadow.pop : T.shadow.card,
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              <Icon
                name={cat.icon}
                size={14}
                color={activa ? '#fff' : T.inkMuted}
                strokeWidth={2.2}
              />
              {cat.label}
              {cat.id !== 'tot' && (
                <span style={{
                  background: activa ? 'rgba(255,255,255,0.25)' : T.bg,
                  color: activa ? '#fff' : T.inkMuted,
                  borderRadius: 999, padding: '1px 6px', fontSize: 10, fontWeight: 800,
                }}>
                  {NOTICIAS.filter(n => n.categoria === cat.id).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* llista de noticias */}
      <div style={{ padding: '0 16px' }}>
        {noticiesFiltrades.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: T.inkMuted, fontFamily: T.font, fontSize: 14,
          }}>
            Sense notícies per a aquesta categoria.
          </div>
        ) : (
          noticiesFiltrades.map(n => <NoticiaCard key={n.id} noticia={n} />)
        )}
      </div>

      {/* peu */}
      <div style={{
        padding: '16px 18px 0', textAlign: 'center',
        fontFamily: T.font, fontSize: 11, color: T.inkFaint, lineHeight: 1.6,
      }}>
        Noticias actualitzades diàriament a les 22h<br />
        Fonts: EFE, Infobae, COPE, CatalunyaPress, El Español
      </div>
    </div>
  );
}
