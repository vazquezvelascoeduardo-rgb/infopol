// Esquema ràpid d'una llei de Policia Local · pantalla de detall.
// Tema visual BLAU (operativa) en lloc de TERRACOTA (acadèmia).
// 4 seccions navegables: Resum / Cronologia / Personatges / Examen.

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getEsquemaLlei,
  CATEGORIA_META,
  type LleiEra,
  type LleiMilestone,
  type LleiItem,
} from '../../data/esquemas-pl';
import { V } from '../../lib/v3';

type SectionId = 'resum' | 'timeline' | 'items' | 'examen';

const BLUE = '#3B6BF5';
const BLUE_SOFT = '#D8E2FE';
const BLUE_INK = '#0E2B7A';
const NAVY = '#0E1A36';
const CREAM_BLUE = 'var(--v-blue-soft)';
const CREAM_BORDER = 'var(--v-border)';

function useActive(ids: SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0]);
  useEffect(() => {
    function onScroll() {
      let current: SectionId = ids[0];
      for (const id of ids) {
        const el = document.getElementById(`esq-${id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top - 140 <= 0) current = id;
        else break;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);
  return active;
}

export default function PoliciaLocalEsquemaLlei() {
  const { slug = '' } = useParams();
  const esquema = useMemo(() => getEsquemaLlei(slug), [slug]);

  // Etiquetes adaptades per llei
  const itemsLabel = esquema?.labels?.items ?? 'Articles clau';
  const itemsTabLabel = esquema?.labels?.itemsTab ?? itemsLabel;

  const SECTIONS = useMemo<{ id: SectionId; label: string; icon: string }[]>(() => [
    { id: 'resum', label: 'Resum', icon: '🚩' },
    { id: 'timeline', label: 'Cronologia', icon: '⏱' },
    { id: 'items', label: itemsTabLabel, icon: '📑' },
    { id: 'examen', label: "Per a l'examen", icon: '✅' },
  ], [itemsTabLabel]);
  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), [SECTIONS]);
  const active = useActive(sectionIds);

  if (!esquema) {
    return (
      <div className="v3-page v3-anim">
        <p style={{ color: 'var(--text-2)' }}>
          No existeix esquema ràpid per a aquesta llei encara.
        </p>
        <Link to="/policia-local/esquemes" style={{ color: BLUE, textDecoration: 'underline' }}>
          ← Tornar als esquemes
        </Link>
      </div>
    );
  }

  const cat = CATEGORIA_META[esquema.categoria];
  const erasById: Record<string, LleiEra> = Object.fromEntries(esquema.eras.map((e) => [e.id, e]));
  const itemsById: Record<string, LleiItem> = Object.fromEntries(esquema.items.map((p) => [p.id, p]));

  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 1100, width: '100%' }}>
      {/* Breadcrumb */}

      {/* HERO */}
      <header style={{ paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999,
              background: BLUE_SOFT, color: BLUE_INK,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 11, fontWeight: 800, letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 3, background: BLUE }} />
            {esquema.kicker}
          </span>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: cat.soft, color: cat.color,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 11, fontWeight: 800, letterSpacing: 1.4,
            }}
          >
            <span aria-hidden>{cat.emoji}</span>
            {cat.label.toUpperCase()}
          </span>
        </div>

        <h1 style={{
          margin: 0, fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900,
          letterSpacing: -1.4, lineHeight: 1.04, color: 'var(--ink)',
        }}>
          {esquema.title}
          {esquema.titleHighlight && (
            <span style={{ color: BLUE }}>{' '}{esquema.titleHighlight}</span>
          )}
        </h1>

        {/* KPIs */}
        <div style={{ display: 'flex', gap: 22, marginTop: 16, flexWrap: 'wrap' }}>
          {esquema.kpis.map((k, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: k.mono ? 'JetBrains Mono, ui-monospace, monospace' : 'inherit',
                fontSize: 22, fontWeight: 900, color: 'var(--ink)',
                letterSpacing: -0.5,
              }}>{k.value}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{k.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* TAB NAV — sticky */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 20, marginTop: 24,
          background: 'var(--paper)',
          borderBottom: '1px solid var(--line)',
          display: 'flex', gap: 4, overflowX: 'auto', padding: '0 2px',
        }}
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id} href={`#esq-${s.id}`}
              style={{
                padding: '12px 16px',
                display: 'inline-flex', alignItems: 'center', gap: 7,
                color: isActive ? BLUE : 'var(--text-2)',
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                borderBottom: `3px solid ${isActive ? BLUE : 'transparent'}`,
                marginBottom: -1, whiteSpace: 'nowrap',
              }}
            >
              <span aria-hidden>{s.icon}</span>
              {s.label}
            </a>
          );
        })}
      </nav>

      {/* SECCIÓ 1 · RESUM */}
      <section id="esq-resum" style={{ padding: '32px 0 12px', scrollMarginTop: 80 }}>
        <SectionHeader n="01" label="Resum" title="Allò que has de poder explicar en 5 minuts" />

        <div style={{
          marginTop: 18, padding: '24px 26px', background: CREAM_BLUE, borderRadius: 18,
          border: `1px solid ${CREAM_BORDER}`, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -12, left: 18,
            padding: '4px 12px', borderRadius: 999,
            background: V.surface, border: `1px solid ${CREAM_BORDER}`,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11, fontWeight: 800, letterSpacing: 2,
            textTransform: 'uppercase', color: BLUE_INK,
          }}>EN UNA FRASE</div>
          <p style={{
            margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.5,
            color: BLUE_INK, letterSpacing: -0.1,
          }}>{esquema.introOneLiner}</p>
        </div>

        {/* Eres */}
        <div style={{ marginTop: 22 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 12, fontWeight: 800, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12,
          }}>{`${esquema.eras.length} ETAPES`}</div>
          <div className="esq-eras-grid">
            {esquema.eras.map((e, i) => (
              <div key={e.id} style={{
                padding: '14px 16px', borderRadius: 14,
                background: V.surface, border: '1px solid var(--line)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 10, background: e.soft, color: e.color,
                    display: 'grid', placeItems: 'center',
                    fontWeight: 900, fontSize: 12,
                  }}>0{i + 1}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', letterSpacing: -0.2 }}>
                    {e.name}
                  </span>
                </div>
                <span style={{
                  marginLeft: 38,
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
                  textTransform: 'uppercase', color: 'var(--text-3)',
                }}>{e.range}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓ 2 · CRONOLOGIA */}
      <section id="esq-timeline" style={{ padding: '32px 0 12px', scrollMarginTop: 80 }}>
        <SectionHeader
          n="02"
          label="Cronologia"
          title={`${esquema.timeline.length} fites clau`}
          sub="Marcades amb ★ les imprescindibles. Color per etapa."
        />

        <div style={{ marginTop: 18, marginBottom: 14, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {esquema.eras.map((e) => (
            <div key={e.id} style={{
              flex: '1 1 100px', padding: '8px 10px', borderRadius: 10,
              background: e.soft, color: e.color,
              fontSize: 11, fontWeight: 800, letterSpacing: 0.4,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 8, minWidth: 0,
            }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: 10, opacity: 0.7, whiteSpace: 'nowrap',
              }}>{e.range.split(' ').pop()}</span>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', paddingLeft: 30, marginTop: 14 }}>
          <div style={{
            position: 'absolute', left: 20, top: 12, bottom: 12, width: 2,
            background: 'var(--line)',
          }} />
          {esquema.timeline.map((m, i) => (
            <TimelineRow
              key={i}
              milestone={m}
              era={erasById[m.eraId]}
              item={m.itemId ? itemsById[m.itemId] : undefined}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓ 3 · ITEMS (articles / tipus / categories…) */}
      <section id="esq-items" style={{ padding: '32px 0 12px', scrollMarginTop: 80 }}>
        <SectionHeader
          n="03"
          label={itemsLabel}
          title={`${esquema.items.length} ${itemsLabel.toLowerCase()} que has de saber`}
          sub="El que realment cau a l'examen — agrupat per blocs."
          tone="navy"
        />
        <div className="esq-people-grid" style={{ marginTop: 20 }}>
          {esquema.items.map((p) => (
            <ItemCard key={p.id} item={p} era={erasById[p.eraId]} />
          ))}
        </div>
      </section>

      {/* SECCIÓ 4 · PER A L'EXAMEN */}
      <section id="esq-examen" style={{ padding: '32px 0 0', scrollMarginTop: 80 }}>
        <SectionHeader
          n="04"
          label="Per a l'examen"
          title={`${esquema.exam.length} fets que cauen quasi sempre`}
          sub="Les preguntes tipus test es repeteixen — assegura't aquests."
        />

        <div className="esq-exam-grid" style={{ marginTop: 20 }}>
          {esquema.exam.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 18px', borderRadius: 14,
              background: V.surface, border: '1px solid var(--line)',
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 14,
                background: BLUE, color: '#fff',
                display: 'grid', placeItems: 'center',
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontWeight: 800, fontSize: 12, flexShrink: 0,
              }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 11, fontWeight: 800, letterSpacing: 1.4,
                  color: BLUE, textTransform: 'uppercase',
                }}>{it.date}</div>
                <div style={{
                  marginTop: 2, fontSize: 14.5, fontWeight: 600,
                  color: 'var(--ink)', lineHeight: 1.45,
                }}>{it.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA · test */}
        {esquema.testSlug && (
          <div style={{
            marginTop: 28, padding: '22px 24px', borderRadius: 18,
            background: NAVY, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 18, flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 220 }}>
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: 11, fontWeight: 800, letterSpacing: 2,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
              }}>LLEST?</div>
              <div style={{
                fontSize: 22, fontWeight: 900, letterSpacing: -0.3, marginTop: 4,
              }}>Posa-ho a prova amb un test cronometrat</div>
              <div style={{
                fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginTop: 4,
              }}>20 preguntes · 10 minuts · sense penalització.</div>
            </div>
            <Link
              to={`/policia-local/${esquema.testSlug}`}
              style={{
                padding: '13px 22px', borderRadius: 999,
                background: BLUE, color: '#fff',
                fontWeight: 800, fontSize: 15, letterSpacing: -0.2,
                display: 'inline-flex', alignItems: 'center', gap: 9,
                textDecoration: 'none',
                boxShadow: '0 -3px 0 rgba(0,0,0,0.18) inset',
              }}
            >
              Començar test →
            </Link>
          </div>
        )}
      </section>

      <div
        className="page-foot"
        style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
      >
        <Link to="/policia-local/esquemes" className="btn btn-ghost">
          ← Tots els esquemes
        </Link>
      </div>

      <style>{`
        .esq-eras-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .esq-people-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .esq-exam-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .esq-eras-grid { grid-template-columns: repeat(2, 1fr); }
          .esq-people-grid { grid-template-columns: repeat(2, 1fr); }
          .esq-exam-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .esq-eras-grid { grid-template-columns: 1fr; }
          .esq-people-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function SectionHeader({
  n, label, title, sub, tone = 'blue',
}: {
  n: string; label: string; title: string; sub?: string; tone?: 'blue' | 'navy';
}) {
  const c = tone === 'navy' ? NAVY : BLUE;
  const cs = tone === 'navy' ? '#D2D8E5' : BLUE_SOFT;
  const ci = tone === 'navy' ? NAVY : BLUE_INK;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          width: 34, height: 34, borderRadius: 10, background: cs, color: ci,
          display: 'grid', placeItems: 'center',
          fontWeight: 900, fontSize: 14, letterSpacing: -0.4,
        }}>{n}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 13, fontWeight: 800, letterSpacing: 3,
          textTransform: 'uppercase', color: c,
        }}>{label}</span>
      </div>
      <h2 style={{
        margin: 0, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900,
        letterSpacing: -0.6, lineHeight: 1.12, color: 'var(--ink)',
      }}>{title}</h2>
      {sub && (
        <div style={{
          marginTop: 4, fontSize: 14.5, color: 'var(--text-2)', fontWeight: 500,
        }}>{sub}</div>
      )}
    </div>
  );
}

function TimelineRow({
  milestone, era, item,
}: {
  milestone: LleiMilestone;
  era: LleiEra;
  item?: LleiItem;
}) {
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 18,
      marginBottom: 14,
    }}>
      <div style={{
        position: 'absolute', left: -10, top: 16,
        width: 22, height: 22, borderRadius: 10,
        background: era.color, color: '#fff',
        display: 'grid', placeItems: 'center',
        border: '3px solid var(--paper)',
        boxShadow: `0 0 0 1px ${era.color}33`,
        fontSize: 11, fontWeight: 900,
      }}>{milestone.star ? '★' : ''}</div>

      <div style={{
        flex: 1, marginLeft: 22, padding: '14px 18px',
        background: '#fff', borderRadius: 14,
        border: '1px solid var(--line)',
        borderLeft: `3px solid ${era.color}`,
        display: 'flex', alignItems: 'flex-start', gap: 18,
        flexWrap: 'wrap',
      }}>
        <div style={{ minWidth: 140, flexShrink: 0 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 13, fontWeight: 800, letterSpacing: 1.4,
            textTransform: 'uppercase', color: era.color,
          }}>{milestone.date}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 10, fontWeight: 600, letterSpacing: 1.4,
            textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2,
          }}>{era.name}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            fontSize: 16, fontWeight: 800, color: 'var(--ink)',
            letterSpacing: -0.2, lineHeight: 1.36,
          }}>{milestone.title}</div>
          {milestone.note && (
            <div style={{
              marginTop: 3, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.4,
            }}>{milestone.note}</div>
          )}
        </div>
        {item && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px', borderRadius: 999,
            background: era.soft, color: era.color,
            fontSize: 12, fontWeight: 800,
            flexShrink: 0, alignSelf: 'flex-start',
            border: `1px solid ${era.color}33`,
            whiteSpace: 'nowrap',
          }}>
            <ItemBadge item={item} era={era} size={22} />
            {item.name}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item, era }: { item: LleiItem; era: LleiEra }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18,
      border: '1px solid var(--line)',
      padding: 20,
      display: 'flex', flexDirection: 'column', gap: 14,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: era.color,
      }} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: 4 }}>
        <ItemBadge item={item} era={era} size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11, fontWeight: 800, letterSpacing: 1.4,
            textTransform: 'uppercase', color: era.color,
            display: 'inline-block', padding: '3px 8px', borderRadius: 6,
            background: era.soft, marginBottom: 6,
          }}>{era.name}</div>
          <div style={{
            fontSize: 19, fontWeight: 900, letterSpacing: -0.4, lineHeight: 1.1,
            color: 'var(--ink)',
          }}>{item.name}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)',
            marginTop: 4, letterSpacing: 0.6,
          }}>{item.period}</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', borderRadius: 10,
        background: 'var(--paper)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 4, background: era.color, flexShrink: 0,
        }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{item.role}</span>
      </div>

      <p style={{
        margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-2)',
      }}>{item.fact}</p>
    </div>
  );
}

function ItemBadge({
  item, era, size,
}: {
  item: LleiItem; era: LleiEra; size: number;
}) {
  // Badge gros amb el número/codi de l'item (article, escala, etc.)
  // Tipografia mono i fons sòlid de l'era. Visual de "etiqueta-codi".
  const initialsLen = item.initials.length;
  // Mida tipo adaptativa: més caràcters = font més petita
  const fontSize = size * (initialsLen >= 4 ? 0.28 : initialsLen >= 3 ? 0.34 : 0.42);
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4,
      background: era.color,
      display: 'grid', placeItems: 'center', flexShrink: 0,
      border: `2px solid ${era.color}`,
      boxShadow: `0 0 0 3px ${era.soft}`,
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize, fontWeight: 800, color: '#fff',
        letterSpacing: -0.4, lineHeight: 1,
      }}>{item.initials}</span>
    </div>
  );
}
