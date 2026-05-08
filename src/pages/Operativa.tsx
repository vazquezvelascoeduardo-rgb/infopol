// Pàgina principal del bloc "Operativa" · rebranding 2026 v2.
// Hero immersiu fosc + cercador integrat + bento grid d'àrees +
// procediments destacats amb chips filtre + referència ràpida +
// updates/pinned row.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Category = 'all' | 'trafico' | 'sc' | 'violencia' | 'detencion' | 'extranjeria';

type Proc = {
  to: string;
  category: Category;
  tag: string;
  level: '★ ESENCIAL' | 'FRECUENTE' | 'CRÍTICO' | 'REFERENCIA';
  title: string;
  desc: string;
  refs: string[];
  steps: number;
  accent: string;
  accentBg: string;
};

const PROCS: Proc[] = [
  {
    to: '/operativa/trafico/alcoholemia',
    category: 'trafico',
    tag: 'TRÁFICO',
    level: '★ ESENCIAL',
    title: 'Control preventivo de alcoholemia',
    desc: 'Selección, requerimiento, prueba evidencial, recurso y derechos del conductor.',
    refs: ['Art. 14 LSV', 'RD 6/2015', 'Art. 379 CP'],
    steps: 9,
    accent: '#F26B1F', accentBg: '#FFEFE4',
  },
  {
    to: '/operativa/penal/detencio',
    category: 'detencion',
    tag: 'DETENCIÓN',
    level: '★ ESENCIAL',
    title: 'Detención e información de derechos',
    desc: 'Plazos máximos, lectura, asistencia letrada, comunicaciones y habeas corpus.',
    refs: ['Art. 17 CE', 'Art. 520 LECrim', 'LO 6/84'],
    steps: 11,
    accent: '#9747D6', accentBg: '#F5E9FF',
  },
  {
    to: '/operativa/penal/identificacio',
    category: 'sc',
    tag: 'SC / PENAL',
    level: 'FRECUENTE',
    title: 'Identificación y cacheo',
    desc: 'Requisitos legales, motivación, indicios, registro corporal externo y derechos.',
    refs: ['Art. 16-20 LOPSC', 'STC 207/96'],
    steps: 7,
    accent: '#1c2a44', accentBg: '#E7ECF5',
  },
  {
    to: '/operativa/penal/violencia-genere',
    category: 'violencia',
    tag: 'VIOLENCIA',
    level: '★ ESENCIAL',
    title: 'Primera intervención VG / VD',
    desc: 'Llegada, separación, valoración VPR/VPER, medidas urgentes y derivación judicial.',
    refs: ['LO 1/2004', 'VIOGÉN', 'Art. 544 ter'],
    steps: 14,
    accent: '#E85D8C', accentBg: '#FFE8F0',
  },
  {
    to: '/operativa/trafico/accident',
    category: 'trafico',
    tag: 'TRÁFICO',
    level: 'FRECUENTE',
    title: 'Accidente con heridos',
    desc: 'Acordonamiento, atención sanitaria, atestado, croquis y diligencias judiciales.',
    refs: ['Art. 152 CP', 'RGC', 'Norma 8.1-IC'],
    steps: 12,
    accent: '#F26B1F', accentBg: '#FFEFE4',
  },
  {
    to: '/operativa/trafico/doc-falsa',
    category: 'extranjeria',
    tag: 'EXTRANJERÍA',
    level: 'FRECUENTE',
    title: 'Documentación CE / extracomunitaria',
    desc: 'Validez DNI, pasaporte, NIE, residencia, retención por identificación y CIE.',
    refs: ['LO 4/2000', 'RD 557/11'],
    steps: 6,
    accent: '#2FB66B', accentBg: '#DFF7E9',
  },
  {
    to: '/operativa/penal/detencio',
    category: 'detencion',
    tag: 'MENORES',
    level: 'CRÍTICO',
    title: 'Detención de menor de edad',
    desc: 'Comunicación a familia y fiscalía, custodia separada, asistencia y plazos.',
    refs: ['LO 5/2000', 'Art. 17.2 CE'],
    steps: 10,
    accent: '#9747D6', accentBg: '#F5E9FF',
  },
  {
    to: '/operativa/trafico/drogues',
    category: 'trafico',
    tag: 'TRÁFICO',
    level: 'CRÍTICO',
    title: 'Drogotest preventivo y conductas',
    desc: 'Cribado salival, prueba evidencial, negativa, custodia muestra, atestado.',
    refs: ['Art. 14 LSV', 'Art. 379.2 CP'],
    steps: 8,
    accent: '#F26B1F', accentBg: '#FFEFE4',
  },
  {
    to: '/operativa/penal/taula-actes',
    category: 'sc',
    tag: 'ATESTADO',
    level: 'REFERENCIA',
    title: 'Estructura de atestado policial',
    desc: 'Diligencias preceptivas, declaración, inspección ocular y entrega al juzgado.',
    refs: ['Art. 292 LECrim', 'Manual atestados'],
    steps: 15,
    accent: '#1c2a44', accentBg: '#E7ECF5',
  },
];

