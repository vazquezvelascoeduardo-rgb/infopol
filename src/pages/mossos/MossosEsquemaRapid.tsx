// Esquema detallat d'un tema de Mossos (format temari jeràrquic).
// Renderitza el cos Markdown de l'entrada corresponent a esquemes-mossos-detall.
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEsquemaDetall } from '../../data/esquemes-mossos-detall';
import { AMBIT_META } from '../../lib/mossosTemari';
import { Markdown } from '../../lib/markdown';

const TERRACOTA = '#FF7A1A';
const TERRACOTA_INK = '#7A2E04';
const TERRACOTA_SOFT = '#FFE0CB';

export default function MossosEsquemaRapid() {
  const { slug = '' } = useParams();
  const esquema = useMemo(() => getEsquemaDetall(slug), [slug]);

  if (!esquema) {
    return (
      <div className="shell py-6">
        <p style={{ color: 'var(--text-2)' }}>No hi ha cap esquema detallat per a aquest tema encara.</p>
        <Link to="/mossos/esquemes" style={{ color: TERRACOTA, textDecoration: 'underline' }}>← Tots els esquemes</Link>
      </div>
    );
  }

  const meta = AMBIT_META[esquema.ambit];

  return (
    <article className="shell" style={{ maxWidth: 820, paddingBottom: 70 }}>
      <nav className="crumbs">
        <Link to="/">Inici</Link>
        <span className="sep">/</span>
        <Link to="/mossos">Mossos</Link>
        <span className="sep">/</span>
        <Link to="/mossos/esquemes">Esquemes</Link>
        <span className="sep">/</span>
        <span className="here">{esquema.codi}</span>
      </nav>

      {/* HERO */}
      <header style={{ paddingTop: 10, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999,
            background: TERRACOTA_SOFT, color: TERRACOTA_INK,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 11, fontWeight: 800,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: TERRACOTA }} />
            Tema {esquema.codi}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: 1.4, color: 'var(--text-3)', textTransform: 'uppercase',
          }}>{meta.icon} {meta.short}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,5vw,46px)', fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.06, color: 'var(--ink)' }}>
          {esquema.title}
        </h1>
        {esquema.subtitle && (
          <p style={{ margin: '12px 0 0', fontSize: 16, color: 'var(--text-2)', lineHeight: 1.5, fontWeight: 500 }}>{esquema.subtitle}</p>
        )}
      </header>

      {/* COS · markdown jeràrquic amb estil de fitxa */}
      <div className="fitxa esquema-detall" style={{ marginTop: 18 }}>
        <Markdown source={esquema.md} />
      </div>

      {/* Peu de navegació */}
      <div className="page-foot" style={{ marginTop: 26, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <Link to="/mossos/esquemes" className="btn btn-ghost">← Tots els esquemes</Link>
        {esquema.temariSlug && (
          <Link to={`/mossos/temari/${esquema.ambit.toLowerCase()}/${esquema.temariSlug}`} className="btn btn-ghost" style={{ color: 'var(--text-2)' }}>
            Veure tema complet al temari →
          </Link>
        )}
      </div>

      {/* Decoració del cos detallat (estil fitxa d'estudi) */}
      <style>{`
        .esquema-detall {
          background: #fff; border: 1px solid var(--line); border-radius: 18px;
          padding: clamp(18px, 3vw, 30px); box-shadow: 0 1px 0 rgba(21,21,28,0.03), 0 6px 18px rgba(21,21,28,0.05);
        }
        .esquema-detall > :first-child { margin-top: 0; }
        .esquema-detall h2 {
          margin: 30px 0 12px; font-size: clamp(18px,2.6vw,23px); font-weight: 800; letter-spacing: -0.4px;
          color: var(--ink); padding: 10px 14px; border-radius: 12px;
          background: linear-gradient(90deg, #FFE0CB, rgba(255,224,203,0.16));
          border-left: 4px solid #FF7A1A;
        }
        .esquema-detall h3 {
          margin: 20px 0 8px; font-size: 16px; font-weight: 800; color: #7A2E04;
          display: flex; align-items: center; gap: 8px;
        }
        .esquema-detall h3::before { content: ''; width: 7px; height: 7px; border-radius: 2px; background: #FF7A1A; flex-shrink: 0; }
        .esquema-detall p { line-height: 1.62; margin: 10px 0; color: var(--ink); }
        .esquema-detall strong { color: #7A2E04; font-weight: 800; }
        .esquema-detall ul, .esquema-detall ol { padding-left: 24px; margin: 8px 0; }
        .esquema-detall li { margin: 5px 0; line-height: 1.55; }
        .esquema-detall li::marker { color: #FF7A1A; font-weight: 700; }
        .esquema-detall blockquote {
          margin: 12px 0; padding: 12px 16px; border-left: 3px solid #F0B400;
          background: #FFF7E8; border-radius: 0 10px 10px 0; color: #3C2A08;
        }
        @media (max-width: 560px) { .esquema-detall h2 { font-size: 17px; } }
      `}</style>
    </article>
  );
}
