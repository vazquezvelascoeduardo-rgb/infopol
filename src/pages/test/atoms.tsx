// Àtoms compartits entre la zona de tests de /policia-local i /mossos.
// Extrets de TestList.tsx perquè MossosList els pugui reutilitzar i
// que les dues seccions tinguin el mateix look-and-feel.
//
// Tots els àtoms són purament visuals + accepten `accent` / `basePath`
// per personalitzar color i ruta segons la secció que els fa servir.
import { Link } from 'react-router-dom';
import { TOPICS } from '../../data/tests';
import type { TestTopic } from '../../data/tests/types';
import { getTopicStats, levelFromBest, type Level } from '../../lib/testStats';
import { A, Ic, Mono, Card, Chip } from '../../lib/design';

export const LEVEL_LABEL: Record<Level, string> = {
  none: 'Sense començar',
  novice: 'Principiant',
  intermediate: 'Intermedi',
  advanced: 'Avançat',
  expert: 'Expert',
};

/* ── Stat personal (encerts / ratxa / tests fets / nivell) ── */
export function PStat({
  icon, color, label, value, sub,
}: { icon: string; color: string; label: string; value: string; sub?: string }) {
  return (
    <Card pad={16} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Ic name={icon} size={15} color={color} fill sw={2.2} />
        <Mono size={10}>{label}</Mono>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontFamily: A.display, fontWeight: 700, fontSize: 26, color: A.ink, lineHeight: 1 }}>
          {value}
        </span>
        {sub && <Mono size={9} color={A.inkMuted}>{sub}</Mono>}
      </div>
    </Card>
  );
}

/* ── Capçalera de secció (icona + títol + subtítol) ── */
export function SecHead({
  icon, color, title, sub,
}: { icon: string; color: string; title: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ width: 38, height: 38, borderRadius: 11, background: color, display: 'grid', placeItems: 'center', boxShadow: A.inset, flexShrink: 0 }}>
        <Ic name={icon} size={20} color="#fff" sw={2.1} />
      </span>
      <div>
        <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 19, color: A.ink, letterSpacing: -0.4 }}>
          {title}
        </div>
        {sub && <Mono size={10} color={A.inkMuted}>{sub}</Mono>}
      </div>
    </div>
  );
}

/* ── Mode gran (Tot el temari · Repàs · etc.) ── */
export function BigMode({
  to, fons, tag, title, desc, meta, cta, wide = false, min = 170,
}: {
  to: string; fons: string; tag: string; title: string; desc: string;
  meta: string; cta: string; wide?: boolean; min?: number;
}) {
  return (
    <Link to={to} style={{ textDecoration: 'none', gridColumn: wide ? '1 / -1' : undefined }}>
      <div
        className="a-hover"
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: A.rxl,
          background: fons, color: '#fff', padding: 24,
          boxShadow: A.shadowMd, minHeight: min,
          display: 'flex', flexDirection: 'column', height: '100%',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ position: 'relative', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '5px 12px' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} />
          <Mono size={10} color="#fff" style={{ letterSpacing: 1 }}>{tag}</Mono>
        </span>
        <h3 style={{ position: 'relative', margin: '14px 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.15 }}>
          {title}
        </h3>
        <p style={{ position: 'relative', margin: 0, fontSize: 13.5, lineHeight: 1.45, opacity: 0.92, maxWidth: 460 }}>
          {desc}
        </p>
        <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Mono size={10} color="#fff" style={{ opacity: 0.85 }}>{meta}</Mono>
          <span className="a-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: A.ink, borderRadius: 12, padding: '10px 18px', fontFamily: A.display, fontWeight: 700, fontSize: 14, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}>
            {cta} <Ic name="arrow" size={15} color={A.ink} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Card d'un tema concret (amb estats personals + progrés) ── */
export function TopicCard({
  topic, to, accent,
}: { topic: TestTopic; to: string; accent: string }) {
  const st = getTopicStats(topic.slug);
  const level = levelFromBest(st?.best);
  const pct = st?.best ? Math.min(100, Math.round((st.best / 10) * 100)) : 0;
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Card pad={16} hover style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{topic.icon}</span>
          <Mono size={9} color={pct > 0 ? A.green : A.inkFaint}>{LEVEL_LABEL[level]}</Mono>
        </div>
        <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.2, lineHeight: 1.2 }}>
          {topic.title}
        </div>
        {topic.description && (
          <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.inkMuted, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {topic.description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          {topic.badge && <Chip tone="terracota">{topic.badge}</Chip>}
          <Mono size={10}>{topic.questions.length} preguntes</Mono>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: A.bgDeep, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: accent }} />
          </div>
          <Mono size={10} color={pct > 0 ? accent : A.inkFaint}>{pct}%</Mono>
        </div>
      </Card>
    </Link>
  );
}

/* ── Fila de "últims tests" ── */
export function RecentRow({
  slug, best, last, attempts, lastAt, basePath,
}: {
  slug: string; best: number; last: number; attempts: number; lastAt: number;
  basePath: string;
}) {
  const topic = TOPICS.find((x) => x.slug === slug);
  if (!topic) return null;
  const grade = last || best;
  const score10 = Math.round(grade * 10) / 10;
  const tone = grade >= 7 ? A.green : grade >= 5 ? A.amber : A.red;
  return (
    <Link to={`${basePath}/${slug}`} style={{ textDecoration: 'none' }}>
      <Card pad={14} hover style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: tone, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: A.display, fontWeight: 700, fontSize: 16, flexShrink: 0, boxShadow: A.inset }}>
          {score10}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15, color: A.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {topic.title}
          </div>
          <Mono size={10}>
            {attempts} {attempts === 1 ? 'intent' : 'intents'} · millor {best.toFixed(1)} · {relTime(lastAt)}
          </Mono>
        </div>
        <Ic name="arrow" size={17} color={A.inkFaint} />
      </Card>
    </Link>
  );
}

function relTime(ts: number): string {
  if (!ts) return '—';
  const d = Math.floor((Date.now() - ts) / 86400000);
  const h = Math.floor((Date.now() - ts) / 3600000);
  if (h < 1) return 'ara mateix';
  if (h < 24) return `fa ${h} h`;
  if (d < 7) return `fa ${d} d`;
  return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