const CHIPS: { id: Category; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'trafico', label: 'Tráfico' },
  { id: 'sc', label: 'SC / Penal' },
  { id: 'violencia', label: 'Violencia' },
  { id: 'detencion', label: 'Detención' },
  { id: 'extranjeria', label: 'Extranjería' },
];

export default function Operativa() {
  const [filter, setFilter] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = PROCS.filter((p) => filter === 'all' || p.category === filter);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/cerca?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">Inicio</Link>
        <span className="sep">/</span>
        <span className="here">Operativa</span>
      </nav>

      {/* HERO immersiu */}
      <header className="op-hero">
        <div className="eyebrow">🚓 OPERATIVA POLICIAL · ACTUALIZADO HOY</div>
        <h1>Procedimientos<br />en la <em>calle</em>.</h1>
        <p className="lead">
          Pasos, plazos, derechos y artículos aplicables — listos para consultar en servicio. Buscador rápido, fichas operativas con flujo paso a paso, y referencia normativa siempre visible.
        </p>

        <form onSubmit={onSubmit} className="op-search">
          <div className="field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-3)' }}>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: 'identificación', 'alcoholemia', 'detención menor', 'art. 17'…"
            />
            <kbd>⌘K</kbd>
          </div>
          <button type="submit" className="btn-search">Buscar</button>
        </form>

        <div className="op-stats">
          <span className="op-pill"><b>{PROCS.length}+</b> procedimientos</span>
          <span className="op-pill"><b>5</b> áreas operativas</span>
          <span className="op-pill"><b>9</b> destacados</span>
          <span className="op-pill">📌 Sincronización SCT 2026</span>
        </div>
      </header>

      {/* Bento d'àrees */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--terracotta)' } as React.CSSProperties}
      >
        <span className="eyebrow">🗺️ ÁREAS OPERATIVAS</span>
        <span className="rule" />
      </div>

      <section className="op-areas">
        <Link to="/operativa/trafico" className="op-area trafico">
          <span className="ai" style={{ fontSize: 30 }}>🚦</span>
          <h3>Tráfico</h3>
          <p>Catálogo SCT, alcoholemia, drogas, accidentes con/sin heridos, retiradas, atestados y arts. de la LSV/RGC al detalle.</p>
          <div className="meta">
            <span>14 PROCEDIMIENTOS · LSV · RGC</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/penal" className="op-area sc">
          <span className="ai">🛡️</span>
          <h3>SC / Penal</h3>
          <p>Identificación, registros corporales, escorcoll y cacheo.</p>
          <div className="meta">
            <span>20 PROC.</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/penal/detencio" className="op-area det">
          <span className="ai">⚖️</span>
          <h3>Detenciones</h3>
          <p>Plazos, derechos, asistencia letrada, atestado y traslados.</p>
          <div className="meta">
            <span>5 PROC.</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/penal/violencia-genere" className="op-area vg">
          <span className="ai">💜</span>
          <h3>Violencia género · doméstica</h3>
          <p>Valoración del riesgo, medidas urgentes y VIOGÉN.</p>
          <div className="meta">
            <span>4 PROC.</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/trafico/doc-falsa" className="op-area ext">
          <span className="ai">🌍</span>
          <h3>Extranjería · menores</h3>
          <p>Documentación CE/extracom., MENA, expulsión, fiscalía.</p>
          <div className="meta">
            <span>3 PROC.</span>
            <span className="arr">→</span>
          </div>
        </Link>
      </section>

      {/* Procediments destacats amb filtre */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--ink)' } as React.CSSProperties}
      >
        <span className="eyebrow">⚡ PROCEDIMIENTOS DESTACADOS</span>
        <span className="rule" />
        <div className="op-chips">
          {CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={filter === c.id ? 'active' : ''}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <section className="op-procs">
        {filtered.map((p, i) => (
          <Link
            key={`proc-${i}`}
            to={p.to}
            className="op-proc"
            style={{
              ['--accent' as never]: p.accent,
              ['--accent-bg' as never]: p.accentBg,
            } as React.CSSProperties}
          >
            <div className="top">
              <span className="tag">{p.tag}</span>
              <span className="lvl">{p.level}</span>
            </div>
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
            <div className="refs">
              {p.refs.map((r) => <span key={r}>{r}</span>)}
            </div>
            <div className="footer-row">
              <span className="pasos"><b>{p.steps}</b> PASOS</span>
              <span className="open">Abrir flujo →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Quick reference */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: '#2F6BD8' } as React.CSSProperties}
      >
        <span className="eyebrow">⚡ REFERENCIA RÁPIDA</span>
        <span className="rule" />
      </div>

      <section className="qref-grid">
        <div
          className="qref"
          style={{ ['--accent' as never]: '#F26B1F', ['--accent-bg' as never]: '#FFEFE4' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>🍷 Alcoholemia</h5>
            <span className="qstat">mg/l aire</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">GRAL</span><span className="qlbl">Conductor general</span><span className="qval">0,25</span></div>
            <div className="qrow"><span className="qkey">PRO</span><span className="qlbl">Profesional / novel</span><span className="qval">0,15</span></div>
            <div className="qrow"><span className="qkey">PEN</span><span className="qlbl">Delito (art. 379 CP)</span><span className="qval">0,60</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#9747D6', ['--accent-bg' as never]: '#F5E9FF' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>⏱️ Plazos detención</h5>
            <span className="qstat">máximos legales</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">GRAL</span><span className="qlbl">Detención común</span><span className="qval">72h</span></div>
            <div className="qrow"><span className="qkey">TER</span><span className="qlbl">Terrorismo (+48h)</span><span className="qval">120h</span></div>
            <div className="qrow"><span className="qkey">MEN</span><span className="qlbl">Menor de edad</span><span className="qval">24h</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#1c2a44', ['--accent-bg' as never]: '#E7ECF5' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>📑 Identificación</h5>
            <span className="qstat">art. 16 LOPSC</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">DEP</span><span className="qlbl">Tiempo en dependencias</span><span className="qval">6h</span></div>
            <div className="qrow"><span className="qkey">DOC</span><span className="qlbl">Negativa (art. 36.6)</span><span className="qval">100€+</span></div>
            <div className="qrow"><span className="qkey">REG</span><span className="qlbl">Reg. asistidos / Libro</span><span className="qval">SI</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#E85D8C', ['--accent-bg' as never]: '#FFE8F0' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>💜 VG · VPR</h5>
            <span className="qstat">niveles VIOGÉN</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">EXT</span><span className="qlbl">Extremo</span><span className="qval">24/7</span></div>
            <div className="qrow"><span className="qkey">ALT</span><span className="qlbl">Alto</span><span className="qval">72h</span></div>
            <div className="qrow"><span className="qkey">MED</span><span className="qlbl">Medio</span><span className="qval">7d</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#2FB66B', ['--accent-bg' as never]: '#DFF7E9' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>🌍 Extranjería</h5>
            <span className="qstat">documentos válidos</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">CE</span><span className="qlbl">Doc. Espacio Schengen</span><span className="qval">DNI/PSP</span></div>
            <div className="qrow"><span className="qkey">3P</span><span className="qlbl">Tercer país</span><span className="qval">PSP+VIS</span></div>
            <div className="qrow"><span className="qkey">RES</span><span className="qlbl">Residente larga dur.</span><span className="qval">TIE</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#E5484D', ['--accent-bg' as never]: '#FFE8E8' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>⚠️ Uso fuerza</h5>
            <span className="qstat">PILES · LO 2/86</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">P</span><span className="qlbl">Proporcionalidad</span><span className="qval">★</span></div>
            <div className="qrow"><span className="qkey">I</span><span className="qlbl">Idoneidad</span><span className="qval">★</span></div>
            <div className="qrow"><span className="qkey">L</span><span className="qlbl">Legalidad · Excepc. · Subs.</span><span className="qval">★★★</span></div>
          </div>
        </div>
      </section>

      {/* Updates + Pinned */}
      <section className="upd-row">
        <div className="upd-card">
          <div className="eyebrow">🔄 ACTUALIZADO RECIENTEMENTE</div>
          <h3>Cambios normativos · 2026</h3>
          <ul className="upd-list">
            <li>
              <span className="ud">⚖️</span>
              <div><b>LO 1/2026 · Multirreincidencia patrimonial</b><span className="um">Hurto/estafa lleus → menos grau si 3+ condenes</span></div>
              <span className="udate">04 ABR</span>
            </li>
            <li>
              <span className="ud">📱</span>
              <div><b>LO 1/2026 · Hurto de móvil agravado</b><span className="um">Tipus específic · 6-18 mesos presó · IMEI obligatori</span></div>
              <span className="udate">04 ABR</span>
            </li>
            <li>
              <span className="ud">⛽</span>
              <div><b>Petaqueo · art. 568.2 CP</b><span className="um">Subministrar combustible a narcolanchas → 3-5 anys</span></div>
              <span className="udate">04 ABR</span>
            </li>
            <li>
              <span className="ud">🚦</span>
              <div><b>SCT 2026 · Catàleg infraccions actualitzat</b><span className="um">Nous trams VMP · controls preventius</span></div>
              <span className="udate">01 FEB</span>
            </li>
          </ul>
        </div>

        <aside className="pin-card">
          <div className="eyebrow">📌 ACCESO RÁPIDO</div>
          <h4>Procedimientos clave</h4>
          <p>Els més consultats per la PL en servei.</p>
          <ul className="pin-list">
            <li>
              <Link to="/operativa/trafico/alcoholemia" className="contents text-inherit no-underline">Alcoholemia · 9 pasos</Link>
              <span className="t">★</span>
            </li>
            <li>
              <Link to="/operativa/penal/detencio" className="contents text-inherit no-underline">Detención derechos</Link>
              <span className="t">★</span>
            </li>
            <li>
              <Link to="/operativa/penal/violencia-genere" className="contents text-inherit no-underline">VG · Primera intervención</Link>
              <span className="t">★</span>
            </li>
            <li>
              <Link to="/operativa/penal/identificacio" className="contents text-inherit no-underline">Identificación cacheo</Link>
              <span className="t">★</span>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
