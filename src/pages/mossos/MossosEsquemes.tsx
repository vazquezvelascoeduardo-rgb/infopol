// Índex d'Esquemes detallats de Mossos (format temari jeràrquic).
// Substitueix el format "esquema ràpid" visual. Llista per àmbit (A/B/C).
import { useNavigate } from 'react-router-dom';

import { listEsquemesDetall } from '../../data/esquemes-mossos-detall';
import { AMBIT_META } from '../../lib/mossosTemari';
import { metaCos } from '../../lib/cos';
import { Mono, V } from '../../lib/v3';

export default function MossosEsquemes() {
  const nav = useNavigate();
  const meta = metaCos('mossos');
  const esquemes = listEsquemesDetall();

  const byAmbit = esquemes.reduce<Record<'A' | 'B' | 'C', typeof esquemes>>(
    (acc, e) => { (acc[e.ambit] ??= []).push(e); return acc; },
    { A: [], B: [], C: [] },
  );

  return (
    <div className="v3-page v3-anim">
      <Mono size={10} color={meta.accentInk} style={{ letterSpacing: 1.8 }}>{meta.kicker}</Mono>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
        Esquemes de temari
      </h1>
      <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0', maxWidth: 580 }}>
        Cada tema resumit: seccions, subapartats i les dades que cauen (lleis, dates, xifres)
        per repassar-lo d&apos;un cop d&apos;ull abans del test.
      </p>

      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', margin: '20px 0 26px' }}>
        {[
          { valor: String(esquemes.length), label: 'ESQUEMES' },
          { valor: '3', label: 'ÀMBITS' },
          { valor: 'A · B · C', label: 'BLOCS' },
        ].map((x) => (
          <div key={x.label}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8 }}>{x.valor}</div>
            <Mono size={9} color={V.faint} style={{ display: 'block', marginTop: 3, letterSpacing: 1.4 }}>
              {x.label}
            </Mono>
          </div>
        ))}
      </div>

      {(['A', 'B', 'C'] as const).map((ambit) => {
        const items = byAmbit[ambit];
        if (!items || items.length === 0) return null;
        const am = AMBIT_META[ambit];
        return (
          <div key={ambit} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
              <span style={{
                width: 26, height: 26, borderRadius: 10, background: meta.accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12.5, fontWeight: 800,
              }}>
                {ambit}
              </span>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>{am.short}</span>
              <span style={{ flex: 1, height: 1, background: V.hair }} />
              <Mono size={10} color={V.muted}>{items.length}</Mono>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
              {items.map((e) => (
                <button
                  key={e.slug}
                  type="button"
                  onClick={() => nav(`/mossos/esquemes/${e.slug}`)}
                  style={{
                    textAlign: 'left', cursor: 'pointer', border: `1px solid ${V.hair}`,
                    borderRadius: 18, padding: 17, background: V.surface, color: V.ink,
                    boxShadow: V.shadow, display: 'flex', gap: 13, alignItems: 'flex-start',
                  }}>
                  <span style={{
                    width: 42, height: 42, flexShrink: 0, borderRadius: 14,
                    background: meta.accentSoft, color: meta.accentInk,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: V.mono, fontSize: 12.5, fontWeight: 800,
                  }}>
                    {e.codi}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.25 }}>
                      {e.title}
                    </span>
                    {e.subtitle && (
                      <span style={{ display: 'block', fontSize: 12.5, color: V.muted, lineHeight: 1.4, marginTop: 5 }}>
                        {e.subtitle.length > 150 ? `${e.subtitle.slice(0, 147)}…` : e.subtitle}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <p style={{ marginTop: 8, fontSize: 13, color: V.faint, textAlign: 'center', lineHeight: 1.55 }}>
        Anirem afegint més temes en aquest format. Si en vols un de concret, escriu a{' '}
        <a href="mailto:info@infopol.app" style={{ color: meta.accentInk, fontWeight: 700 }}>
          info@infopol.app
        </a>
      </p>
    </div>
  );
}
