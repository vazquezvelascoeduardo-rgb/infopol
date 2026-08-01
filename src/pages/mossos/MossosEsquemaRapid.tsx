// Esquema detallat d'un tema de Mossos (format temari jeràrquic).
// Renderitza el cos Markdown de l'entrada corresponent a esquemes-mossos-detall.
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getEsquemaDetall } from '../../data/esquemes-mossos-detall';
import { AMBIT_META } from '../../lib/mossosTemari';
import { Markdown } from '../../lib/markdown';
import { metaCos } from '../../lib/cos';
import { Mono, V } from '../../lib/v3';

export default function MossosEsquemaRapid() {
  const { slug = '' } = useParams();
  const nav = useNavigate();
  const cos = metaCos('mossos');
  const esquema = useMemo(() => getEsquemaDetall(slug), [slug]);

  if (!esquema) {
    return (
      <div className="v3-page v3-anim">
        <p style={{ fontSize: 15, color: V.muted }}>
          Encara no hi ha cap esquema detallat per a aquest tema.
        </p>
        <button
          type="button"
          onClick={() => nav('/mossos/esquemes')}
          style={{
            marginTop: 14, cursor: 'pointer', border: 'none', borderRadius: 999,
            padding: '10px 18px', background: cos.accent, color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
          Veure tots els esquemes
        </button>
      </div>
    );
  }

  const meta = AMBIT_META[esquema.ambit];

  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 860, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
        <span style={{
          width: 52, height: 52, flexShrink: 0, borderRadius: 16,
          background: cos.accentSoft, color: cos.accentInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: V.mono, fontSize: 14, fontWeight: 800,
        }}>
          {esquema.codi}
        </span>
        <div style={{ minWidth: 0 }}>
          <Mono size={10} color={cos.accentInk} style={{ letterSpacing: 1.8 }}>
            ESQUEMA · {meta.short.toUpperCase()}
          </Mono>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.12, margin: '5px 0 0' }}>
            {esquema.title}
          </h1>
        </div>
      </div>
      {esquema.subtitle && (
        <p style={{ fontSize: 14, color: V.muted, lineHeight: 1.5, margin: '0 0 20px', maxWidth: 640 }}>
          {esquema.subtitle}
        </p>
      )}

      {/* Cos de l'esquema: markdown jeràrquic amb l'estil de fitxa d'estudi. */}
      <div className="esquema-detall">
        <Markdown source={esquema.md} />
      </div>

      <button
        type="button"
        onClick={() => nav('/mossos/esquemes')}
        style={{
          marginTop: 22, cursor: 'pointer', border: `1px solid ${V.border}`, borderRadius: 18,
          padding: '13px 20px', background: V.surface, color: V.ink,
          fontSize: 14, fontWeight: 700, letterSpacing: -0.3,
        }}>
        Tots els esquemes
      </button>

      {/* L'estil del cos va amb els tokens del disseny: així es llegeix
          igual de bé en clar i en fosc. Abans anava amb colors fixos. */}
      <style>{`
        .esquema-detall {
          background: var(--v-surface); border: 1px solid var(--v-hair); border-radius: 20px;
          padding: clamp(18px, 3vw, 30px); box-shadow: 0 4px 14px var(--v-shadow);
        }
        .esquema-detall > :first-child { margin-top: 0; }
        .esquema-detall h2 {
          margin: 30px 0 12px; font-size: clamp(18px,2.6vw,23px); font-weight: 800; letter-spacing: -0.4px;
          color: var(--v-ink); padding: 10px 14px; border-radius: 12px;
          background: var(--v-granate-soft);
          border-left: 4px solid var(--v-granate);
        }
        .esquema-detall h3 {
          margin: 20px 0 8px; font-size: 16px; font-weight: 800; color: var(--v-granate);
          display: flex; align-items: center; gap: 8px;
        }
        .esquema-detall h3::before {
          content: ''; width: 7px; height: 7px; border-radius: 2px;
          background: var(--v-granate); flex-shrink: 0;
        }
        .esquema-detall p { line-height: 1.62; margin: 10px 0; color: var(--v-ink); }
        .esquema-detall strong { color: var(--v-granate); font-weight: 800; }
        .esquema-detall ul, .esquema-detall ol { padding-left: 24px; margin: 8px 0; }
        .esquema-detall li { margin: 5px 0; line-height: 1.55; color: var(--v-ink); }
        .esquema-detall li::marker { color: var(--v-granate); font-weight: 700; }
        .esquema-detall blockquote {
          margin: 12px 0; padding: 12px 16px; border-left: 3px solid var(--v-warn);
          background: var(--v-warn-soft); border-radius: 0 10px 10px 0; color: var(--v-ink);
        }
        @media (max-width: 560px) { .esquema-detall h2 { font-size: 17px; } }
      `}</style>
    </div>
  );
}
