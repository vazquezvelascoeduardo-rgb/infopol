// Pàgina principal del bloc "Operativa" · rebranding 2026 v2.
// Hero immersiu fosc + cercador integrat + bento grid d'àrees +
// procediments destacats amb chips filtre + referència ràpida +
// updates/pinned row.
//
// Tot el copy passa per `useT()` (català). Les dades dels procediments
// (PROCS) i chips de filtre es defineixen amb `keyTitle`/`keyDesc` que
// el render resol amb les claus i18n; així es manté la lògica del
// filtrat però sense hardcodejar text en castellà.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';

type Category = 'all' | 'trafico' | 'sc' | 'violencia' | 'detencion' | 'extranjeria';
type Level = 'essential' | 'frequent' | 'critical' | 'reference';

type Proc = {
  to: string;
  category: Category;
  tagKey: string;
  level: Level;
  titleKey: string;
  descKey: string;
  refs: string[];
  steps: number;
  accent: string;
  accentBg: string;
};

const PROCS: Proc[] = [
  {
    to: '/operativa/trafico/alcoholemia',
    category: 'trafico',
    tagKey: 'operativa.tag.trafico',
    level: 'essential',
    titleKey: 'operativa.proc.alcoholemia.title',
    descKey: 'operativa.proc.alcoholemia.desc',
    refs: ['Art. 14 LSV', 'RD 6/2015', 'Art. 379 CP'],
    steps: 9,
    accent: '#F26B1F', accentBg: '#FFEFE4',
  },
  {
    to: '/operativa/penal/detencio',
    category: 'detencion',
    tagKey: 'operativa.tag.detencion',
    level: 'essential',
    titleKey: 'operativa.proc.detencio.title',
    descKey: 'operativa.proc.detencio.desc',
    refs: ['Art. 17 CE', 'Art. 520 LECrim', 'LO 6/84'],
    steps: 11,
    accent: '#9747D6', accentBg: '#F5E9FF',
  },
  {
    to: '/operativa/penal/identificacio',
    category: 'sc',
    tagKey: 'operativa.tag.sc',
    level: 'frequent',
    titleKey: 'operativa.proc.identificacio.title',
    descKey: 'operativa.proc.identificacio.desc',
    refs: ['Art. 16-20 LOPSC', 'STC 207/96'],
    steps: 7,
    accent: '#1c2a44', accentBg: '#E7ECF5',
  },
  {
    to: '/operativa/penal/violencia-genere',
    category: 'violencia',
    tagKey: 'operativa.tag.violencia',
    level: 'essential',
    titleKey: 'operativa.proc.vg.title',
    descKey: 'operativa.proc.vg.desc',
    refs: ['LO 1/2004', 'VIOGÉN', 'Art. 544 ter'],
    steps: 14,
    accent: '#E85D8C', accentBg: '#FFE8F0',
  },
  {
    to: '/operativa/trafico/accident',
    category: 'trafico',
    tagKey: 'operativa.tag.trafico',
    level: 'frequent',
    titleKey: 'operativa.proc.accident.title',
    descKey: 'operativa.proc.accident.desc',
    refs: ['Art. 152 CP', 'RGC', 'Norma 8.1-IC'],
    steps: 12,
    accent: '#F26B1F', accentBg: '#FFEFE4',
  },
  {
    to: '/operativa/trafico/doc-falsa',
    category: 'extranjeria',
    tagKey: 'operativa.tag.extranjeria',
    level: 'frequent',
    titleKey: 'operativa.proc.docfalsa.title',
    descKey: 'operativa.proc.docfalsa.desc',
    refs: ['LO 4/2000', 'RD 557/11'],
    steps: 6,
    accent: '#2FB66B', accentBg: '#DFF7E9',
  },
  {
    to: '/operativa/penal/detencio',
    category: 'detencion',
    tagKey: 'operativa.tag.menores',
    level: 'critical',
    titleKey: 'operativa.proc.menor.title',
    descKey: 'operativa.proc.menor.desc',
    refs: ['LO 5/2000', 'Art. 17.2 CE'],
    steps: 10,
    accent: '#9747D6', accentBg: '#F5E9FF',
  },
  {
    to: '/operativa/trafico/drogues',
    category: 'trafico',
    tagKey: 'operativa.tag.trafico',
    level: 'critical',
    titleKey: 'operativa.proc.drogues.title',
    descKey: 'operativa.proc.drogues.desc',
    refs: ['Art. 14 LSV', 'Art. 379.2 CP'],
    steps: 8,
    accent: '#F26B1F', accentBg: '#FFEFE4',
  },
  {
    to: '/operativa/penal/taula-actes',
    category: 'sc',
    tagKey: 'operativa.tag.atestado',
    level: 'reference',
    titleKey: 'operativa.proc.atestat.title',
    descKey: 'operativa.proc.atestat.desc',
    refs: ['Art. 292 LECrim', 'Manual atestats'],
    steps: 15,
    accent: '#1c2a44', accentBg: '#E7ECF5',
  },
];

