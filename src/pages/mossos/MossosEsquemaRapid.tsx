// Esquema ràpid · format visual alternatiu al temari clàssic.
// 4 seccions navegables: Resum / Línia temporal / Personatges / Examen.
// El contingut viu a `src/data/esquemas.ts`. Per ara només A.1 disponible.

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getEsquemaForTemaSlug,
  type Era,
  type EsquemaPerson,
  type Milestone,
} from '../../data/esquemas';

const SECTIONS = [
  { id: 'resum', label: 'Resum', icon: '🚩' },
  { id: 'timeline', label: 'Línia temporal', icon: '⏱' },
  { id: 'personatges', label: 'Personatges', icon: '👤' },
  { id: 'examen', label: "Per a l'examen", icon: '✅' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

const TERRACOTA = '#FF7A1A';
const TERRACOTA_SOFT = '#FFE0CB';
const TERRACOTA_INK = '#7A2E04';
const CREAM = '#FFF7E8';
const CREAM_BORDER = '#F0D89A';
const CREAM_INK = '#3C2A08';

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

export default function MossosEsquemaRapid() {
  const { slug = '' } = useParams();
  const esquema = useMemo(() => getEsquemaForTemaSlug(slug), [slug]);
  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useActive(sectionIds);

  if (!esquema) {
    return (
      <div className="shell py-6">
        <p style={{ color: 'var(--text-2)' }}>
          No existeix esquema ràpid per a aquest tema encara.
        </p>
        <Link to="/mossos/temari" style={{ color: TERRACOTA, textDecoration: 'underline' }}>
          ← Tornar al temari
        </Link>
      </div>
    );
  }

  const erasById: Record<string, Era> = Object.fromEntries(
    esquema.eras.map((e) => [e.id, e]),
  );
  const peopleById: Record<string, EsquemaPerson> = Object.fromEntries(
    esquema.people.map((p) => [p.id, p]),
  );

  return (
    <article className="shell" style={{ maxWidth: 1100, paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <nav className="crumbs">
        <Link to="/">Inici</Link>
        <span className="sep">/</span>
        <Link to="/mossos">Mossos</Link>
        <span className="sep">/</span>
        <Link to="/mossos/esquemes">Esquemes ràpids</Link>
        <span className="sep">/</span>
        <span className="here">{esquema.kicker.replace(/^.*TEMA\s+/, 'TEMA ')}</span>
      </nav>

      {/* HERO */}
      <header style={{ paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999,
              background: TERRACOTA_SOFT, color: TERRACOTA_INK,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 11, fontWeight: 800,
              letterSpacing: 2, textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 3, background: TERRACOTA }} />
            {esquema.kicker}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
            color: 'var(--text-3)',
            textTransform: 'uppercase',
          }}>FORMAT NOU · ESQUEMA RÀPID</span>
        </div>

        <h1 style={{
          margin: 0, fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900,
          letterSpacing: -1.4, lineHeight: 1.04, color: 'var(--ink)',
        }}>
          {esquema.title}
          {esquema.titleHighlight && (
            <span style={{ color: TERRACOTA }}>{' '}{esquema.titleHighlight}</span>
          )}
        </h1>

        {/* KPIs */}
        <div style={{ display: 'flex', gap: 22, marginTop: 16, flexWrap: 'wrap' }}>
          {esquema.kpis.map((k, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: k.mono
                  ? 'JetBrains Mono, ui-monospace, monospace'
                  : 'inherit',
                fontSize: 22, fontWeight: 900, color: 'var(--ink)',
                letterSpacing: -0.5,
              }}>{k.value}</span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text-2)',
              }}>{k.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* TAB NAV — sticky */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          marginTop: 24,
          background: 'var(--paper)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          padding: '0 2px',
        }}
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#esq-${s.id}`}
              style={{
                padding: '12px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                color: isActive ? TERRACOTA : 'var(--text-2)',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                borderBottom: `3px solid ${isActive ? TERRACOTA : 'transparent'}`,
                marginBottom: -1,
                whiteSpace: 'nowrap',
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
        <SectionHeader n="01" label="Resum" tone="terracota"
          title="L'arc que va de la prehistòria fins al 1716"
          sub="Tot allò que has de poder explicar en 5 minuts." />

        {/* EN UNA FRASE callout */}
        <div style={{
          marginTop: 18, padding: '24px 26px',
          background: CREAM, borderRadius: 18,
          border: `1px solid ${CREAM_BORDER}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -12, left: 18,
            padding: '4px 12px', borderRadius: 999,
            background: '#fff', border: `1px solid ${CREAM_BORDER}`,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11, fontWeight: 800, letterSpacing: 2,
            textTransform: 'uppercase', color: '#8A5A0B',
          }}>EN UNA FRASE</div>
          <p style={{
            margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.5,
            color: CREAM_INK, letterSpacing: -0.1,
          }}>{esquema.introOneLiner}</p>
        </div>

        {/* 9 etapes */}
        <div style={{ marginTop: 22 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 12, fontWeight: 800, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--text-3)',
            marginBottom: 12,
          }}>{`${esquema.eras.length} ETAPES · DE LA PREHISTÒRIA AL S. XVIII`}</div>
          <div className="esquema-eras-grid">
            {esquema.eras.map((e, i) => (
              <div
                key={e.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: '#fff',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8, background: e.soft, color: e.color,
                    display: 'grid', placeItems: 'center',
                    fontWeight: 900, fontSize: 12,
                  }}>0{i + 1}</span>
                  <span style={{
                    fontSize: 15, fontWeight: 800, color: 'var(--ink)',
                    letterSpacing: -0.2,
                  }}>{e.name}</span>
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

      {/* SECCIÓ 2 · LÍNIA TEMPORAL */}
      <section id="esq-timeline" style={{ padding: '32px 0 12px', scrollMarginTop: 80 }}>
        <SectionHeader n="02" label="Línia temporal"
          title={`${esquema.timeline.length} dates clau de la història de Catalunya`}
          sub="Marcades amb ★ les imprescindibles. Color per època." />

        {/* Mini eras strip */}
        <div style={{ marginTop: 18, marginBottom: 14, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {esquema.eras.map((e) => (
            <div key={e.id} style={{
              flex: '1 1 100px', padding: '8px 10px', borderRadius: 8,
              background: e.soft, color: e.color,
              fontSize: 11, fontWeight: 800, letterSpacing: 0.4,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 8, minWidth: 0,
            }}>
              <span style={{
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{e.name}</span>
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: 10, opacity: 0.7, whiteSpace: 'nowrap',
              }}>{e.range.split(' ').pop()}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
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
              person={m.personId ? peopleById[m.personId] : undefined}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓ 3 · PERSONATGES */}
      <section id="esq-personatges" style={{ padding: '32px 0 12px', scrollMarginTop: 80 }}>
        <SectionHeader n="03" label="Personatges" tone="blue"
          title={`${esquema.people.length} noms que has de saber col·locar`}
          sub="Qui van ser, en quina època i per quin fet són importants." />
        <div className="esquema-people-grid" style={{ marginTop: 20 }}>
          {esquema.people.map((p) => (
            <PersonCard key={p.id} person={p} era={erasById[p.eraId]} />
          ))}
        </div>
      </section>

      {/* SECCIÓ 4 · PER A L'EXAMEN */}
      <section id="esq-examen" style={{ padding: '32px 0 0', scrollMarginTop: 80 }}>
        <SectionHeader n="04" label="Per a l'examen"
          title={`${esquema.exam.length} fets que cauen quasi sempre`}
          sub="Les preguntes tipus test es repeteixen — assegura't aquests." />

        <div className="esquema-exam-grid" style={{ marginTop: 20 }}>
          {esquema.exam.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 18px', borderRadius: 14,
              background: '#fff', border: '1px solid var(--line)',
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 15,
                background: TERRACOTA, color: '#fff',
                display: 'grid', placeItems: 'center',
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontWeight: 800, fontSize: 12, flexShrink: 0,
              }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 11, fontWeight: 800, letterSpacing: 1.4,
                  color: TERRACOTA, textTransform: 'uppercase',
                }}>{it.date}</div>
                <div style={{
                  marginTop: 2, fontSize: 14.5, fontWeight: 600,
                  color: 'var(--ink)', lineHeight: 1.45,
                }}>{it.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA · fer test */}
        {esquema.testHref && (
          <div style={{
            marginTop: 28, padding: '22px 24px', borderRadius: 18,
            background: 'var(--ink)', color: '#fff',
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
              }}>Posa'l a prova amb un test cronometrat</div>
              <div style={{
                fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginTop: 4,
              }}>20 preguntes · 10 minuts · sense penalització.</div>
            </div>
            <Link
              to={esquema.testHref}
              style={{
                padding: '13px 22px', borderRadius: 999,
                background: TERRACOTA, color: '#fff',
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

      {/* Tornar al llistat */}
      <div
        className="page-foot"
        style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
      >
        <Link to="/mossos/esquemes" className="btn btn-ghost">
          ← Tots els esquemes
        </Link>
        <Link
          to={`/mossos/temari/${esquema.ambit.toLowerCase()}/${esquema.temaSlug}`}
          className="btn btn-ghost"
          style={{ color: 'var(--text-2)' }}
        >
          Veure tema complet al temari →
        </Link>
      </div>

      {/* Grids responsive sense Tailwind dependency */}
      <style>{`
        .esquema-eras-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .esquema-people-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .esquema-exam-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .esquema-eras-grid { grid-template-columns: repeat(2, 1fr); }
          .esquema-people-grid { grid-template-columns: repeat(2, 1fr); }
          .esquema-exam-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .esquema-eras-grid { grid-template-columns: 1fr; }
          .esquema-people-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </article>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function SectionHeader({
  n, label, title, sub, tone = 'terracota',
}: {
  n: string;
  label: string;
  title: string;
  sub?: string;
  tone?: 'terracota' | 'blue';
}) {
  const c = tone === 'blue' ? '#3B6BF5' : TERRACOTA;
  const cs = tone === 'blue' ? '#D8E2FE' : TERRACOTA_SOFT;
  const ci = tone === 'blue' ? '#0E2B7A' : TERRACOTA_INK;
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
  milestone, era, person,
}: {
  milestone: Milestone;
  era: Era;
  person?: EsquemaPerson;
}) {
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 18,
      marginBottom: 14,
    }}>
      {/* Dot */}
      <div style={{
        position: 'absolute', left: -10, top: 16,
        width: 22, height: 22, borderRadius: 11,
        background: era.color, color: '#fff',
        display: 'grid', placeItems: 'center',
        border: '3px solid var(--paper)',
        boxShadow: `0 0 0 1px ${era.color}33`,
        fontSize: 11, fontWeight: 900,
      }}>{milestone.star ? '★' : ''}</div>

      {/* Card */}
      <div className="esquema-timeline-card" style={{
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
        {person && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px', borderRadius: 999,
            background: era.soft, color: era.color,
            fontSize: 12, fontWeight: 800,
            flexShrink: 0, alignSelf: 'flex-start',
            border: `1px solid ${era.color}33`,
            whiteSpace: 'nowrap',
          }}>
            <PersonAvatar person={person} era={era} size={22} />
            {person.name.split(' ').slice(0, 2).join(' ')}
          </div>
        )}
      </div>
    </div>
  );
}

