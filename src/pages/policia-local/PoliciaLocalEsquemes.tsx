// Índex d'Esquemes ràpids de Lleis · Policia Local.
// Categoria pròpia paral·lela a Tests, Flashcards i Temari.
// Agrupa per CATEGORIA_META (CE, Codi Penal, FCS, Trànsit, etc.).
import { useNavigate } from 'react-router-dom';

import { listEsquemasLleis, CATEGORIA_META, type LleiCategoria } from '../../data/esquemas-pl';
import { Mono, V } from '../../lib/v3';

const CATEGORIA_ORDER: LleiCategoria[] = [
  'constitucio', 'eac', 'codi-penal', 'lecrim', 'menors',
  'sc', 'fcs', 'armes', 'transit', 'municipi',
];

export default function PoliciaLocalEsquemes() {
  const nav = useNavigate();
  const esquemas = listEsquemasLleis();

  // Agrupar respectant l'ordre de definició.
  const byCategoria = esquemas.reduce<Record<string, typeof esquemas>>((acc, e) => {
    (acc[e.categoria] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="v3-page v3-anim">
      <Mono size={10} color={V.terraInk} style={{ letterSpacing: 1.8 }}>POLICIA LOCAL</Mono>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
        Esquemes ràpids
      </h1>
      <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0', maxWidth: 580 }}>
        Una llei sencera en cinc minuts: cronologia, articles i fets clau ordenats per època,
        en comptes d&apos;un mur de pics.
      </p>

      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', margin: '20px 0 26px' }}>
        {[
          { valor: String(esquemas.length), label: 'ESQUEMES' },
          { valor: '4', label: 'SECCIONS PER LLEI' },
          { valor: '~5 min', label: 'DE LECTURA' },
        ].map((x) => (
          <div key={x.label}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8 }}>{x.valor}</div>
            <Mono size={9} color={V.faint} style={{ display: 'block', marginTop: 3, letterSpacing: 1.4 }}>
              {x.label}
            </Mono>
          </div>
        ))}
      </div>

      {CATEGORIA_ORDER.map((cat) => {
        const items = byCategoria[cat];
        if (!items || items.length === 0) return null;
        const meta = CATEGORIA_META[cat];
        return (
          <div key={cat} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>
                {meta.emoji} {meta.label}
              </span>
              <span style={{ flex: 1, height: 1, background: V.hair }} />
              <Mono size={10} color={V.muted}>{items.length}</Mono>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
              {items.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => nav(`/policia-local/esquemes/${e.slug}`)}
                  style={{
                    textAlign: 'left', cursor: 'pointer', border: `1px solid ${V.hair}`,
                    borderRadius: 18, padding: 17, background: V.surface, color: V.ink,
                    boxShadow: V.shadow, display: 'flex', flexDirection: 'column', gap: 9,
                    borderTop: `3px solid ${meta.color}`,
                  }}>
                  <Mono size={9.5} color={meta.color} style={{ letterSpacing: 1.5 }}>
                    {e.kicker.toUpperCase()}
                  </Mono>
                  <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>
                    {e.title}
                    {e.titleHighlight && <span style={{ color: meta.color }}> {e.titleHighlight}</span>}
                  </span>
                  <span style={{ fontSize: 13, color: V.muted, lineHeight: 1.45 }}>
                    {e.introOneLiner.length > 140 ? `${e.introOneLiner.slice(0, 137)}…` : e.introOneLiner}
                  </span>
                  {e.kpis.length > 0 && (
                    <span style={{
                      display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 10,
                      borderTop: `1px solid ${V.hair}`, marginTop: 'auto',
                    }}>
                      {e.kpis.slice(0, 4).map((k, i) => (
                        <span key={i} style={{ fontSize: 11.5, fontWeight: 600, color: V.muted }}>
                          <b style={{ color: V.ink }}>{k.value}</b> {k.label}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <p style={{ marginTop: 8, fontSize: 13, color: V.faint, textAlign: 'center', lineHeight: 1.55 }}>
        Anirem afegint més lleis; prioritzem les que cauen sempre. Si en vols una de concreta,
        escriu a{' '}
        <a href="mailto:info@infopol.app" style={{ color: V.terraInk, fontWeight: 700 }}>
          info@infopol.app
        </a>
      </p>
    </div>
  );
}
