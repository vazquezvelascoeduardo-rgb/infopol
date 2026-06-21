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

      {/* Ajustos d'estil per al cos detallat */}
      <style>{`
        .esquema-detall h2 { margin-top: 30px; font-size: clamp(20px,3vw,26px); letter-spacing:-0.5px; }
        .esquema-detall h3 { margin-top: 18px; font-size: 17px; color: var(--text-2); }
        .esquema-detall ul, .esquema-detall ol { padding-left: 22px; }
        .esquema-detall li { margin: 4px 0; line-height: 1.5; }
        .esquema-detall p { line-height: 1.6; }
      `}</style>
    </article>
  );
}