const CHIPS: { id: Category; key: string }[] = [
  { id: 'all', key: 'operativa.chip.all' },
  { id: 'trafico', key: 'operativa.chip.trafico' },
  { id: 'sc', key: 'operativa.chip.sc' },
  { id: 'violencia', key: 'operativa.chip.violencia' },
  { id: 'detencion', key: 'operativa.chip.detencion' },
  { id: 'extranjeria', key: 'operativa.chip.extranjeria' },
];

const LEVEL_KEYS: Record<Level, string> = {
  essential: 'operativa.lvl.essential',
  frequent: 'operativa.lvl.frequent',
  critical: 'operativa.lvl.critical',
  reference: 'operativa.lvl.reference',
};

export default function Operativa() {
  const { t } = useT();
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
        <Link to="/">{t('operativa.crumbs.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('operativa.crumbs.here')}</span>
      </nav>

      {/* HERO immersiu */}
      <header className="op-hero">
        <div className="eyebrow">{t('operativa.hero.eyebrow')}</div>
        <h1>{t('operativa.hero.title1')}<br />{t('operativa.hero.title2.prefix')} <em>{t('operativa.hero.title2.accent')}</em>.</h1>
        <p className="lead">{t('operativa.hero.lead')}</p>

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
              placeholder={t('operativa.search.placeholder')}
            />
            <kbd>⌘K</kbd>
          </div>
          <button type="submit" className="btn-search">{t('operativa.search.cta')}</button>
        </form>

        <div className="op-stats">
          <span className="op-pill"><b>{PROCS.length}+</b> {t('operativa.stats.procs')}</span>
          <span className="op-pill"><b>5</b> {t('operativa.stats.areas')}</span>
          <span className="op-pill"><b>9</b> {t('operativa.stats.featured')}</span>
          <span className="op-pill">{t('operativa.stats.sct')}</span>
        </div>
      </header>

      {/* Bento d'àrees */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--terracotta)' } as React.CSSProperties}
      >
        <span className="eyebrow">{t('operativa.areas.eyebrow')}</span>
        <span className="rule" />
      </div>

      <section className="op-areas">
        <Link to="/operativa/trafico" className="op-area trafico">
          <span className="ai" style={{ fontSize: 30 }}>🚦</span>
          <h3>{t('operativa.area.trafico.title')}</h3>
          <p>{t('operativa.area.trafico.desc')}</p>
          <div className="meta">
            <span>{t('operativa.area.trafico.meta')}</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/penal" className="op-area sc">
          <span className="ai">🛡️</span>
          <h3>{t('operativa.area.sc.title')}</h3>
          <p>{t('operativa.area.sc.desc')}</p>
          <div className="meta">
            <span>{t('operativa.area.sc.meta')}</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/penal/detencio" className="op-area det">
          <span className="ai">⚖️</span>
          <h3>{t('operativa.area.det.title')}</h3>
          <p>{t('operativa.area.det.desc')}</p>
          <div className="meta">
            <span>{t('operativa.area.det.meta')}</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/penal/violencia-genere" className="op-area vg">
          <span className="ai">💜</span>
          <h3>{t('operativa.area.vg.title')}</h3>
          <p>{t('operativa.area.vg.desc')}</p>
          <div className="meta">
            <span>{t('operativa.area.vg.meta')}</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link to="/operativa/trafico/doc-falsa" className="op-area ext">
          <span className="ai">🌍</span>
          <h3>{t('operativa.area.ext.title')}</h3>
          <p>{t('operativa.area.ext.desc')}</p>
          <div className="meta">
            <span>{t('operativa.area.ext.meta')}</span>
            <span className="arr">→</span>
          </div>
        </Link>

        <Link
          to="/leyes/s/novetats"
          className="op-area"
          style={{
            ['--accent' as never]: '#C026D3',
            ['--accent-bg' as never]: '#FBE4FF',
          } as React.CSSProperties}
        >
          <span className="ai">🆕</span>
          <h3>Novetats normatives</h3>
          <p>Lleis noves, reformes constitucionals i actualitzacions recents — VMP/VPL, 4a reforma CE, multireincidència…</p>
          <div className="meta">
            <span>Actualitzat 2026</span>
            <span className="arr">→</span>
          </div>
        </Link>
      </section>

      {/* Procediments destacats amb filtre */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--ink)' } as React.CSSProperties}
      >
        <span className="eyebrow">{t('operativa.procs.eyebrow')}</span>
        <span className="rule" />
        <div className="op-chips" role="tablist" aria-label={t('operativa.chip.all')}>
          {CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={filter === c.id}
              className={filter === c.id ? 'active' : ''}
              onClick={() => setFilter(c.id)}
            >
              {t(c.key)}
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
              <span className="tag">{t(p.tagKey)}</span>
              <span className="lvl">{t(LEVEL_KEYS[p.level])}</span>
            </div>
            <h4>{t(p.titleKey)}</h4>
            <p>{t(p.descKey)}</p>
            <div className="refs">
              {p.refs.map((r) => <span key={r}>{r}</span>)}
            </div>
            <div className="footer-row">
              <span className="pasos"><b>{p.steps}</b> {t('operativa.proc.steps')}</span>
              <span className="open">{t('operativa.proc.open')}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Quick reference */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: '#2F6BD8' } as React.CSSProperties}
      >
        <span className="eyebrow">{t('operativa.qref.eyebrow')}</span>
        <span className="rule" />
      </div>

      <section className="qref-grid">
        <div
          className="qref"
          style={{ ['--accent' as never]: '#F26B1F', ['--accent-bg' as never]: '#FFEFE4' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>{t('operativa.qref.alc.title')}</h5>
            <span className="qstat">{t('operativa.qref.alc.unit')}</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">GRAL</span><span className="qlbl">{t('operativa.qref.alc.gen')}</span><span className="qval">0,25</span></div>
            <div className="qrow"><span className="qkey">PRO</span><span className="qlbl">{t('operativa.qref.alc.pro')}</span><span className="qval">0,15</span></div>
            <div className="qrow"><span className="qkey">PEN</span><span className="qlbl">{t('operativa.qref.alc.pen')}</span><span className="qval">0,60</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#9747D6', ['--accent-bg' as never]: '#F5E9FF' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>{t('operativa.qref.det.title')}</h5>
            <span className="qstat">{t('operativa.qref.det.unit')}</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">GRAL</span><span className="qlbl">{t('operativa.qref.det.gen')}</span><span className="qval">72h</span></div>
            <div className="qrow"><span className="qkey">TER</span><span className="qlbl">{t('operativa.qref.det.ter')}</span><span className="qval">120h</span></div>
            <div className="qrow"><span className="qkey">MEN</span><span className="qlbl">{t('operativa.qref.det.men')}</span><span className="qval">24h</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#1c2a44', ['--accent-bg' as never]: '#E7ECF5' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>{t('operativa.qref.id.title')}</h5>
            <span className="qstat">{t('operativa.qref.id.unit')}</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">DEP</span><span className="qlbl">{t('operativa.qref.id.dep')}</span><span className="qval">6h</span></div>
            <div className="qrow"><span className="qkey">DOC</span><span className="qlbl">{t('operativa.qref.id.doc')}</span><span className="qval">100€+</span></div>
            <div className="qrow"><span className="qkey">REG</span><span className="qlbl">{t('operativa.qref.id.reg')}</span><span className="qval">SI</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#E85D8C', ['--accent-bg' as never]: '#FFE8F0' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>{t('operativa.qref.vg.title')}</h5>
            <span className="qstat">{t('operativa.qref.vg.unit')}</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">EXT</span><span className="qlbl">{t('operativa.qref.vg.ext')}</span><span className="qval">24/7</span></div>
            <div className="qrow"><span className="qkey">ALT</span><span className="qlbl">{t('operativa.qref.vg.alt')}</span><span className="qval">72h</span></div>
            <div className="qrow"><span className="qkey">MED</span><span className="qlbl">{t('operativa.qref.vg.med')}</span><span className="qval">7d</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#2FB66B', ['--accent-bg' as never]: '#DFF7E9' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>{t('operativa.qref.ext.title')}</h5>
            <span className="qstat">{t('operativa.qref.ext.unit')}</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">CE</span><span className="qlbl">{t('operativa.qref.ext.ce')}</span><span className="qval">DNI/PSP</span></div>
            <div className="qrow"><span className="qkey">3P</span><span className="qlbl">{t('operativa.qref.ext.tp')}</span><span className="qval">PSP+VIS</span></div>
            <div className="qrow"><span className="qkey">RES</span><span className="qlbl">{t('operativa.qref.ext.res')}</span><span className="qval">TIE</span></div>
          </div>
        </div>

        <div
          className="qref"
          style={{ ['--accent' as never]: '#E5484D', ['--accent-bg' as never]: '#FFE8E8' } as React.CSSProperties}
        >
          <div className="qhead">
            <h5>{t('operativa.qref.fz.title')}</h5>
            <span className="qstat">{t('operativa.qref.fz.unit')}</span>
          </div>
          <div className="qrows">
            <div className="qrow"><span className="qkey">P</span><span className="qlbl">{t('operativa.qref.fz.p')}</span><span className="qval">★</span></div>
            <div className="qrow"><span className="qkey">I</span><span className="qlbl">{t('operativa.qref.fz.i')}</span><span className="qval">★</span></div>
            <div className="qrow"><span className="qkey">L</span><span className="qlbl">{t('operativa.qref.fz.l')}</span><span className="qval">★★★</span></div>
          </div>
        </div>
      </section>

      {/* Updates + Pinned */}
      <section className="upd-row">
        <div className="upd-card">
          <div className="eyebrow">{t('operativa.upd.eyebrow')}</div>
          <h3>{t('operativa.upd.title')}</h3>
          <ul className="upd-list">
            <li>
              <span className="ud">⚖️</span>
              <div><b>{t('operativa.upd.lo1.title')}</b><span className="um">{t('operativa.upd.lo1.desc')}</span></div>
              <span className="udate">04 ABR</span>
            </li>
            <li>
              <span className="ud">📱</span>
              <div><b>{t('operativa.upd.mob.title')}</b><span className="um">{t('operativa.upd.mob.desc')}</span></div>
              <span className="udate">04 ABR</span>
            </li>
            <li>
              <span className="ud">⛽</span>
              <div><b>{t('operativa.upd.pet.title')}</b><span className="um">{t('operativa.upd.pet.desc')}</span></div>
              <span className="udate">04 ABR</span>
            </li>
            <li>
              <span className="ud">🚦</span>
              <div><b>{t('operativa.upd.sct.title')}</b><span className="um">{t('operativa.upd.sct.desc')}</span></div>
              <span className="udate">01 FEB</span>
            </li>
          </ul>
        </div>

        <aside className="pin-card">
          <div className="eyebrow">{t('operativa.pin.eyebrow')}</div>
          <h4>{t('operativa.pin.title')}</h4>
          <p>{t('operativa.pin.lead')}</p>
          <ul className="pin-list">
            <li>
              <Link to="/operativa/trafico/alcoholemia" className="contents text-inherit no-underline">{t('operativa.pin.alc')}</Link>
              <span className="t">★</span>
            </li>
            <li>
              <Link to="/operativa/penal/detencio" className="contents text-inherit no-underline">{t('operativa.pin.det')}</Link>
              <span className="t">★</span>
            </li>
            <li>
              <Link to="/operativa/penal/violencia-genere" className="contents text-inherit no-underline">{t('operativa.pin.vg')}</Link>
              <span className="t">★</span>
            </li>
            <li>
              <Link to="/operativa/penal/identificacio" className="contents text-inherit no-underline">{t('operativa.pin.id')}</Link>
              <span className="t">★</span>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
