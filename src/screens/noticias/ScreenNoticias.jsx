import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, CatIcon, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS, CATEGORIES, AMBITS } from '../../data/noticias';

const CAT_ORDER = ['successos', 'politica', 'economia', 'esports', 'internacional', 'ciencia'];

function FilterChip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer', flexShrink: 0,
      padding: '7px 14px', borderRadius: T.r.pill,
      background: active ? color : '#fff',
      color: active ? '#fff' : T.inkMuted,
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
      letterSpacing: 0.2,
      boxShadow: active ? `0 2px 8px ${color}55` : T.shadow.card,
      transition: 'all .15s',
    }}>{label}</button>
  );
}

function NoticiaCard({ noticia }) {
  const navigate = useNavigate();
  const catDef = CATEGORIES[noticia.categoria];
  const k = T.cat[catDef.cat];

  const handleClick = () => {
    window.open(noticia.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={handleClick} style={{
      background: '#fff',
      borderRadius: T.r.lg,
      padding: 16,
      borderLeft: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {/* cap */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: k.soft, color: k.ink,
          padding: '3px 8px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 800, fontSize: 10,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <Icon name={catDef.icon} size={11} color={k.ink} strokeWidth={2.5} />
          {catDef.label}
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 700, color: T.inkFaint,
          padding: '3px 8px', background: T.bg, borderRadius: T.r.pill,
        }}>{noticia.ambit}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {noticia.data}
        </span>
      </div>

      {/* títol */}
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15,
        letterSpacing: -0.3, color: T.ink, lineHeight: 1.25,
      }}>{noticia.titol}</div>

      {/* resum */}
      <div style={{
        fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5,
      }}>{noticia.resum}</div>

      {/* peu */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 2,
      }}>
        <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          Font: {noticia.font}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontWeight: 700, fontSize: 11.5 }}>
          Llegir més <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [catActiva, setCatActiva] = useState('totes');
  const [ambitActiu, setAmbitActiu] = useState('Tots');

  const noticiesFiltrades = NOTICIAS.filter(n => {
    const catOk = catActiva === 'totes' || n.categoria === catActiva;
    const ambitOk = ambitActiu === 'Tots' || n.ambit === ambitActiu;
    return catOk && ambitOk;
  });

  const dataActualitzacio = NOTICIAS.length > 0 ? NOTICIAS[0].data : '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* capçalera */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      {/* títol secció */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.alcohol.solid, marginBottom: 4,
        }}>
          Actualitzat el {dataActualitzacio} · 22:00 h
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, margin: 0, lineHeight: 1.05,
        }}>
          Notícies del <span style={{ color: T.cat.alcohol.solid }}>dia</span>
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 6, lineHeight: 1.5,
        }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* filtre categoria */}
      <div style={{ padding: '0 0 6px' }}>
        <div style={{ overflowX: 'auto', paddingLeft: 16, paddingRight: 16 }}>
          <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingBottom: 4 }}>
            <FilterChip
              label="Totes"
              active={catActiva === 'totes'}
              onClick={() => setCatActiva('totes')}
              color={T.cat.operativa.solid}
            />
            {CAT_ORDER.map(cat => (
              <FilterChip
                key={cat}
                label={CATEGORIES[cat].label}
                active={catActiva === cat}
                onClick={() => setCatActiva(cat)}
                color={T.cat[CATEGORIES[cat].cat].solid}
              />
            ))}
          </div>
        </div>
      </div>

      {/* filtre àmbit */}
      <div style={{ padding: '4px 0 12px' }}>
        <div style={{ overflowX: 'auto', paddingLeft: 16, paddingRight: 16 }}>
          <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingBottom: 4 }}>
            {AMBITS.map(ambit => (
              <button key={ambit} onClick={() => setAmbitActiu(ambit)} style={{
                border: `1.5px solid ${ambitActiu === ambit ? T.ink : T.hairline}`,
                cursor: 'pointer', flexShrink: 0,
                padding: '5px 12px', borderRadius: T.r.pill,
                background: ambitActiu === ambit ? T.ink : 'transparent',
                color: ambitActiu === ambit ? '#fff' : T.inkMuted,
                fontFamily: T.font, fontWeight: 700, fontSize: 11,
                transition: 'all .15s',
              }}>{ambit}</button>
            ))}
          </div>
        </div>
      </div>

      {/* resum estadístic */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
        {CAT_ORDER.map(cat => {
          const count = NOTICIAS.filter(n => n.categoria === cat).length;
          if (count === 0) return null;
          const k = T.cat[CATEGORIES[cat].cat];
          return (
            <button key={cat} onClick={() => setCatActiva(catActiva === cat ? 'totes' : cat)} style={{
              flex: 1, border: 'none', cursor: 'pointer', textAlign: 'center',
              background: catActiva === cat ? k.soft : '#fff',
              borderRadius: T.r.md, padding: '8px 4px',
              boxShadow: T.shadow.card,
              borderTop: `2px solid ${k.solid}`,
              transition: 'background .15s',
            }}>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, color: k.solid }}>{count}</div>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 8.5, letterSpacing: 0.4, textTransform: 'uppercase', color: k.ink, marginTop: 2 }}>
                {CATEGORIES[cat].label}
              </div>
            </button>
          );
        })}
      </div>

      {/* llista notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {noticiesFiltrades.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: T.r.lg, padding: 32,
            textAlign: 'center', boxShadow: T.shadow.card,
          }}>
            <Icon name="search" size={32} color={T.inkFaint} />
            <div style={{ fontWeight: 700, color: T.inkMuted, marginTop: 12, fontSize: 14 }}>
              Cap notícia per a aquest filtre
            </div>
          </div>
        ) : (
          noticiesFiltrades.map(n => <NoticiaCard key={n.id} noticia={n} />)
        )}
      </div>

      {/* peu */}
      <div style={{
        margin: '24px 16px 0',
        background: '#fff', borderRadius: T.r.lg, padding: 16,
        boxShadow: T.shadow.card, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.6 }}>
          Notícies compilades automàticament cada dia a les 22:00 h.<br />
          InfoPol no s'identifica amb el contingut dels mitjans enllaçats.
        </div>
      </div>
    </div>
  );
}
