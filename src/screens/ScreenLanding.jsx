import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, Pill, DuoButton, CatIcon } from '../components/Shared';

export default function ScreenLanding() {
  const navigate = useNavigate();
  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
        <InfoPolWordmark height={18} />
        <button onClick={() => navigate('/onboarding')} style={{
          background: T.ink, color: '#fff', border: 'none',
          padding: '8px 16px', borderRadius: 999,
          fontFamily: T.font, fontWeight: 700, fontSize: 12,
          letterSpacing: 0.4, textTransform: 'uppercase',
        }}>Entrar</button>
      </div>

      {/* hero */}
      <div style={{ padding: '20px 18px 16px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: T.cat.academia.solid, marginBottom: 10 }}>
          Per la teva feina · Per la teva oposició
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 36, lineHeight: 1.02, letterSpacing: -1.4, color: T.ink, margin: 0 }}>
          La policia<br/>al teu <span style={{ color: T.cat.academia.solid }}>butxaca</span>.
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 14, lineHeight: 1.55, color: T.inkSoft, marginTop: 14, marginBottom: 18 }}>
          Cerca infraccions, consulta articles i segueix protocols pas a pas. O prepara la teva oposició a Mossos amb tests reals i estadístiques.
        </p>
        <DuoButton color="academia" full leftIcon="bolt" onClick={() => navigate('/onboarding')}>Comença gratis</DuoButton>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.font, fontSize: 12, color: T.inkMuted }}>
          <div style={{ display: 'flex' }}>
            {['#FF7A1A', '#3B6BF5', '#1FB286', '#9C4FE0'].map((c, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: c, border: '2px solid ' + T.bg, marginLeft: i === 0 ? 0 : -8 }} />
            ))}
          </div>
          <span><b style={{ color: T.ink }}>+12.400</b> agents i opositors</span>
        </div>
      </div>

      {/* dual modes */}
      <div style={{ padding: '6px 18px 0' }}>
        <div style={{ background: T.cat.operativa.solid, borderRadius: T.r.xl, padding: 18, color: '#fff', position: 'relative', overflow: 'hidden', marginBottom: 12, cursor: 'pointer' }}
          onClick={() => navigate('/onboarding')}>
          <div style={{ position: 'absolute', right: -28, top: -28, width: 130, height: 130, borderRadius: 200, background: 'rgba(255,255,255,0.12)' }} />
          <Pill bg="rgba(255,255,255,0.18)" fg="#fff">Mode operativa</Pill>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, marginTop: 10 }}>Per al policia<br/>en actiu.</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8, lineHeight: 1.4 }}>Cercador d'infraccions, articles, protocols pas a pas, mapa d'incidències.</div>
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Tràfic', 'CP', 'Seguretat ciutadana', 'Estrangeria'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ background: T.cat.academia.solid, borderRadius: T.r.xl, padding: 18, color: '#fff', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => navigate('/onboarding')}>
          <div style={{ position: 'absolute', right: -28, top: -28, width: 130, height: 130, borderRadius: 200, background: 'rgba(255,255,255,0.12)' }} />
          <Pill bg="rgba(255,255,255,0.18)" fg="#fff">Mode acadèmia</Pill>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, marginTop: 10 }}>Prepara't els<br/>Mossos.</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8, lineHeight: 1.4 }}>Tests oficials, simulacres, flashcards i un pla diari adaptat.</div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>Ratxa actual</div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="flame" size={20} color="#fff" /> 23 dies
              </div>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}>
              <Icon name="trophy" size={34} color="#fff" />
            </div>
          </div>
        </div>
      </div>

      {/* features grid */}
      <div style={{ padding: '24px 18px 8px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 12 }}>Tot el que necessites</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { c: 'leyes', i: 'scale', t: 'Lleis', d: 'CP, LECrim, FCS, LSV…' },
            { c: 'transito', i: 'car', t: 'Infraccions', d: 'LSV, RGC, RGV…' },
            { c: 'operativa', i: 'route', t: 'Protocols', d: 'Pas a pas en ruta' },
            { c: 'tests', i: 'graduation', t: 'Tests Mossos', d: '17 temes oficials' },
          ].map(x => (
            <div key={x.t} style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, borderTop: `3px solid ${T.cat[x.c].solid}`, boxShadow: T.shadow.card }}>
              <CatIcon cat={x.c} icon={x.i} size={36} rounded={10} />
              <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: T.cat[x.c].ink, marginTop: 10 }}>{x.t}</div>
              <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* testimonial */}
      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 16, boxShadow: T.shadow.card, borderLeft: `3px solid ${T.cat.academia.solid}` }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={14} color={T.cat.psico.solid} />)}
          </div>
          <div style={{ fontSize: 14, color: T.ink, lineHeight: 1.5, fontWeight: 500, fontStyle: 'italic' }}>
            "Vaig aprovar a la primera. Els tests són idèntics als reals i el pla diari et manté constant."
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: T.inkMuted }}>
            <b style={{ color: T.ink }}>Marta C.</b> · Mossos d'Esquadra promo 2025
          </div>
        </div>
      </div>

      {/* pricing */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ background: T.ink, borderRadius: T.r.xl, padding: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 200, background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>InfoPol Premium</div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6 }}>7,99 € <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>/mes</span></div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 8, lineHeight: 1.5 }}>Accés complet a tots els mòduls: operativa, acadèmia, protocols i mapa d'incidències.</div>
          <div style={{ marginTop: 16 }}>
            <DuoButton color="academia" full onClick={() => navigate('/onboarding')}>Prova 7 dies gratis</DuoButton>
          </div>
        </div>
      </div>
    </div>
  );
}