function PersonCard({ person, era }: { person: EsquemaPerson; era: Era }) {
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
        <PersonAvatar person={person} era={era} size={72} />
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
          }}>{person.name}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)',
            marginTop: 4, letterSpacing: 0.6,
          }}>{person.period}</div>
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
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{person.role}</span>
      </div>

      <p style={{
        margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-2)',
      }}>{person.fact}</p>
    </div>
  );
}

function PersonAvatar({
  person, era, size,
}: {
  person: EsquemaPerson;
  era: Era;
  size: number;
}) {
  // Silueta abstracta + icona característica + inicials
  const isLarge = size >= 40;
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4,
      background: era.soft, border: `1px solid ${era.color}33`,
      display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden',
      position: 'relative',
    }}>
      <svg width={size * 0.85} height={size * 0.85} viewBox="0 0 64 64">
        <path d="M6 60 C 8 50 18 44 32 44 C 46 44 56 50 58 60 L 58 64 L 6 64 Z"
          fill={era.color} opacity="0.78" />
        <circle cx="32" cy="30" r="14" fill={era.color} opacity="0.78" />
      </svg>
      {isLarge && (
        <span style={{
          position: 'absolute', bottom: 3, right: 4,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: size * 0.18, fontWeight: 800, color: era.color,
          background: 'rgba(255,255,255,0.9)',
          padding: '1px 4px', borderRadius: 4, letterSpacing: 0.4,
        }}>{person.initials}</span>
      )}
      {!isLarge && (
        <span style={{
          position: 'absolute',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: size * 0.42, fontWeight: 800, color: era.color,
          background: 'rgba(255,255,255,0.92)',
          padding: '1px 3px', borderRadius: 3, letterSpacing: 0.2,
        }}>{person.initials}</span>
      )}
    </div>
  );
}
